'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, UtensilsCrossed, Save, X } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import { SingleImageUploader } from './ImageUploader';
import ConfirmModal from './ConfirmModal';
import type { RestaurantItem } from '@/types';

interface Props {
  restaurants: RestaurantItem[];
  onAdd: (data: Omit<RestaurantItem, 'id'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<RestaurantItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<RestaurantItem, 'id'> = { name: '', cuisine: '', hours: '', description: '', image: '', tags: [], buttonText: 'Reserve a Table' };

export default function RestaurantsTab({ restaurants, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RestaurantItem | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  const startAdd = () => { setForm(empty); setTagsInput(''); setAdding(true); setEditing(null); };
  const startEdit = (r: RestaurantItem) => { setForm({ name: r.name, cuisine: r.cuisine, hours: r.hours, description: r.description, image: r.image, tags: r.tags, buttonText: r.buttonText }); setTagsInput(r.tags.join(', ')); setEditing(r.id); setAdding(false); };
  const cancel = () => { setAdding(false); setEditing(null); };

  const handleSave = async () => {
    const data = { ...form, tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean) };
    if (adding) { await onAdd(data); }
    else if (editing) { await onUpdate(editing, data); }
    cancel();
  };

  const formUI = (
    <div className={`${cardCls} p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-hotel-900 dark:text-white">{adding ? 'Add Restaurant' : 'Edit Restaurant'}</h4>
        <button onClick={cancel} className="text-hotel-400 hover:text-hotel-600 transition-colors"><X className="h-5 w-5" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
        <div><label className={labelCls}>Cuisine</label><input className={inputCls} value={form.cuisine} onChange={(e) => setForm((p) => ({ ...p, cuisine: e.target.value }))} /></div>
        <div><label className={labelCls}>Hours</label><input className={inputCls} value={form.hours} onChange={(e) => setForm((p) => ({ ...p, hours: e.target.value }))} /></div>
        <div><label className={labelCls}>Button Text</label><input className={inputCls} value={form.buttonText} onChange={(e) => setForm((p) => ({ ...p, buttonText: e.target.value }))} /></div>
      </div>
      <SingleImageUploader label="Image" value={form.image} onChange={(url) => setForm((p) => ({ ...p, image: url }))} />
      <div><label className={labelCls}>Description</label><textarea className={`${inputCls} min-h-[80px]`} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} /></div>
      <div><label className={labelCls}>Tags (comma-separated)</label><input className={inputCls} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. Seafood, Fine Dining" /></div>
      <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-gold-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Save className="h-4 w-4" />Save</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"><UtensilsCrossed className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Restaurants</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">{restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}</p></div>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Plus className="h-4 w-4" />Add Restaurant</button>
      </div>

      {(adding || editing) && formUI}

      <div className="space-y-3">
        {restaurants.map((r) => (
          <div key={r.id} className={`${cardCls} p-4 flex items-center gap-4`}>
            {r.image && <img src={r.image} alt={r.name} className="h-16 w-24 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-hotel-900 dark:text-white truncate">{r.name}</p>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">{r.cuisine} &middot; {r.hours}</p>
              <div className="flex gap-1 mt-1">{r.tags.map((t) => <span key={t} className="text-[10px] bg-hotel-100 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 rounded-full px-2 py-0.5">{t}</span>)}</div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => startEdit(r)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setDeleteTarget(r)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <ConfirmModal title="Delete Restaurant" message={`Delete "${deleteTarget.name}"? This cannot be undone.`} onConfirm={async () => { await onDelete(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
