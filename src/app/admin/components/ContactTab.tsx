'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Pencil, Trash2, Phone, Save, X } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import ConfirmModal from './ConfirmModal';
import type { ContactItem } from '@/types';
import { resolveIcon } from '@/utils/icons';
import IconPicker from './IconPicker';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface Props {
  items: ContactItem[];
  onAdd: (data: Omit<ContactItem, 'id'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<ContactItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<ContactItem, 'id'> = { icon: 'MapPin', title: '', lines: [''] };

export default function ContactTab({ items, onAdd, onUpdate, onDelete }: Props) {
  const { setDraftOverride, savedContactItems } = useLandingContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactItem | null>(null);
  const lastDraftKeyRef = useRef<string>('');

  const startAdd = () => { setForm(empty); setAdding(true); setEditing(null); };
  const startEdit = (c: ContactItem) => { setForm({ icon: c.icon, title: c.title, lines: [...c.lines] }); setEditing(c.id); setAdding(false); };
  const cancel = () => { setAdding(false); setEditing(null); };

  const effectiveItems = useMemo(() => (adding || editing)
    ? adding ? [...savedContactItems, { ...form, id: 'draft' } as ContactItem] : savedContactItems.map((c) => c.id === editing ? { ...c, ...form } : c)
    : savedContactItems, [savedContactItems, form, adding, editing]);

  useEffect(() => {
    if (!adding && !editing) {
      lastDraftKeyRef.current = '';
      setDraftOverride('contactItems', null);
      return;
    }
    const key = JSON.stringify(effectiveItems);
    if (lastDraftKeyRef.current === key) return;
    lastDraftKeyRef.current = key;
    setDraftOverride('contactItems', effectiveItems);
  }, [adding, editing, effectiveItems, setDraftOverride]);

  const handleSave = useCallback(async () => {
    const data = { ...form, lines: form.lines.filter((l) => l.trim()) };
    if (adding) await onAdd(data);
    else if (editing) await onUpdate(editing, data);
    setDraftOverride('contactItems', null);
    cancel();
  }, [form, adding, editing, onAdd, onUpdate, setDraftOverride]);

  const formUI = (
    <div className={`${cardCls} p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-hotel-900 dark:text-white">{adding ? 'Add Contact Item' : 'Edit Contact Item'}</h4>
        <button onClick={cancel} className="text-hotel-400 hover:text-hotel-600 transition-colors"><X className="h-5 w-5" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>Icon</label><IconPicker value={form.icon} onChange={(icon) => setForm((p) => ({ ...p, icon }))} category="contact" /></div>
        <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls}>Lines</label>
          <button type="button" onClick={() => setForm((p) => ({ ...p, lines: [...p.lines, ''] }))} className="text-xs text-gold-600 hover:text-gold-700 font-medium">+ Add line</button>
        </div>
        {form.lines.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input className={inputCls} value={line} onChange={(e) => { const lines = [...form.lines]; lines[idx] = e.target.value; setForm((p) => ({ ...p, lines })); }} placeholder={`Line ${idx + 1}`} />
            {form.lines.length > 1 && <button onClick={() => setForm((p) => ({ ...p, lines: p.lines.filter((_, i) => i !== idx) }))} className="text-hotel-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>}
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-gold-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Save className="h-4 w-4" />Save</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"><Phone className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Contact Section</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">{items.length} item{items.length !== 1 ? 's' : ''}</p></div>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Plus className="h-4 w-4" />Add</button>
      </div>

      {(adding || editing) && formUI}

      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((c) => {
          const Icon = resolveIcon(c.icon);
          return (
            <div key={c.id} className={`${cardCls} p-4 flex items-start gap-3`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hotel-100 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 shrink-0"><Icon className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-hotel-900 dark:text-white">{c.title}</p>
                {c.lines.map((l, i) => <p key={i} className="text-xs text-hotel-500 dark:text-hotel-400">{l}</p>)}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(c)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteTarget(c)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {deleteTarget && (
        <ConfirmModal title="Delete Contact" message={`Delete "${deleteTarget.title}"?`} onConfirm={async () => { await onDelete(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
