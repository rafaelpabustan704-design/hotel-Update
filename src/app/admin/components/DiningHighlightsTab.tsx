'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Flame, Save, X } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import ConfirmModal from './ConfirmModal';
import type { DiningHighlight } from '@/types';
import { resolveIcon } from '@/utils/icons';
import IconPicker from './IconPicker';

interface Props {
  highlights: DiningHighlight[];
  onAdd: (data: Omit<DiningHighlight, 'id'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<DiningHighlight>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<DiningHighlight, 'id'> = { icon: 'Star', title: '', description: '' };

export default function DiningHighlightsTab({ highlights, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DiningHighlight | null>(null);

  const startAdd = () => { setForm(empty); setAdding(true); setEditing(null); };
  const startEdit = (d: DiningHighlight) => { setForm({ icon: d.icon, title: d.title, description: d.description }); setEditing(d.id); setAdding(false); };
  const cancel = () => { setAdding(false); setEditing(null); };

  const handleSave = async () => {
    if (adding) await onAdd(form);
    else if (editing) await onUpdate(editing, form);
    cancel();
  };

  const formUI = (
    <div className={`${cardCls} p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-hotel-900 dark:text-white">{adding ? 'Add Highlight' : 'Edit Highlight'}</h4>
        <button onClick={cancel} className="text-hotel-400 hover:text-hotel-600 transition-colors"><X className="h-5 w-5" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>Icon</label><IconPicker value={form.icon} onChange={(icon) => setForm((p) => ({ ...p, icon }))} category="dining" /></div>
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"><Flame className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Why Dine With Us</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">{highlights.length} highlight{highlights.length !== 1 ? 's' : ''}</p></div>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Plus className="h-4 w-4" />Add</button>
      </div>

      {(adding || editing) && formUI}

      <div className="grid sm:grid-cols-2 gap-3">
        {highlights.map((h) => {
          const Icon = resolveIcon(h.icon);
          return (
            <div key={h.id} className={`${cardCls} p-4 flex items-start gap-3`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hotel-100 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 shrink-0"><Icon className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-hotel-900 dark:text-white">{h.title}</p>
                <p className="text-xs text-hotel-500 dark:text-hotel-400 mt-0.5">{h.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(h)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteTarget(h)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {deleteTarget && (
        <ConfirmModal title="Delete Highlight" message={`Delete "${deleteTarget.title}"?`} onConfirm={async () => { await onDelete(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
