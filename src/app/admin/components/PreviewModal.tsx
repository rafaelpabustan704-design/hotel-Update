'use client';

import { useEffect, type ReactNode } from 'react';
import { X, Eye } from 'lucide-react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function PreviewModal({ title, onClose, children }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex flex-col h-full max-h-screen">
        <div className="shrink-0 flex items-center justify-between bg-hotel-900 px-4 py-2.5 shadow-lg">
          <div className="flex items-center gap-2.5 text-white">
            <Eye className="h-4 w-4 text-gold-400" />
            <span className="text-sm font-semibold">{title}</span>
            <span className="rounded-full bg-gold-600/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-400">
              Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white dark:bg-dark-bg">
          {children}
        </div>
      </div>
    </div>
  );
}
