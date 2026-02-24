'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Save, Plus, Trash2 } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import type { AvailabilityContent } from '@/types';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface Props {
  content: AvailabilityContent;
  onSave: (data: Partial<AvailabilityContent>) => Promise<void>;
}

export default function AvailabilityContentTab({ content, onSave }: Props) {
  const { setDraftOverride } = useLandingContent();
  const [form, setForm] = useState<AvailabilityContent>(content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(content); }, [content]);

  useEffect(() => {
    setDraftOverride('availabilityContent', form);
  }, [form, setDraftOverride]);

  const save = useCallback(async () => {
    setSaving(true);
    await onSave(form);
    setDraftOverride('availabilityContent', null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [form, onSave, setDraftOverride]);

  return (
    <div className="space-y-6">
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"><CalendarDays className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Availability Section</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">Configure the Check Availability section</p></div>
        </div>
        <div className="space-y-4">
          <div><label className={labelCls}>Section Label</label><input className={inputCls} value={form.sectionLabel} onChange={(e) => setForm((p) => ({ ...p, sectionLabel: e.target.value }))} placeholder="Plan Your Visit" /></div>
          <div><label className={labelCls}>Section Title</label><input className={inputCls} value={form.sectionTitle} onChange={(e) => setForm((p) => ({ ...p, sectionTitle: e.target.value }))} /></div>
          <div><label className={labelCls}>Description</label><textarea className={`${inputCls} min-h-[80px]`} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>CTA Button Text</label><input className={inputCls} value={form.ctaButtonText} onChange={(e) => setForm((p) => ({ ...p, ctaButtonText: e.target.value }))} /></div>
            <div><label className={labelCls}>Today Label</label><input className={inputCls} value={form.todayLabel} onChange={(e) => setForm((p) => ({ ...p, todayLabel: e.target.value }))} /></div>
          </div>
          <div><label className={labelCls}>Legend Label</label><input className={inputCls} value={form.legendLabel} onChange={(e) => setForm((p) => ({ ...p, legendLabel: e.target.value }))} /></div>
          <div className="border-t border-hotel-100 dark:border-dark-border pt-4 mt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-hotel-500 dark:text-hotel-400 mb-3">Ready to Book Card</p>
            <div><label className={labelCls}>Title</label><input className={inputCls} value={form.readyTitle} onChange={(e) => setForm((p) => ({ ...p, readyTitle: e.target.value }))} placeholder="Ready to Book?" /></div>
            <div className="mt-4"><label className={labelCls}>Description</label><textarea className={`${inputCls} min-h-[60px]`} value={form.readyDescription} onChange={(e) => setForm((p) => ({ ...p, readyDescription: e.target.value }))} rows={2} placeholder="Found your ideal dates? Reserve your room now..." /></div>
          </div>
        </div>
      </div>

      <div className={`${cardCls} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-hotel-900 dark:text-white">Booking Notes</h4>
          <button onClick={() => setForm((p) => ({ ...p, bookingNotes: [...p.bookingNotes, ''] }))} className="flex items-center gap-1.5 rounded-lg bg-gold-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-700 transition-colors"><Plus className="h-3.5 w-3.5" />Add Note</button>
        </div>
        <div className="space-y-3">
          {form.bookingNotes.map((note, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input className={inputCls} value={note} onChange={(e) => { const notes = [...form.bookingNotes]; notes[idx] = e.target.value; setForm((p) => ({ ...p, bookingNotes: notes })); }} placeholder="Booking note" />
              <button onClick={() => setForm((p) => ({ ...p, bookingNotes: p.bookingNotes.filter((_, i) => i !== idx) }))} className="text-hotel-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] disabled:opacity-50">
        <Save className="h-4 w-4" />{saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
      </button>
    </div>
  );
}
