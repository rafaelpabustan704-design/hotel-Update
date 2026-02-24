'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Pencil, Trash2, Sparkles, Save, X } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import ConfirmModal from './ConfirmModal';
import type { AmenityItem } from '@/types';
import { resolveIcon } from '@/utils/icons';
import IconPicker from './IconPicker';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface Props {
  amenities: AmenityItem[];
  onAdd: (data: Omit<AmenityItem, 'id'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<AmenityItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<AmenityItem, 'id'> = { icon: 'Star', title: '', description: '' };

export default function AmenitiesTab({ amenities, onAdd, onUpdate, onDelete }: Props) {
  const { setDraftOverride, savedAmenities } = useLandingContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AmenityItem | null>(null);
  const lastDraftKeyRef = useRef<string>('');

  const startAdd = () => { setForm(empty); setAdding(true); setEditing(null); };
  const startEdit = (a: AmenityItem) => { setForm({ icon: a.icon, title: a.title, description: a.description }); setEditing(a.id); setAdding(false); };
  const cancel = () => { setAdding(false); setEditing(null); };

  const effectiveAmenities = useMemo(() => (adding || editing)
    ? adding ? [...savedAmenities, { ...form, id: 'draft' } as AmenityItem] : savedAmenities.map((a) => a.id === editing ? { ...a, ...form } : a)
    : savedAmenities, [savedAmenities, form, adding, editing]);

  useEffect(() => {
    if (!adding && !editing) {
      lastDraftKeyRef.current = '';
      setDraftOverride('amenities', null);
      return;
    }
    const key = JSON.stringify(effectiveAmenities);
    if (lastDraftKeyRef.current === key) return;
    lastDraftKeyRef.current = key;
    setDraftOverride('amenities', effectiveAmenities);
  }, [adding, editing, effectiveAmenities, setDraftOverride]);

  const handleSave = useCallback(async () => {
    if (adding) await onAdd(form);
    else if (editing) await onUpdate(editing, form);
    setDraftOverride('amenities', null);
    cancel();
  }, [form, adding, editing, onAdd, onUpdate, setDraftOverride]);

  const formUI = (
    <div className={`${cardCls} p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-hotel-900 dark:text-white">{adding ? 'Add Amenity' : 'Edit Amenity'}</h4>
        <button onClick={cancel} className="text-hotel-400 hover:text-hotel-600 transition-colors"><X className="h-5 w-5" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>Icon</label><IconPicker value={form.icon} onChange={(icon) => setForm((p) => ({ ...p, icon }))} category="amenities" /></div>
        <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
      </div>
      <div><label className={labelCls}>Description</label><input className={inputCls} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
      <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-gold-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Save className="h-4 w-4" />Save</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"><Sparkles className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Amenities</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">{amenities.length} amenities</p></div>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Plus className="h-4 w-4" />Add</button>
      </div>

      {(adding || editing) && formUI}

      <div className="grid sm:grid-cols-2 gap-3">
        {amenities.map((a) => {
          const Icon = resolveIcon(a.icon);
          return (
            <div key={a.id} className={`${cardCls} p-4 flex items-start gap-3`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hotel-100 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 shrink-0"><Icon className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-hotel-900 dark:text-white">{a.title}</p>
                <p className="text-xs text-hotel-500 dark:text-hotel-400 mt-0.5">{a.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(a)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteTarget(a)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {deleteTarget && (
        <ConfirmModal title="Delete Amenity" message={`Delete "${deleteTarget.title}"?`} onConfirm={async () => { await onDelete(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
