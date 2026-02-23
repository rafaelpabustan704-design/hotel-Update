'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Navigation, Save, Pencil, X } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import type { NavigationItem } from '@/types';

interface Props {
  items: NavigationItem[];
  onAdd: (data: Omit<NavigationItem, 'id'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<NavigationItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (items: NavigationItem[]) => Promise<void>;
}

export default function NavigationTab({ items, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', href: '' });
  const [adding, setAdding] = useState(false);

  const startAdd = () => { setForm({ label: '', href: '' }); setAdding(true); setEditing(null); };
  const startEdit = (n: NavigationItem) => { setForm({ label: n.label, href: n.href }); setEditing(n.id); setAdding(false); };
  const cancel = () => { setAdding(false); setEditing(null); };

  const handleSave = async () => {
    if (adding) await onAdd(form);
    else if (editing) await onUpdate(editing, form);
    cancel();
  };

  const formUI = (
    <div className={`${cardCls} p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-hotel-900 dark:text-white">{adding ? 'Add Nav Item' : 'Edit Nav Item'}</h4>
        <button onClick={cancel} className="text-hotel-400 hover:text-hotel-600 transition-colors"><X className="h-5 w-5" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>Label</label><input className={inputCls} value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. About" /></div>
        <div><label className={labelCls}>Link</label><input className={inputCls} value={form.href} onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))} placeholder="e.g. #about" /></div>
      </div>
      <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-gold-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Save className="h-4 w-4" />Save</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"><Navigation className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Navigation Menu</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">{items.length} item{items.length !== 1 ? 's' : ''}</p></div>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Plus className="h-4 w-4" />Add</button>
      </div>

      {(adding || editing) && formUI}

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className={`${cardCls} p-4 flex items-center gap-3`}>
            <GripVertical className="h-4 w-4 text-hotel-300 dark:text-hotel-600 shrink-0" />
            <span className="text-xs font-bold text-hotel-400 w-6">{idx + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-hotel-900 dark:text-white">{item.label}</p>
              <p className="text-xs text-hotel-400">{item.href}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => startEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => onDelete(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
