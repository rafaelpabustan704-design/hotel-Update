'use client';

import { useState, useEffect, useCallback } from 'react';
import { Palette, Globe, Save, Type, RotateCcw, Moon } from 'lucide-react';
import { cardCls, inputCls, labelCls } from './shared';
import { SingleImageUploader } from './ImageUploader';
import type { SiteSettings } from '@/types';
import { DEFAULT_SITE_SETTINGS, DARK_THEME_PRESETS } from '@/lib/constants';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface Props {
  settings: SiteSettings;
  onSave: (data: Partial<SiteSettings>) => Promise<void>;
}

type ColorKey = 'primaryColor' | 'secondaryColor' | 'accentColor' | 'backgroundColor';

const COLOR_FIELDS: { label: string; key: ColorKey; hint: string }[] = [
  { label: 'Primary Color', key: 'primaryColor', hint: 'Buttons, badges, highlights' },
  { label: 'Secondary Color', key: 'secondaryColor', hint: 'Dark backgrounds, headings' },
  { label: 'Accent Color', key: 'accentColor', hint: 'Deeper accent tones' },
  { label: 'Background Color', key: 'backgroundColor', hint: 'Page background' },
];

export default function SiteSettingsTab({ settings, onSave }: Props) {
  const { setDraftOverride } = useLandingContent();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  useEffect(() => {
    setDraftOverride('siteSettings', form);
  }, [form, setDraftOverride]);

  const save = useCallback(async () => {
    setSaving(true);
    await onSave(form);
    setDraftOverride('siteSettings', null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [form, onSave, setDraftOverride]);

  const resetColors = () => {
    setForm((p) => ({
      ...p,
      primaryColor: DEFAULT_SITE_SETTINGS.primaryColor,
      secondaryColor: DEFAULT_SITE_SETTINGS.secondaryColor,
      accentColor: DEFAULT_SITE_SETTINGS.accentColor,
      backgroundColor: DEFAULT_SITE_SETTINGS.backgroundColor,
    }));
  };

  const colorField = ({ label, key, hint }: typeof COLOR_FIELDS[number]) => {
    const defaultVal = DEFAULT_SITE_SETTINGS[key] as string;
    const isDefault = form[key] === defaultVal;
    return (
      <div key={key}>
        <label className={labelCls}>{label}</label>
        <p className="text-[10px] text-hotel-400 mb-1.5">{hint}</p>
        <div className="flex items-center gap-3">
          <input type="color" value={form[key] as string} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} className="h-10 w-14 rounded-lg border border-hotel-200 dark:border-dark-border cursor-pointer" />
          <input className={inputCls} value={form[key] as string} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder="#000000" />
          {!isDefault && (
            <button
              type="button"
              title={`Reset to default (${defaultVal})`}
              onClick={() => setForm((p) => ({ ...p, [key]: defaultVal }))}
              className="flex items-center gap-1 shrink-0 rounded-lg border border-hotel-200 dark:border-dark-border px-2 py-2 text-[10px] font-medium text-hotel-500 hover:text-hotel-700 dark:hover:text-hotel-200 hover:border-hotel-300 transition-colors"
            >
              <span className="h-4 w-4 rounded-full border border-hotel-200 dark:border-dark-border shrink-0" style={{ backgroundColor: defaultVal }} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const allDefault =
    form.primaryColor === DEFAULT_SITE_SETTINGS.primaryColor &&
    form.secondaryColor === DEFAULT_SITE_SETTINGS.secondaryColor &&
    form.accentColor === DEFAULT_SITE_SETTINGS.accentColor &&
    form.backgroundColor === DEFAULT_SITE_SETTINGS.backgroundColor;

  return (
    <div className="space-y-6">
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Globe className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Site Identity</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">Site name, logo, and metadata</p></div>
        </div>
        <div className="space-y-4">
          <div><label className={labelCls}><Type className="h-4 w-4 text-hotel-400" />Site Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
          <div>
            <label className={labelCls}>Logo</label>
            <SingleImageUploader compact preset="thumbnail" value={form.logo} onChange={(url) => setForm((p) => ({ ...p, logo: url }))} />
          </div>
          <div>
            <label className={labelCls}>Favicon</label>
            <SingleImageUploader compact preset="favicon" value={form.favicon} onChange={(url) => setForm((p) => ({ ...p, favicon: url }))} accept="image/png,image/x-icon,image/svg+xml" />
          </div>
          <div><label className={labelCls}><Type className="h-4 w-4 text-hotel-400" />Footer Text</label><textarea className={`${inputCls} min-h-[60px]`} value={form.footerText} onChange={(e) => setForm((p) => ({ ...p, footerText: e.target.value }))} rows={2} /></div>
        </div>
      </div>

      <div className={`${cardCls} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><Palette className="h-5 w-5" /></div>
            <div><h3 className="font-semibold text-hotel-900 dark:text-white">Theme Colors</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">Customize site colors</p></div>
          </div>
          {!allDefault && (
            <button
              type="button"
              onClick={resetColors}
              className="flex items-center gap-1.5 rounded-lg border border-hotel-200 dark:border-dark-border px-3 py-1.5 text-xs font-medium text-hotel-500 hover:text-hotel-700 dark:hover:text-hotel-200 hover:border-hotel-300 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All to Default
            </button>
          )}
        </div>

        {/* Default palette reference */}
        <div className="flex items-center gap-2 mb-5 rounded-lg bg-hotel-50 dark:bg-dark-bg px-3 py-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mr-1">Defaults:</span>
          {COLOR_FIELDS.map(({ label, key }) => (
            <button
              key={key}
              type="button"
              title={`${label}: ${DEFAULT_SITE_SETTINGS[key]}`}
              onClick={() => setForm((p) => ({ ...p, [key]: DEFAULT_SITE_SETTINGS[key] }))}
              className="flex items-center gap-1.5 rounded-full bg-white dark:bg-dark-card border border-hotel-200 dark:border-dark-border px-2 py-1 hover:border-gold-500 transition-colors cursor-pointer"
            >
              <span className="h-3.5 w-3.5 rounded-full shrink-0 ring-1 ring-black/10" style={{ backgroundColor: DEFAULT_SITE_SETTINGS[key] as string }} />
              <span className="text-[10px] text-hotel-600 dark:text-hotel-300 font-medium">{DEFAULT_SITE_SETTINGS[key]}</span>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {COLOR_FIELDS.map(colorField)}
        </div>
      </div>

      <div className={`${cardCls} p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700 text-slate-200"><Moon className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Dark Theme</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">Choose a color preset for dark mode</p></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DARK_THEME_PRESETS.map((preset) => {
            const isSelected = (form.darkThemePreset ?? 'default') === preset.id;
            const hasSwatches = preset.primary || preset.secondary || preset.backgroundColor;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setForm((p) => ({ ...p, darkThemePreset: preset.id }))}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 ring-2 ring-gold-500/30'
                    : 'border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg hover:border-hotel-300 dark:hover:border-dark-border'
                }`}
              >
                <p className="font-semibold text-sm text-hotel-900 dark:text-white">{preset.label}</p>
                <p className="text-[11px] text-hotel-500 dark:text-hotel-400 mt-0.5">{preset.description}</p>
                {hasSwatches && (
                  <div className="flex gap-1.5 mt-2">
                    {preset.primary && <span className="h-4 w-4 rounded-full shrink-0 ring-1 ring-black/10" style={{ backgroundColor: preset.primary }} title="Primary" />}
                    {preset.secondary && <span className="h-4 w-4 rounded-full shrink-0 ring-1 ring-black/10" style={{ backgroundColor: preset.secondary }} title="Secondary" />}
                    {preset.backgroundColor && <span className="h-4 w-4 rounded-full shrink-0 ring-1 ring-black/10" style={{ backgroundColor: preset.backgroundColor }} title="Background" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] disabled:opacity-50">
        <Save className="h-4 w-4" />{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
