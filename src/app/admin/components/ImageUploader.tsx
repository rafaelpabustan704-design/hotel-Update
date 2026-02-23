'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url as string;
}

/* ─── Single image uploader (for logo, favicon, hero bg, etc.) ─── */

interface SingleProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  compact?: boolean;
}

export function SingleImageUploader({ value, onChange, label, accept = 'image/*', compact = false }: SingleProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch { /* silently ignore */ }
    setUploading(false);
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) handleFile(file);
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
            <button type="button" onClick={() => onChange('')} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-hotel-300 dark:border-dark-border text-hotel-400 shrink-0">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-lg border border-hotel-200 dark:border-dark-border px-3 py-2 text-xs font-medium text-hotel-600 dark:text-hotel-300 hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? 'Uploading...' : value ? 'Change' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={onFileChange} />
      </div>
    );
  }

  return (
    <div>
      {label && <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><ImageIcon className="h-4 w-4 text-hotel-400" />{label}</p>}
      {value && (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-hotel-100 dark:border-dark-border group h-40">
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button type="button" onClick={() => onChange('')} className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
            <X className="h-3.5 w-3.5" />
          </button>
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
        <p className="text-[10px] text-hotel-400">PNG, JPG, WEBP up to 10MB</p>
      </div>
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={onFileChange} />
    </div>
  );
}

/* ─── Multiple images uploader (for carousels, room galleries) ─── */

interface MultiProps {
  images: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export function MultiImageUploader({ images, onChange, label }: MultiProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
      const urls = await Promise.all(imageFiles.map((f) => uploadFile(f)));
      onChange([...images, ...urls]);
    } catch { /* silently ignore */ }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }, [images, onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const remove = (index: number) => onChange(images.filter((_, i) => i !== index));

  return (
    <div>
      {label && <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><ImageIcon className="h-4 w-4 text-hotel-400" />{label}</p>}
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
        className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 cursor-pointer transition-colors ${
          dragOver
            ? 'border-gold-400 bg-gold-50/50 dark:bg-gold-900/10'
            : 'border-hotel-200 dark:border-dark-border hover:border-gold-400 hover:bg-hotel-50/50 dark:hover:bg-dark-bg/50'
        }`}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 text-gold-500 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 text-hotel-400" />
        )}
        <span className="text-sm text-hotel-500 dark:text-hotel-400">
          {uploading ? 'Uploading...' : 'Click or drag images here'}
        </span>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}
