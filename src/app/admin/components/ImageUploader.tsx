'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { validateImage, getPresetHint, type ImagePresetId } from '@/lib/imageValidation';

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || 'Upload failed');
  }
  const data = await res.json();
  return data.url as string;
}

/* ─── Single image uploader (for logo, favicon, hero bg, etc.) ─── */

interface SingleProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Preset for aspect ratio, size, and type validation. Default "thumbnail". */
  preset?: ImagePresetId;
  /** Override accept string; if not set, derived from preset. */
  accept?: string;
  compact?: boolean;
}

const DEFAULT_SINGLE_ACCEPT = 'image/jpeg,image/png,image/webp';

export function SingleImageUploader({ value, onChange, label, preset = 'thumbnail', accept, compact = false }: SingleProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptStr = accept ?? (preset === 'favicon' ? 'image/png,image/x-icon,image/svg+xml' : DEFAULT_SINGLE_ACCEPT);
  const hint = getPresetHint(preset);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const result = await validateImage(file, preset);
      if (!result.valid) {
        setError(result.error ?? 'Validation failed');
        setUploading(false);
        return;
      }
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }, [onChange, preset]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/') || file?.type === 'image/svg+xml') handleFile(file);
  }, [handleFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {value ? (
          <div className="group relative h-12 w-12 rounded-lg overflow-hidden border border-hotel-200 dark:border-dark-border shrink-0">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => { onChange(''); setError(null); }} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-hotel-300 dark:border-dark-border text-hotel-400 shrink-0">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg border border-hotel-200 dark:border-dark-border px-3 py-2 text-xs font-medium text-hotel-600 dark:text-hotel-300 hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Uploading...' : value ? 'Change' : 'Upload'}
          </button>
          {error && (
            <p className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span className="truncate">{error}</span>
            </p>
          )}
        </div>
        <input ref={fileRef} type="file" accept={acceptStr} className="hidden" onChange={onFileChange} />
      </div>
    );
  }

  return (
    <div>
      {label && <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><ImageIcon className="h-4 w-4 text-hotel-400" />{label}</p>}
      {value && (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-hotel-100 dark:border-dark-border group h-40">
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button type="button" onClick={() => { onChange(''); setError(null); }} className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${
          dragOver
            ? 'border-gold-400 bg-gold-50/50 dark:bg-gold-900/10'
            : 'border-hotel-200 dark:border-dark-border hover:border-gold-400 hover:bg-hotel-50/50 dark:hover:bg-dark-bg/50'
        }`}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 text-gold-500 animate-spin" />
        ) : (
          <Upload className="h-6 w-6 text-hotel-400" />
        )}
        <p className="text-sm text-hotel-500 dark:text-hotel-400">
          {uploading ? 'Uploading...' : 'Click or drag image here'}
        </p>
        <p className="text-[10px] text-hotel-400 dark:text-hotel-500">{hint}</p>
      </div>
      <input ref={fileRef} type="file" accept={acceptStr} className="hidden" onChange={onFileChange} />
    </div>
  );
}

/* ─── Multiple images uploader (for carousels, room galleries) ─── */

interface MultiProps {
  images: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  /** Preset for aspect ratio, size, and type validation. Default "gallery". */
  preset?: ImagePresetId;
}

export function MultiImageUploader({ images, onChange, label, preset = 'gallery' }: MultiProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hint = getPresetHint(preset);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const fileList = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileList.length === 0) {
      setError('No valid image files. Use JPG, PNG, or WEBP.');
      return;
    }
    setUploading(true);
    try {
      for (const file of fileList) {
        const result = await validateImage(file, preset);
        if (!result.valid) {
          setError(result.error ?? 'Validation failed');
          setUploading(false);
          if (fileRef.current) fileRef.current.value = '';
          return;
        }
      }
      const urls = await Promise.all(fileList.map((f) => uploadFile(f)));
      onChange([...images, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }, [images, onChange, preset]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const remove = (index: number) => { onChange(images.filter((_, i) => i !== index)); setError(null); };

  return (
    <div>
      {label && <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><ImageIcon className="h-4 w-4 text-hotel-400" />{label}</p>}
      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((src, i) => (
            <div key={i} className="group relative h-20 w-20 rounded-lg overflow-hidden border border-hotel-200 dark:border-dark-border">
              {src && <img src={src} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />}
              <button type="button" onClick={() => remove(i)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 cursor-pointer transition-colors ${
          dragOver
            ? 'border-gold-400 bg-gold-50/50 dark:bg-gold-900/10'
            : 'border-hotel-200 dark:border-dark-border hover:border-gold-400 hover:bg-hotel-50/50 dark:hover:bg-dark-bg/50'
        }`}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 text-gold-500 animate-spin shrink-0" />
        ) : (
          <Upload className="h-4 w-4 text-hotel-400 shrink-0" />
        )}
        <span className="text-sm text-hotel-500 dark:text-hotel-400">
          {uploading ? 'Uploading...' : 'Click or drag images here'}
        </span>
        <span className="text-[10px] text-hotel-400 dark:text-hotel-500 hidden sm:inline">— {hint}</span>
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}
