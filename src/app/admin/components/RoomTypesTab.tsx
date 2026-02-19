'use client';

import { useState } from 'react';
import { Trash2, Pencil, Plus, Layers, X, XCircle } from 'lucide-react';
import type { RoomType } from '@/utils/types';
import { COLOR_OPTIONS, getColorClasses } from '@/hooks/RoomTypeContext';
import { cardCls, inputCls, labelCls } from './shared';
import ConfirmModal from './ConfirmModal';

interface RoomTypesTabProps {
  roomTypes: RoomType[];
  addRoomType: (data: Omit<RoomType, 'id' | 'createdAt'>) => void;
  updateRoomType: (id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt'>>) => void;
  deleteRoomType: (id: string) => { success: boolean; error?: string };
}

const EMPTY_FORM = { name: '', totalRooms: 1, maxAdults: 2, maxChildren: 2, color: 'blue' };

/* ─── Room Type Form ─── */

interface FormProps {
  form: typeof EMPTY_FORM;
  error: string;
  submitLabel: string;
  onFormChange: (updates: Partial<typeof EMPTY_FORM>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

function RoomTypeForm({ form, error, submitLabel, onFormChange, onSubmit, onCancel }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Name</label>
          <input type="text" value={form.name} onChange={(e) => onFormChange({ name: e.target.value })} placeholder="e.g. Deluxe Room" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Total Rooms</label>
          <input type="number" min={1} value={form.totalRooms} onChange={(e) => onFormChange({ totalRooms: parseInt(e.target.value) || 1 })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Color Tag</label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onFormChange({ color: c.value })}
                className={`h-8 w-8 rounded-full border-2 transition-all ${form.color === c.value ? 'border-white ring-2 ring-offset-1 ring-offset-white dark:ring-offset-dark-card scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                style={{ backgroundColor: c.hex, ...(form.color === c.value ? { '--tw-ring-color': c.hex } as React.CSSProperties : {}) }}
                title={c.label}
              />
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Max Adults</label>
          <input type="number" min={1} value={form.maxAdults} onChange={(e) => onFormChange({ maxAdults: parseInt(e.target.value) || 1 })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Max Children</label>
          <input type="number" min={0} value={form.maxChildren} onChange={(e) => onFormChange({ maxChildren: parseInt(e.target.value) || 0 })} className={inputCls} />
        </div>
      </div>
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
  const [form, setForm] = useState(
    isEdit
      ? { name: roomType.name, totalRooms: roomType.totalRooms, maxAdults: roomType.maxAdults, maxChildren: roomType.maxChildren, color: roomType.color }
      : { ...EMPTY_FORM }
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    const payload = { name: form.name.trim(), totalRooms: form.totalRooms, maxAdults: form.maxAdults, maxChildren: form.maxChildren, color: form.color };
    if (isEdit && onUpdate) {
      onUpdate(roomType.id, payload);
    } else {
      onAdd(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-2xl p-6">
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
          form={form}
          error={error}
          submitLabel={isEdit ? 'Save Changes' : 'Add Room Type'}
          onFormChange={(updates) => { setForm((p) => ({ ...p, ...updates })); setError(''); }}
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
              return (
                <div key={rt.id} className="rounded-xl border border-hotel-100 dark:border-dark-border p-4 transition-shadow hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: cc.hexBg }}>
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cc.hex }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-hotel-900 dark:text-white truncate">{rt.name}</p>
                        <p className="text-xs text-hotel-500 dark:text-hotel-400">
                          {rt.totalRooms} room{rt.totalRooms !== 1 ? 's' : ''} &middot; Max {rt.maxAdults} adult{rt.maxAdults !== 1 ? 's' : ''}, {rt.maxChildren} child{rt.maxChildren !== 1 ? 'ren' : ''}
                        </p>
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
