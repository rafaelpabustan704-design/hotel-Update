'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-2xl p-6 text-center">
        <button onClick={onCancel} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-hotel-100 dark:hover:bg-hotel-800 hover:text-hotel-700 dark:hover:text-hotel-200 transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3 className="font-semibold text-hotel-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-hotel-500 dark:text-hotel-400 mb-6">{message}</p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-hotel-200 dark:border-dark-border px-4 py-2.5 text-sm font-medium text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-hotel-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 active:scale-[0.98]">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
