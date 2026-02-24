'use client';

import { useState, useEffect, useCallback } from 'react';
import { Layers, Save } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import { SingleImageUploader } from './ImageUploader';
import type { SectionHeaders } from '@/types';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface Props {
  headers: SectionHeaders;
  onSave: (data: Partial<SectionHeaders>) => Promise<void>;
}

export default function SectionHeadersTab({ headers, onSave }: Props) {
  const { setDraftOverride } = useLandingContent();
  const [form, setForm] = useState<SectionHeaders>(headers);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(headers); }, [headers]);

  useEffect(() => {
    setDraftOverride('sectionHeaders', form);
  }, [form, setDraftOverride]);

  const save = useCallback(async () => {
    setSaving(true);
    await onSave(form);
    setDraftOverride('sectionHeaders', null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [form, onSave, setDraftOverride]);

  const sectionCard = (
    title: string,
    desc: string,
    color: string,
    children: React.ReactNode,
  ) => (
    <div className={`${cardCls} p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-hotel-900 dark:text-white">{title}</h3>
          <p className="text-xs text-hotel-500 dark:text-hotel-400">{desc}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {sectionCard('Rooms Section', 'Header text for the Rooms section', 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', <>
        <div><label className={labelCls}>Label</label><input className={inputCls} value={form.rooms.label} onChange={(e) => setForm((p) => ({ ...p, rooms: { ...p.rooms, label: e.target.value } }))} /></div>
        <div><label className={labelCls}>Title</label><input className={inputCls} value={form.rooms.title} onChange={(e) => setForm((p) => ({ ...p, rooms: { ...p.rooms, title: e.target.value } }))} /></div>
        <div><label className={labelCls}>Description</label><textarea className={`${inputCls} min-h-[80px]`} value={form.rooms.description} onChange={(e) => setForm((p) => ({ ...p, rooms: { ...p.rooms, description: e.target.value } }))} rows={3} /></div>
      </>)}

      {sectionCard('Dining Section', 'Header text for the Dining & Cuisine section', 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', <>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Slider Label</label><input className={inputCls} value={form.dining.sliderLabel} onChange={(e) => setForm((p) => ({ ...p, dining: { ...p.dining, sliderLabel: e.target.value } }))} /></div>
          <div><label className={labelCls}>Slider Title</label><input className={inputCls} value={form.dining.sliderTitle} onChange={(e) => setForm((p) => ({ ...p, dining: { ...p.dining, sliderTitle: e.target.value } }))} /></div>
        </div>
        <div><label className={labelCls}>Section Label</label><input className={inputCls} value={form.dining.label} onChange={(e) => setForm((p) => ({ ...p, dining: { ...p.dining, label: e.target.value } }))} /></div>
        <div><label className={labelCls}>Section Title</label><input className={inputCls} value={form.dining.title} onChange={(e) => setForm((p) => ({ ...p, dining: { ...p.dining, title: e.target.value } }))} /></div>
        <div><label className={labelCls}>Section Description</label><textarea className={`${inputCls} min-h-[80px]`} value={form.dining.description} onChange={(e) => setForm((p) => ({ ...p, dining: { ...p.dining, description: e.target.value } }))} rows={3} /></div>
        <div className="border-t border-hotel-100 dark:border-dark-border pt-4 mt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-hotel-500 dark:text-hotel-400 mb-3">Why Dine With Us Banner</p>
          <div><label className={labelCls}>Highlight Label</label><input className={inputCls} value={form.dining.highlightLabel} onChange={(e) => setForm((p) => ({ ...p, dining: { ...p.dining, highlightLabel: e.target.value } }))} /></div>
          <div className="mt-4"><label className={labelCls}>Highlight Title</label><input className={inputCls} value={form.dining.highlightTitle} onChange={(e) => setForm((p) => ({ ...p, dining: { ...p.dining, highlightTitle: e.target.value } }))} /></div>
          <div className="mt-4"><label className={labelCls}>Highlight Description</label><textarea className={`${inputCls} min-h-[60px]`} value={form.dining.highlightDescription} onChange={(e) => setForm((p) => ({ ...p, dining: { ...p.dining, highlightDescription: e.target.value } }))} rows={2} /></div>
        </div>
      </>)}

      {sectionCard('Amenities Section', 'Header text and background for the Amenities section', 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', <>
        <div><label className={labelCls}>Label</label><input className={inputCls} value={form.amenities.label} onChange={(e) => setForm((p) => ({ ...p, amenities: { ...p.amenities, label: e.target.value } }))} /></div>
        <div><label className={labelCls}>Title</label><input className={inputCls} value={form.amenities.title} onChange={(e) => setForm((p) => ({ ...p, amenities: { ...p.amenities, title: e.target.value } }))} /></div>
        <div><label className={labelCls}>Description</label><textarea className={`${inputCls} min-h-[80px]`} value={form.amenities.description} onChange={(e) => setForm((p) => ({ ...p, amenities: { ...p.amenities, description: e.target.value } }))} rows={3} /></div>
        <SingleImageUploader
          label="Background Image"
          preset="hero-banner"
          value={form.amenities.backgroundImage}
          onChange={(url) => setForm((p) => ({ ...p, amenities: { ...p.amenities, backgroundImage: url } }))}
        />
      </>)}

      {sectionCard('Contact Section', 'Header text for the Contact section', 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', <>
        <div><label className={labelCls}>Label</label><input className={inputCls} value={form.contact.label} onChange={(e) => setForm((p) => ({ ...p, contact: { ...p.contact, label: e.target.value } }))} /></div>
        <div><label className={labelCls}>Title</label><input className={inputCls} value={form.contact.title} onChange={(e) => setForm((p) => ({ ...p, contact: { ...p.contact, title: e.target.value } }))} /></div>
        <div><label className={labelCls}>Description</label><textarea className={`${inputCls} min-h-[80px]`} value={form.contact.description} onChange={(e) => setForm((p) => ({ ...p, contact: { ...p.contact, description: e.target.value } }))} rows={3} /></div>
      </>)}

      <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] disabled:opacity-50">
        <Save className="h-4 w-4" />{saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Headers'}
      </button>
    </div>
  );
}
