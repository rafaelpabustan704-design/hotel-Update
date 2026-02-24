'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Pencil, Trash2, ChefHat, Save, X } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import { SingleImageUploader } from './ImageUploader';
import ConfirmModal from './ConfirmModal';
import type { SignatureDish } from '@/types';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface Props {
  dishes: SignatureDish[];
  onAdd: (data: Omit<SignatureDish, 'id'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<SignatureDish>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<SignatureDish, 'id'> = { image: '', title: '', description: '' };

export default function SignatureDishesTab({ dishes, onAdd, onUpdate, onDelete }: Props) {
  const { setDraftOverride, savedSignatureDishes } = useLandingContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SignatureDish | null>(null);
  const lastDraftKeyRef = useRef<string>('');

  const startAdd = () => { setForm(empty); setAdding(true); setEditing(null); };
  const startEdit = (d: SignatureDish) => { setForm({ image: d.image, title: d.title, description: d.description }); setEditing(d.id); setAdding(false); };
  const cancel = () => { setAdding(false); setEditing(null); };

  const effectiveDishes = useMemo(() => (adding || editing)
    ? adding
      ? [...savedSignatureDishes, { ...form, id: 'draft' } as SignatureDish]
      : savedSignatureDishes.map((d) => d.id === editing ? { ...d, ...form } : d)
    : savedSignatureDishes, [savedSignatureDishes, form, adding, editing]);

  useEffect(() => {
    if (!adding && !editing) {
      lastDraftKeyRef.current = '';
      setDraftOverride('signatureDishes', null);
      return;
    }
    const key = JSON.stringify(effectiveDishes);
    if (lastDraftKeyRef.current === key) return;
    lastDraftKeyRef.current = key;
    setDraftOverride('signatureDishes', effectiveDishes);
  }, [adding, editing, effectiveDishes, setDraftOverride]);

  const handleSave = useCallback(async () => {
    if (adding) await onAdd(form);
    else if (editing) await onUpdate(editing, form);
    setDraftOverride('signatureDishes', null);
    cancel();
  }, [form, adding, editing, onAdd, onUpdate, setDraftOverride]);

  const formUI = (
    <div className={`${cardCls} p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-hotel-900 dark:text-white">{adding ? 'Add Dish' : 'Edit Dish'}</h4>
        <button onClick={cancel} className="text-hotel-400 hover:text-hotel-600 transition-colors"><X className="h-5 w-5" /></button>
      </div>
      <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
      <div><label className={labelCls}>Description</label><input className={inputCls} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
      <SingleImageUploader label="Image" preset="thumbnail" value={form.image} onChange={(url) => setForm((p) => ({ ...p, image: url }))} />
      <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-gold-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Save className="h-4 w-4" />Save</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"><ChefHat className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Signature Dishes</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">{dishes.length} dish{dishes.length !== 1 ? 'es' : ''}</p></div>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Plus className="h-4 w-4" />Add Dish</button>
      </div>

      {(adding || editing) && formUI}

      <div className="grid sm:grid-cols-2 gap-3">
        {dishes.map((d) => (
          <div key={d.id} className={`${cardCls} overflow-hidden`}>
            {d.image && <img src={d.image} alt={d.title} className="h-32 w-full object-cover" />}
            <div className="p-4">
              <p className="font-semibold text-hotel-900 dark:text-white">{d.title}</p>
              <p className="text-xs text-hotel-500 dark:text-hotel-400 mt-1">{d.description}</p>
              <div className="flex gap-1 mt-3">
                <button onClick={() => startEdit(d)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteTarget(d)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <ConfirmModal title="Delete Dish" message={`Delete "${deleteTarget.title}"?`} onConfirm={async () => { await onDelete(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
