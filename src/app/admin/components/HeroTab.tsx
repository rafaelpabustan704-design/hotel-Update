'use client';

import { useState, useEffect, useCallback } from 'react';
import { Type, MousePointerClick, Sparkles, Save, Plus, Trash2 } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import { SingleImageUploader } from './ImageUploader';
import type { HeroContent } from '@/types';
import IconPicker from './IconPicker';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface Props {
  heroContent: HeroContent;
  onSave: (data: Partial<HeroContent>) => Promise<void>;
}

export default function HeroTab({ heroContent, onSave }: Props) {
  const { setDraftOverride } = useLandingContent();
  const [form, setForm] = useState<HeroContent>(heroContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(heroContent); }, [heroContent]);

  useEffect(() => {
    setDraftOverride('heroContent', form);
  }, [form, setDraftOverride]);

  const save = useCallback(async () => {
    setSaving(true);
    await onSave(form);
    setDraftOverride('heroContent', null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [form, onSave, setDraftOverride]);

  const updateHighlight = (idx: number, field: string, val: string) => {
    setForm((p) => ({
      ...p,
      featureHighlights: p.featureHighlights.map((h, i) => i === idx ? { ...h, [field]: val } : h),
    }));
  };

  const addHighlight = () => {
    setForm((p) => ({
      ...p,
      featureHighlights: [...p.featureHighlights, { icon: 'Star', label: '' }],
    }));
  };

  const removeHighlight = (idx: number) => {
    setForm((p) => ({
      ...p,
      featureHighlights: p.featureHighlights.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6">
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><Sparkles className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Hero Section</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">Configure the main hero banner</p></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}><Type className="h-4 w-4 text-hotel-400" />Badge Text</label>
            <input className={inputCls} value={form.badgeText} onChange={(e) => setForm((p) => ({ ...p, badgeText: e.target.value }))} placeholder="e.g. Luxury Redefined" />
          </div>
          <div>
            <label className={labelCls}><Type className="h-4 w-4 text-hotel-400" />Main Heading</label>
            <input className={inputCls} value={form.heading} onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))} placeholder="e.g. Experience Timeless Elegance" />
          </div>
          <div>
            <label className={labelCls}><Type className="h-4 w-4 text-hotel-400" />Description</label>
            <textarea className={`${inputCls} min-h-[80px]`} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
          </div>
          <SingleImageUploader
            label="Background Image"
            preset="hero-banner"
            value={form.backgroundImage}
            onChange={(url) => setForm((p) => ({ ...p, backgroundImage: url }))}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}><MousePointerClick className="h-4 w-4 text-hotel-400" />Primary Button Text</label>
              <input className={inputCls} value={form.primaryButton.text} onChange={(e) => setForm((p) => ({ ...p, primaryButton: { ...p.primaryButton, text: e.target.value } }))} />
            </div>
            <div>
              <label className={labelCls}><MousePointerClick className="h-4 w-4 text-hotel-400" />Primary Button Link</label>
              <input className={inputCls} value={form.primaryButton.link} onChange={(e) => setForm((p) => ({ ...p, primaryButton: { ...p.primaryButton, link: e.target.value } }))} />
            </div>
            <div>
              <label className={labelCls}><MousePointerClick className="h-4 w-4 text-hotel-400" />Secondary Button Text</label>
              <input className={inputCls} value={form.secondaryButton.text} onChange={(e) => setForm((p) => ({ ...p, secondaryButton: { ...p.secondaryButton, text: e.target.value } }))} />
            </div>
            <div>
              <label className={labelCls}><MousePointerClick className="h-4 w-4 text-hotel-400" />Secondary Button Link</label>
              <input className={inputCls} value={form.secondaryButton.link} onChange={(e) => setForm((p) => ({ ...p, secondaryButton: { ...p.secondaryButton, link: e.target.value } }))} />
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardCls} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-hotel-900 dark:text-white">Feature Highlights / Trust Badges</h4>
          <button onClick={addHighlight} className="flex items-center gap-1.5 rounded-lg bg-gold-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-700 transition-colors"><Plus className="h-3.5 w-3.5" />Add</button>
        </div>
        <div className="space-y-3">
          {form.featureHighlights.map((h, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <IconPicker value={h.icon} onChange={(icon) => updateHighlight(idx, 'icon', icon)} category="hero" className="w-40" />
              <input className={inputCls} value={h.label} onChange={(e) => updateHighlight(idx, 'label', e.target.value)} placeholder="Label" />
              <button onClick={() => removeHighlight(idx)} className="text-hotel-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] disabled:opacity-50">
        <Save className="h-4 w-4" />{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Hero'}
      </button>
    </div>
  );
}
