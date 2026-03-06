'use client';

import { useState } from 'react';
import { Trash2, Pencil, Plus, Layers, XCircle } from 'lucide-react';
import type { RoomType } from '@/types';
import { getColorClasses, useRoomTypes } from '@/hooks/RoomTypeContext';
import { cardCls } from './shared';
import ConfirmModal from './ConfirmModal';
import RoomTypeModal from './rooms/RoomTypeModal';

interface RoomTypesTabProps {
  roomTypes: RoomType[];
  addRoomType: (data: Omit<RoomType, 'id' | 'createdAt'>) => void;
  updateRoomType: (id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt'>>) => void;
  deleteRoomType: (id: string) => { success: boolean; error?: string };
}

export default function RoomTypesTab({ roomTypes, addRoomType, updateRoomType, deleteRoomType }: RoomTypesTabProps) {
  const { setDraftRoomType } = useRoomTypes();
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

      {showAddModal && <RoomTypeModal onAdd={addRoomType} onClose={() => setShowAddModal(false)} setDraftRoomType={setDraftRoomType} />}
      {modalType && <RoomTypeModal roomType={modalType} onAdd={addRoomType} onUpdate={updateRoomType} onClose={() => setModalType(null)} setDraftRoomType={setDraftRoomType} />}

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
