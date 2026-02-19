'use client';

import { useState, useRef, useCallback } from 'react';
import { Trash2, Pencil, Plus, DoorOpen, XCircle, X, Upload, ImageIcon, Check, Eye, ChevronLeft, ChevronRight, BedDouble, Users, Ruler } from 'lucide-react';
import type { RoomType, ManagedRoom } from '@/utils/types';
import { ROOMS, FEATURE_ICONS, FEATURE_LABELS } from '@/constants/hotel';
import { cardCls, inputCls, labelCls } from './shared';
import ConfirmModal from './ConfirmModal';

function getStaticDefaults(room: ManagedRoom, roomTypes: RoomType[]) {
  const rt = roomTypes.find((t) => t.id === room.roomTypeId);
  const rtName = rt?.name || '';
  const s = ROOMS.find((r) => r.roomTypeKey === rtName);
  if (!s) return {};
  return {
    tagline: s.tagline,
    description: s.description,
    longDescription: s.longDescription,
    bedType: s.specs.find((sp) => sp.label === 'Bed')?.value || '',
    roomSize: s.specs.find((sp) => sp.label === 'Size')?.value || '',
    view: s.specs.find((sp) => sp.label === 'View')?.value || '',
    inclusions: s.inclusions,
  };
}

interface ManageRoomsTabProps {
  rooms: ManagedRoom[];
  roomTypes: RoomType[];
  addRoom: (data: Omit<ManagedRoom, 'id' | 'createdAt'>) => void;
  updateRoom: (id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => void;
  deleteRoom: (id: string) => void;
}

const EMPTY_FORM = { name: '', roomTypeId: '', price: 0, maxPax: 2, description: '', longDescription: '', tagline: '', bedType: '', bedQty: 1, extraBedType: '', extraBedQty: 0, roomSize: '', view: '', amenities: '', inclusions: '' };

const BED_TYPE_OPTIONS = ['Single', 'Twin', 'Double', 'Queen', 'King Size', 'Canopy King', 'Super King', 'Bunk Bed'];

const VIEW_OPTIONS = ['City View', 'Ocean View', 'Garden View', 'Pool View', 'Mountain View', 'Panoramic', 'Ocean & City', 'Courtyard', 'River View', 'Skyline'];

const AMENITY_OPTIONS = [
  'WiFi', 'Coffee', 'TV', 'Bath', 'Mini Bar', 'Room Service',
  'Air Conditioning', 'Safe', 'Lounge Access', 'Butler Service',
  'Private Terrace', 'Balcony', 'Kitchen', 'Jacuzzi',
];

const INCLUSION_OPTIONS = [
  'Daily breakfast buffet', 'Welcome drink on arrival', 'High-speed WiFi',
  'Daily housekeeping', 'Access to fitness center', 'In-room safe & minibar',
  'Executive Lounge access', 'Evening cocktails & canapés', 'Turndown service',
  'Complimentary pressing service', 'Late checkout (subject to availability)',
  'Soaking tub & rain shower', 'Nespresso machine & premium minibar',
  '24-hour dedicated butler service', 'Daily breakfast in-suite or restaurant',
  'Airport limousine transfer', 'Private terrace with jacuzzi',
  'Premium bar & Champagne selection', 'Complimentary spa treatment (60 min)',
  'Bose surround sound system', 'Walk-in wardrobe & pressing service',
  'Priority restaurant reservations', 'Late checkout guaranteed',
];

function resizeImage(file: File, maxDim = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─── Image Upload Field ─── */

function ImageUploadField({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    try {
      const newImages = await Promise.all(
        Array.from(files).map((f) => resizeImage(f))
      );
      onChange([...images, ...newImages]);
    } catch {
      /* silently skip unreadable files */
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [images, onChange]);

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className={labelCls}>
        <ImageIcon className="h-3.5 w-3.5" />
        Images
      </label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((src, i) => (
            <div key={i} className="group relative h-20 w-20 rounded-lg overflow-hidden border border-hotel-200 dark:border-dark-border">
              <img src={src} alt={`Room image ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border-2 border-dashed border-hotel-200 dark:border-dark-border px-4 py-3 text-sm text-hotel-500 dark:text-hotel-400 transition-colors hover:border-gold-400 hover:text-gold-600 dark:hover:text-gold-400 w-full justify-center"
      >
        <Upload className="h-4 w-4" />
        {loading ? 'Processing...' : 'Upload Images'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

/* ─── Chip Selector ─── */

function ChipSelector({ options, selected, onChange, columns = 2 }: { options: string[]; selected: string[]; onChange: (items: string[]) => void; columns?: number }) {
  const toggle = (item: string) => {
    onChange(selected.includes(item) ? selected.filter((s) => s !== item) : [...selected, item]);
  };

  const gridCls = columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div>
      <div className={`grid ${gridCls} gap-1.5`}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border text-left transition-all ${
                active
                  ? 'border-gold-500 bg-gold-50 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300 dark:border-gold-600'
                  : 'border-hotel-200 dark:border-dark-border text-hotel-500 dark:text-hotel-400 hover:border-hotel-300 dark:hover:border-hotel-600'
              }`}
            >
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${active ? 'bg-gold-600 border-gold-600 dark:bg-gold-500 dark:border-gold-500' : 'border-hotel-300 dark:border-hotel-600'}`}>
                {active && <Check className="h-2.5 w-2.5 text-white" />}
              </span>
              <span className="truncate">{opt}</span>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-[11px] text-hotel-400 mt-2">{selected.length} selected</p>
      )}
    </div>
  );
}

/* ─── Room Form (shared between Add & Edit) ─── */

interface RoomFormProps {
  form: typeof EMPTY_FORM;
  images: string[];
  roomTypes: RoomType[];
  error: string;
  submitLabel: string;
  onFormChange: (updates: Partial<typeof EMPTY_FORM>) => void;
  onImagesChange: (imgs: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xs font-semibold uppercase tracking-wider text-hotel-400 dark:text-hotel-500 border-b border-hotel-100 dark:border-dark-border pb-2 mb-4">{children}</h4>;
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-hotel-100 dark:border-dark-border bg-hotel-50/50 dark:bg-dark-bg/50 p-4 flex flex-col">{children}</div>;
}

function RoomForm({ form, images, roomTypes, error, submitLabel, onFormChange, onImagesChange, onSubmit, onCancel }: RoomFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Row 1: Basic Info + Specs | Amenities */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <SectionCard>
            <SectionHeading>Basic Information</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name</label>
                <input type="text" value={form.name} onChange={(e) => onFormChange({ name: e.target.value })} placeholder="e.g. Ocean View Deluxe" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Room Type</label>
                <select value={form.roomTypeId} onChange={(e) => {
                  const rt = roomTypes.find((t) => t.id === e.target.value);
                  onFormChange({ roomTypeId: e.target.value, ...(rt ? { maxPax: rt.maxAdults + rt.maxChildren } : {}) });
                }} required className={inputCls}>
                  <option value="">Select room type</option>
                  {roomTypes.map((rt) => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Tagline</label>
                <input type="text" value={form.tagline} onChange={(e) => onFormChange({ tagline: e.target.value })} placeholder="e.g. Classic Elegance, Modern Comfort" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Price (per night)</label>
                <input type="number" min={0} value={form.price} onChange={(e) => onFormChange({ price: parseFloat(e.target.value) || 0 })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Max Pax</label>
                <div className="relative">
                  <input type="number" min={1} value={form.maxPax} readOnly tabIndex={-1} className={`${inputCls} bg-hotel-100/60 dark:bg-dark-bg/80 cursor-default`} />
                  {form.roomTypeId && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-hotel-400 font-medium">Auto</span>}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeading>Room Specs</SectionHeading>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Room Size</label>
                <div className="relative">
                  <input type="number" min={0} value={form.roomSize.replace(/[^0-9.]/g, '')} onChange={(e) => onFormChange({ roomSize: e.target.value ? `${e.target.value} m²` : '' })} placeholder="e.g. 35" className={`${inputCls} pr-12`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-hotel-400 font-medium pointer-events-none">m²</span>
                </div>
              </div>
              <div>
                <label className={labelCls}>View</label>
                <select value={form.view} onChange={(e) => onFormChange({ view: e.target.value })} className={inputCls}>
                  <option value="">Select view</option>
                  {VIEW_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-hotel-100 dark:border-dark-border p-3 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-hotel-500 dark:text-hotel-400">Main Bed</p>
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={form.bedType} onChange={(e) => onFormChange({ bedType: e.target.value })} className={inputCls}>
                    <option value="">Select bed type</option>
                    {BED_TYPE_OPTIONS.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Quantity</label>
                  <input type="number" min={1} max={10} value={form.bedQty} onChange={(e) => onFormChange({ bedQty: parseInt(e.target.value) || 1 })} className={inputCls} />
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-hotel-200 dark:border-dark-border p-3 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-hotel-400 dark:text-hotel-500">Extra Bed <span className="text-hotel-300 dark:text-hotel-600 font-normal">(optional)</span></p>
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={form.extraBedType} onChange={(e) => onFormChange({ extraBedType: e.target.value, extraBedQty: e.target.value ? Math.max(form.extraBedQty, 1) : 0 })} className={inputCls}>
                    <option value="">None</option>
                    {BED_TYPE_OPTIONS.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Quantity</label>
                  <input type="number" min={0} max={10} value={form.extraBedQty} onChange={(e) => onFormChange({ extraBedQty: parseInt(e.target.value) || 0 })} disabled={!form.extraBedType} className={`${inputCls} ${!form.extraBedType ? 'opacity-50' : ''}`} />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeading>Descriptions</SectionHeading>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Short Description</label>
                <textarea value={form.description} onChange={(e) => onFormChange({ description: e.target.value })} rows={2} placeholder="Brief summary shown on the room card" className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className={labelCls}>Full Description</label>
                <textarea value={form.longDescription} onChange={(e) => onFormChange({ longDescription: e.target.value })} rows={5} placeholder="Detailed description shown in the room detail view" className={`${inputCls} resize-none`} />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard>
            <SectionHeading>Amenities</SectionHeading>
            <ChipSelector
              options={AMENITY_OPTIONS}
              columns={3}
              selected={form.amenities.split(',').map((s) => s.trim()).filter(Boolean)}
              onChange={(items) => onFormChange({ amenities: items.join(', ') })}
            />
          </SectionCard>

          <SectionCard>
            <SectionHeading>What&apos;s Included</SectionHeading>
            <ChipSelector
              options={INCLUSION_OPTIONS}
              selected={form.inclusions.split(',').map((s) => s.trim()).filter(Boolean)}
              onChange={(items) => onFormChange({ inclusions: items.join(', ') })}
            />
          </SectionCard>
        </div>
      </div>

      {/* Images — full width */}
      <SectionCard>
        <SectionHeading>Images</SectionHeading>
        <ImageUploadField images={images} onChange={onImagesChange} />
      </SectionCard>

      {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{error}</p>}
      <div className="flex gap-3 pt-2 border-t border-hotel-100 dark:border-dark-border">
        <button type="submit" className="rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border border-hotel-200 dark:border-dark-border px-6 py-3 text-sm font-medium text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-hotel-800 transition-colors">Cancel</button>}
      </div>
    </form>
  );
}

/* ─── Room Modal (Add & Edit) ─── */

interface RoomModalProps {
  room?: ManagedRoom;
  roomTypes: RoomType[];
  onSave: (data: Omit<ManagedRoom, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => void;
  onClose: () => void;
}

function RoomModal({ room, roomTypes, onSave, onUpdate, onClose }: RoomModalProps) {
  const isEdit = !!room;
  const defaults = isEdit ? getStaticDefaults(room, roomTypes) : {};
  const [form, setForm] = useState(
    isEdit
      ? {
          name: room.name,
          roomTypeId: room.roomTypeId,
          price: room.price,
          maxPax: room.maxPax,
          description: room.description || defaults.description || '',
          longDescription: room.longDescription || defaults.longDescription || '',
          tagline: room.tagline || defaults.tagline || '',
          bedType: room.bedType || defaults.bedType || '',
          bedQty: room.bedQty || 1,
          extraBedType: room.extraBedType || '',
          extraBedQty: room.extraBedQty || 0,
          roomSize: room.roomSize || defaults.roomSize || '',
          view: room.view || defaults.view || '',
          amenities: room.amenities.join(', '),
          inclusions: (room.inclusions?.length ? room.inclusions : defaults.inclusions || []).join(', '),
        }
      : { ...EMPTY_FORM, roomTypeId: roomTypes[0]?.id || '', maxPax: roomTypes[0] ? roomTypes[0].maxAdults + roomTypes[0].maxChildren : 2 }
  );
  const [images, setImages] = useState<string[]>(isEdit ? [...room.images] : []);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.roomTypeId) { setError('Room type is required'); return; }
    const amenitiesArr = form.amenities.split(',').map((a) => a.trim()).filter(Boolean);
    const inclusionsArr = form.inclusions.split(',').map((a) => a.trim()).filter(Boolean);
    const payload = { name: form.name.trim(), roomTypeId: form.roomTypeId, price: form.price, maxPax: form.maxPax, description: form.description, longDescription: form.longDescription, tagline: form.tagline, bedType: form.bedType, bedQty: form.bedQty, extraBedType: form.extraBedType, extraBedQty: form.extraBedType ? form.extraBedQty : 0, roomSize: form.roomSize, view: form.view, amenities: amenitiesArr, inclusions: inclusionsArr, images };
    if (isEdit && onUpdate) {
      onUpdate(room.id, payload);
    } else {
      onSave(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl xl:max-w-7xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-2xl p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isEdit ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
              {isEdit ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-hotel-900 dark:text-white">{isEdit ? 'Edit Room' : 'Add Room'}</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">{isEdit ? <>Update &ldquo;{room.name}&rdquo;</> : 'Add a new room to the hotel'}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 hover:bg-hotel-100 dark:hover:bg-hotel-800 hover:text-hotel-700 dark:hover:text-hotel-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <RoomForm
          form={form}
          images={images}
          roomTypes={roomTypes}
          error={error}
          submitLabel={isEdit ? 'Save Changes' : 'Add Room'}
          onFormChange={(updates) => { setForm((p) => ({ ...p, ...updates })); setError(''); }}
          onImagesChange={setImages}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

/* ─── Room Preview Modal ─── */

interface PreviewData {
  name: string;
  tagline: string;
  price: number;
  images: string[];
  specs: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];
  longDescription: string;
  features: string[];
  inclusions: string[];
}

function buildPreview(room: ManagedRoom, roomTypes: RoomType[]): PreviewData {
  const rt = roomTypes.find((t) => t.id === room.roomTypeId);
  const rtName = rt?.name || '';
  const s = ROOMS.find((r) => r.roomTypeKey === rtName);
  const AMENITY_TO_FEATURE: Record<string, string> = { wifi: 'wifi', coffee: 'coffee', tv: 'tv', bath: 'bath' };

  const features = room.amenities.map((a) => AMENITY_TO_FEATURE[a.toLowerCase()]).filter((f): f is string => !!f);

  return {
    name: room.name,
    tagline: room.tagline || s?.tagline || rtName || 'Hotel Accommodation',
    price: room.price > 0 ? room.price : (s?.price || 0),
    images: room.images.length > 0 ? room.images : (s?.images || ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80']),
    specs: [
      { icon: BedDouble, label: 'Bed', value: room.bedType ? `${room.bedQty || 1} ${room.bedType}${room.extraBedType ? ` + ${room.extraBedQty || 1} ${room.extraBedType}` : ''}` : (s?.specs.find((sp) => sp.label === 'Bed')?.value || '') },
      { icon: Ruler, label: 'Size', value: room.roomSize || s?.specs.find((sp) => sp.label === 'Size')?.value || '' },
      { icon: Eye, label: 'View', value: room.view || s?.specs.find((sp) => sp.label === 'View')?.value || '' },
      { icon: Users, label: 'Capacity', value: `${room.maxPax} Guests` },
    ].filter((sp) => sp.value),
    longDescription: room.longDescription || s?.longDescription || room.description || '',
    features: features.length > 0 ? features : (s?.features || []),
    inclusions: room.inclusions?.length > 0 ? room.inclusions : (s?.inclusions || []),
  };
}

function RoomPreviewModal({ room, roomTypes, onClose }: { room: ManagedRoom; roomTypes: RoomType[]; onClose: () => void }) {
  const preview = buildPreview(room, roomTypes);
  const [currentImg, setCurrentImg] = useState(0);
  const total = preview.images.length;
  const goTo = (i: number) => setCurrentImg(((i % total) + total) % total);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white dark:bg-dark-card shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-dark-card/90 text-hotel-600 dark:text-hotel-300 shadow-md backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-dark-card hover:text-hotel-900 dark:hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="absolute top-3 left-3 z-20 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Preview</div>

        <div className="grid lg:grid-cols-2 max-h-[90vh]">
          {/* Image gallery */}
          <div className="relative bg-hotel-900 flex flex-col">
            <div className="relative h-[250px] sm:h-[300px] lg:flex-1 lg:min-h-0">
              {preview.images.map((src, i) => (
                <img key={i} src={src} alt={`${preview.name} - Photo ${i + 1}`} className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${i === currentImg ? 'opacity-100' : 'opacity-0'}`} />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {total > 1 && (
                <>
                  <button onClick={() => goTo(currentImg - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"><ChevronLeft className="h-5 w-5" /></button>
                  <button onClick={() => goTo(currentImg + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"><ChevronRight className="h-5 w-5" /></button>
                </>
              )}
              <span className="absolute top-3 right-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">{currentImg + 1} / {total}</span>
            </div>
            {total > 1 && (
              <div className="flex gap-1 p-1.5 bg-hotel-900 shrink-0">
                {preview.images.map((src, i) => (
                  <button key={i} onClick={() => goTo(i)} className={`relative flex-1 h-14 sm:h-16 overflow-hidden rounded-md transition-all ${i === currentImg ? 'ring-2 ring-gold-400 opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-5 sm:p-6 lg:p-7 lg:overflow-y-auto lg:max-h-[90vh]">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 mb-0.5">{preview.tagline}</p>
              <h2 className="font-serif text-2xl font-bold text-hotel-900 dark:text-white mb-1">{preview.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gold-600">&#8369;{preview.price.toLocaleString()}</span>
                <span className="text-sm text-hotel-400">/night</span>
              </div>
            </div>

            {preview.specs.length > 0 && (
              <div className={`grid gap-2 mb-4 ${preview.specs.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {preview.specs.map((spec) => (
                  <div key={spec.label} className="rounded-lg bg-hotel-50 dark:bg-dark-bg p-2 text-center">
                    <spec.icon className="h-4 w-4 mx-auto text-gold-600 mb-0.5" />
                    <p className="text-[9px] uppercase tracking-wider text-hotel-400 font-medium">{spec.label}</p>
                    <p className="text-xs font-bold text-hotel-900 dark:text-white leading-tight">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {preview.longDescription && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-1">About This Room</h4>
                <p className="text-xs text-hotel-500 dark:text-hotel-400 leading-relaxed">{preview.longDescription}</p>
              </div>
            )}

            {preview.features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-2">Room Features</h4>
                <div className="flex flex-wrap gap-1.5">
                  {preview.features.map((feature) => {
                    const Icon = FEATURE_ICONS[feature];
                    if (!Icon) return null;
                    return (
                      <div key={feature} className="flex items-center gap-1 rounded-full bg-hotel-50 dark:bg-dark-bg px-2.5 py-1 text-hotel-600 dark:text-hotel-300">
                        <Icon className="h-3 w-3" /><span className="text-[11px] font-medium">{FEATURE_LABELS[feature]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {preview.inclusions.length > 0 && (
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-2">What&apos;s Included</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {preview.inclusions.map((item) => (
                    <div key={item} className="flex items-start gap-1.5"><Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-green-500" /><span className="text-xs text-hotel-600 dark:text-hotel-300">{item}</span></div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl bg-gold-600 py-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 opacity-75 cursor-default">
              Book This Room — &#8369;{preview.price.toLocaleString()}/night
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Tab ─── */

export default function ManageRoomsTab({ rooms, roomTypes, addRoom, updateRoom, deleteRoom }: ManageRoomsTabProps) {
  const [modalRoom, setModalRoom] = useState<ManagedRoom | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewRoom, setPreviewRoom] = useState<ManagedRoom | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedRoom | null>(null);

  const getRoomTypeName = (id: string) => roomTypes.find((rt) => rt.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-8">
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"><DoorOpen className="h-5 w-5" /></div>
            <div>
              <h3 className="font-semibold text-hotel-900 dark:text-white">All Rooms</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">{rooms.length} room{rooms.length !== 1 ? 's' : ''} configured</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Room
          </button>
        </div>

        {rooms.length === 0 ? (
          <p className="text-center text-hotel-500 dark:text-hotel-400 py-8">No rooms added yet. Click &ldquo;Add Room&rdquo; to get started.</p>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => (
              <div key={room.id} className="rounded-xl border border-hotel-100 dark:border-dark-border p-4 transition-shadow hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    {room.images.length > 0 && (
                      <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-hotel-100 dark:border-dark-border">
                        <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-hotel-900 dark:text-white truncate">{room.name}</p>
                        <span className="inline-flex items-center rounded-full bg-hotel-100 dark:bg-hotel-800 px-2 py-0.5 text-[10px] font-semibold text-hotel-600 dark:text-hotel-300">{getRoomTypeName(room.roomTypeId)}</span>
                      </div>
                      <p className="text-xs text-hotel-500 dark:text-hotel-400">
                        &#8369;{room.price.toLocaleString()}/night &middot; Max {room.maxPax} pax
                        {room.amenities.length > 0 && <> &middot; {room.amenities.slice(0, 3).join(', ')}{room.amenities.length > 3 ? ` +${room.amenities.length - 3}` : ''}</>}
                        {room.images.length > 0 && <> &middot; {room.images.length} image{room.images.length !== 1 ? 's' : ''}</>}
                      </p>
                      {room.description && <p className="text-xs text-hotel-400 mt-1 line-clamp-1">{room.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => setPreviewRoom(room)} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500" title="Preview room"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => setModalRoom(room)} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-hotel-100 dark:hover:bg-hotel-800 hover:text-hotel-700 dark:hover:text-hotel-200" title="Edit room"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(room)} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500" title="Delete room"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <RoomModal
          roomTypes={roomTypes}
          onSave={addRoom}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Modal */}
      {modalRoom && (
        <RoomModal
          room={modalRoom}
          roomTypes={roomTypes}
          onSave={addRoom}
          onUpdate={updateRoom}
          onClose={() => setModalRoom(null)}
        />
      )}

      {/* Preview Modal */}
      {previewRoom && (
        <RoomPreviewModal room={previewRoom} roomTypes={roomTypes} onClose={() => setPreviewRoom(null)} />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Room"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={() => { deleteRoom(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
