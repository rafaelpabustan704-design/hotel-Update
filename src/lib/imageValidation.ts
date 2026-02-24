/**
 * Reusable image validation for Admin Panel uploads.
 * Validates file type (JPG, PNG, WEBP), file size, and optional aspect ratio with tolerance.
 */

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const DEFAULT_ASPECT_TOLERANCE = 0.08; // 8% tolerance

/** Preset id for each image use case; used to pick aspect ratio and hints. */
export type ImagePresetId =
  | 'hero-banner'   // 16:9 – hero background
  | 'thumbnail'     // 1:1 – logo, signature dish, card thumbnails
  | 'gallery'       // 4:3 – about carousel, room gallery, restaurant image
  | 'favicon';     // no aspect check (favicon/icon)

export interface ImageValidationOptions {
  /** Required aspect ratio as [width, height], e.g. [16, 9]. Omit for no ratio check. */
  aspectRatio?: [number, number];
  /** Tolerance for aspect ratio (0–1). Default 0.08 (8%). */
  aspectTolerance?: number;
  /** Max file size in bytes. Default 10MB. */
  maxSizeBytes?: number;
  /** Allowed MIME types. Default JPG, PNG, WEBP. */
  allowedTypes?: readonly string[];
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

const PRESETS: Record<ImagePresetId, ImageValidationOptions> = {
  'hero-banner': { aspectRatio: [16, 9], aspectTolerance: DEFAULT_ASPECT_TOLERANCE, maxSizeBytes: DEFAULT_MAX_SIZE_BYTES, allowedTypes: ALLOWED_IMAGE_TYPES },
  'thumbnail':    { aspectRatio: [1, 1], aspectTolerance: DEFAULT_ASPECT_TOLERANCE, maxSizeBytes: DEFAULT_MAX_SIZE_BYTES, allowedTypes: ALLOWED_IMAGE_TYPES },
  'gallery':      { aspectRatio: [4, 3], aspectTolerance: DEFAULT_ASPECT_TOLERANCE, maxSizeBytes: DEFAULT_MAX_SIZE_BYTES, allowedTypes: ALLOWED_IMAGE_TYPES },
  'favicon':     { maxSizeBytes: 512 * 1024, allowedTypes: ['image/png', 'image/x-icon', 'image/svg+xml'] },
};

export function getValidationOptions(preset: ImagePresetId): ImageValidationOptions {
  return PRESETS[preset];
}

/** Get human-readable hint for a preset (e.g. "16:9, up to 10MB"). */
export function getPresetHint(preset: ImagePresetId): string {
  const opt = PRESETS[preset];
  const sizeMb = (opt.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES) / (1024 * 1024);
  if (opt.aspectRatio) {
    return `${opt.aspectRatio[0]}:${opt.aspectRatio[1]}, up to ${sizeMb}MB. JPG, PNG, WEBP only.`;
  }
  return `Up to ${sizeMb}MB. ${(opt.allowedTypes ?? ALLOWED_IMAGE_TYPES).join(', ')}.`;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}

function checkAspectRatio(
  width: number,
  height: number,
  target: [number, number],
  tolerance: number
): boolean {
  const targetRatio = target[0] / target[1];
  const actualRatio = width / height;
  const diff = Math.abs(actualRatio - targetRatio);
  const allowedDiff = targetRatio * tolerance;
  return diff <= allowedDiff;
}

/**
 * Validate file type and size synchronously.
 * Returns error message or undefined if valid.
 */
export function validateImageFileSync(
  file: File,
  options: ImageValidationOptions
): string | undefined {
  const allowed = options.allowedTypes ?? ALLOWED_IMAGE_TYPES;
  const maxSize = options.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;

  if (!allowed.includes(file.type as typeof allowed[number])) {
    return `Invalid file type. Allowed: ${allowed.join(', ')}.`;
  }
  if (file.size > maxSize) {
    const maxMb = (maxSize / (1024 * 1024)).toFixed(1);
    return `File too large. Maximum size is ${maxMb}MB.`;
  }
  return undefined;
}

/**
 * Full validation including aspect ratio (async).
 * Call this before uploading; if valid is false, show error and do not upload.
 */
export async function validateImage(
  file: File,
  options: ImageValidationOptions | ImagePresetId
): Promise<ImageValidationResult> {
  const opt = typeof options === 'string' ? PRESETS[options] : options;

  const syncError = validateImageFileSync(file, opt);
  if (syncError) return { valid: false, error: syncError };

  if (!opt.aspectRatio) return { valid: true };

  try {
    const { width, height } = await getImageDimensions(file);
    const tolerance = opt.aspectTolerance ?? DEFAULT_ASPECT_TOLERANCE;
    const valid = checkAspectRatio(width, height, opt.aspectRatio, tolerance);
    if (!valid) {
      return {
        valid: false,
        error: `Image aspect ratio must be ${opt.aspectRatio[0]}:${opt.aspectRatio[1]} (with small tolerance). Current dimensions: ${width}×${height}.`,
      };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Could not read image dimensions. Please use a valid image file.' };
  }
}
