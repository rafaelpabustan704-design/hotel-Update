'use client';

import { useState, useEffect } from 'react';
import { Type, Save, Plus, Trash2, BarChart3 } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import { SingleImageUploader } from './ImageUploader';
import type { AboutContent } from '@/types';
import IconPicker from './IconPicker';

interface Props {
  aboutContent: AboutContent;
  onSave: (data: Partial<AboutContent>) => Promise<void>;
}

export default function AboutTab({ aboutContent, onSave }: Props) {
  const [form, setForm] = useState<AboutContent>(aboutContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(aboutContent); }, [aboutContent]);

  const save = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Type className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">About Section</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">Edit the About section content</p></div>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Section Label</label>
            <input className={inputCls} value={form.sectionLabel} onChange={(e) => setForm((p) => ({ ...p, sectionLabel: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} min-h-[120px]`} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={5} />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-hotel-900 dark:text-white">Carousel Images</h4>
          <button onClick={() => setForm((p) => ({ ...p, images: [...p.images, { src: '', alt: '' }] }))} className="flex items-center gap-1.5 rounded-lg bg-gold-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-700 transition-colors"><Plus className="h-3.5 w-3.5" />Add Slot</button>
        </div>
        <div className="space-y-4">
          {form.images.map((img, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl border border-hotel-100 dark:border-dark-border p-3">
              <SingleImageUploader
                compact
                value={img.src}
                onChange={(url) => { const imgs = [...form.images]; imgs[idx] = { ...imgs[idx], src: url }; setForm((p) => ({ ...p, images: imgs })); }}
              />
              <input className={`${inputCls} flex-1`} value={img.alt} onChange={(e) => { const imgs = [...form.images]; imgs[idx] = { ...imgs[idx], alt: e.target.value }; setForm((p) => ({ ...p, images: imgs })); }} placeholder="Alt text" />
              <button onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))} className="text-hotel-400 hover:text-red-500 transition-colors mt-2"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"><BarChart3 className="h-5 w-5" /></div>
            <h4 className="font-semibold text-hotel-900 dark:text-white">Statistics</h4>
          </div>
          <button onClick={() => setForm((p) => ({ ...p, stats: [...p.stats, { icon: 'Star', label: '', value: '' }] }))} className="flex items-center gap-1.5 rounded-lg bg-gold-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-700 transition-colors"><Plus className="h-3.5 w-3.5" />Add Stat</button>
        </div>
        <div className="space-y-3">
          {form.stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <IconPicker value={stat.icon} onChange={(icon) => { const stats = [...form.stats]; stats[idx] = { ...stats[idx], icon }; setForm((p) => ({ ...p, stats })); }} category="about" className="w-36" />
              <input className={`${inputCls} !w-24`} value={stat.value} onChange={(e) => { const stats = [...form.stats]; stats[idx] = { ...stats[idx], value: e.target.value }; setForm((p) => ({ ...p, stats })); }} placeholder="Value" />
              <input className={inputCls} value={stat.label} onChange={(e) => { const stats = [...form.stats]; stats[idx] = { ...stats[idx], label: e.target.value }; setForm((p) => ({ ...p, stats })); }} placeholder="Label" />
              <button onClick={() => setForm((p) => ({ ...p, stats: p.stats.filter((_, i) => i !== idx) }))} className="text-hotel-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] disabled:opacity-50">
        <Save className="h-4 w-4" />{saving ? 'Saving...' : saved ? 'Saved!' : 'Save About'}
      </button>
    </div>
  );
}
