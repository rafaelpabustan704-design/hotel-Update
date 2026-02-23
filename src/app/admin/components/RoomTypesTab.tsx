'use client';

import { useState } from 'react';
import { Trash2, Pencil, Plus, Layers, X, XCircle, Check } from 'lucide-react';
import type { RoomType } from '@/types';
import { COLOR_OPTIONS, getColorClasses } from '@/hooks/RoomTypeContext';
import { cardCls, inputCls, labelCls } from './shared';
import ConfirmModal from './ConfirmModal';

interface RoomTypesTabProps {
  roomTypes: RoomType[];
  addRoomType: (data: Omit<RoomType, 'id' | 'createdAt'>) => void;
  updateRoomType: (id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt'>>) => void;
  deleteRoomType: (id: string) => { success: boolean; error?: string };
}

const DEFAULT_VALUES = { totalRooms: 1, maxAdults: 2, maxChildren: 2, color: 'blue' };

const PERK_OPTIONS_AMENITIES = [
  'WiFi', 'Coffee', 'TV', 'Bath', 'Mini Bar', 'Room Service',
  'Air Conditioning', 'Safe', 'Lounge Access', 'Butler Service',
  'Private Terrace', 'Balcony', 'Kitchen', 'Jacuzzi',
];

const PERK_OPTIONS_INCLUSIONS = [
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

/* ─── Chip Selector ─── */

function ChipSelector({ options, selected, onChange, columns = 2 }: { options: string[]; selected: string[]; onChange: (items: string[]) => void; columns?: number }) {
  const toggle = (item: string) => {
    onChange(selected.includes(item) ? selected.filter((s) => s !== item) : [...selected, item]);
  };

  const gridCls = columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';

  return (
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
  );
}

/* ─── Section helpers ─── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xs font-semibold uppercase tracking-wider text-hotel-400 dark:text-hotel-500 border-b border-hotel-100 dark:border-dark-border pb-2 mb-4">{children}</h4>;
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-hotel-100 dark:border-dark-border bg-hotel-50/50 dark:bg-dark-bg/50 p-4 flex flex-col">{children}</div>;
}

/* ─── Room Type Form ─── */

interface FormProps {
  name: string;
  color: string;
  perks: string[];
  error: string;
  submitLabel: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onPerksChange: (perks: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

function RoomTypeForm({ name, color, perks, error, submitLabel, onNameChange, onColorChange, onPerksChange, onSubmit, onCancel }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
        <div>
          <label className={labelCls}>Name</label>
          <input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Deluxe Room" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Color</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onColorChange(c.value)}
                className={`h-9 w-9 rounded-full border-2 transition-all ${color === c.value ? 'border-white ring-2 ring-offset-1 ring-offset-white dark:ring-offset-dark-card scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                style={{ backgroundColor: c.hex, ...(color === c.value ? { '--tw-ring-color': c.hex } as React.CSSProperties : {}) }}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </div>

      <SectionCard>
        <SectionHeading>Amenities</SectionHeading>
        <ChipSelector
          options={PERK_OPTIONS_AMENITIES}
          columns={3}
          selected={perks}
          onChange={onPerksChange}
        />
      </SectionCard>

      <SectionCard>
        <SectionHeading>What&apos;s Included</SectionHeading>
        <ChipSelector
          options={PERK_OPTIONS_INCLUSIONS}
          selected={perks}
          onChange={onPerksChange}
        />
      </SectionCard>

      {perks.length > 0 && (
        <p className="text-[11px] text-hotel-400">{perks.length} perk{perks.length !== 1 ? 's' : ''} selected</p>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{error}</p>}
      <div className="flex gap-3">
        <button type="submit" className="rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border border-hotel-200 dark:border-dark-border px-6 py-3 text-sm font-medium text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-hotel-800 transition-colors">Cancel</button>}
      </div>
    </form>
  );
}

/* ─── Modal (Add & Edit) ─── */

interface ModalProps {
  roomType?: RoomType;
  onAdd: (data: Omit<RoomType, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt'>>) => void;
  onClose: () => void;
}

function RoomTypeModal({ roomType, onAdd, onUpdate, onClose }: ModalProps) {
  const isEdit = !!roomType;
  const [name, setName] = useState(isEdit ? roomType.name : '');
  const [color, setColor] = useState(isEdit ? roomType.color : 'blue');
  const [perks, setPerks] = useState<string[]>(isEdit ? (roomType.perks || []) : []);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    if (isEdit && onUpdate) {
      onUpdate(roomType.id, { name: name.trim(), color, perks });
    } else {
      onAdd({ ...DEFAULT_VALUES, name: name.trim(), color, perks });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isEdit ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
              {isEdit ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-hotel-900 dark:text-white">{isEdit ? 'Edit Room Type' : 'Add Room Type'}</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">{isEdit ? <>Update &ldquo;{roomType.name}&rdquo;</> : 'Create a new room type category'}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 hover:bg-hotel-100 dark:hover:bg-hotel-800 hover:text-hotel-700 dark:hover:text-hotel-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <RoomTypeForm
          name={name}
          color={color}
          perks={perks}
          error={error}
          submitLabel={isEdit ? 'Save Changes' : 'Add Room Type'}
          onNameChange={(v) => { setName(v); setError(''); }}
          onColorChange={setColor}
          onPerksChange={(p) => { setPerks(p); setError(''); }}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

/* ─── Main Tab ─── */

export default function RoomTypesTab({ roomTypes, addRoomType, updateRoomType, deleteRoomType }: RoomTypesTabProps) {
  const [modalType, setModalType] = useState<RoomType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<RoomType | null>(null);

  const handleDelete = (rt: RoomType) => {
    const result = deleteRoomType(rt.id);
    if (!result.success) setDeleteError(result.error || 'Cannot delete');
    else setDeleteError('');
  };

  return (
    <div className="space-y-8">
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"><Layers className="h-5 w-5" /></div>
            <div>
              <h3 className="font-semibold text-hotel-900 dark:text-white">Room Types</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">{roomTypes.length} type{roomTypes.length !== 1 ? 's' : ''} configured</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Type
          </button>
        </div>

        {deleteError && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2 mb-4"><XCircle className="h-4 w-4 shrink-0" />{deleteError}</p>}

        {roomTypes.length === 0 ? (
          <p className="text-center text-hotel-500 dark:text-hotel-400 py-8">No room types yet. Click &ldquo;Add Type&rdquo; to get started.</p>
        ) : (
          <div className="space-y-3">
            {roomTypes.map((rt) => {
              const cc = getColorClasses(rt.color);
              const perkCount = rt.perks?.length || 0;
              return (
                <div key={rt.id} className="rounded-xl border border-hotel-100 dark:border-dark-border p-4 transition-shadow hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: cc.hexBg }}>
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cc.hex }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-hotel-900 dark:text-white truncate">{rt.name}</p>
                        {perkCount > 0 && (
                          <p className="text-xs text-hotel-500 dark:text-hotel-400">
                            {rt.perks.slice(0, 3).join(', ')}{perkCount > 3 ? ` +${perkCount - 3} more` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={() => setModalType(rt)} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-hotel-100 dark:hover:bg-hotel-800 hover:text-hotel-700 dark:hover:text-hotel-200" title="Edit room type"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteTarget(rt)} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500" title="Delete room type"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <RoomTypeModal
          onAdd={addRoomType}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {modalType && (
        <RoomTypeModal
          roomType={modalType}
          onAdd={addRoomType}
          onUpdate={updateRoomType}
          onClose={() => setModalType(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Room Type"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={() => { handleDelete(deleteTarget); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
