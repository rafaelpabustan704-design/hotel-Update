'use client';

import { useState } from 'react';
import { Trash2, Pencil, Plus, DoorOpen, Eye } from 'lucide-react';

import type { RoomType, ManagedRoom } from '@/types';
import { useRooms } from '@/hooks/RoomContext';
import { cardCls } from './shared';
import ConfirmModal from './ConfirmModal';
import RoomModal from './rooms/RoomModal';
import RoomPreviewModal from './rooms/RoomPreviewModal';

interface ManageRoomsTabProps {
  rooms: ManagedRoom[];
  roomTypes: RoomType[];
  addRoom: (data: Omit<ManagedRoom, 'id' | 'createdAt'>) => void;
  updateRoom: (id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => void;
  deleteRoom: (id: string) => void;
}

export default function ManageRoomsTab({ rooms, roomTypes, addRoom, updateRoom, deleteRoom }: ManageRoomsTabProps) {
  const { setDraftRoom } = useRooms();
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
                        ₱{room.price.toLocaleString('en-PH')}/night
                        {(() => { const rt = roomTypes.find((t) => t.id === room.roomTypeId); const perks = rt?.perks || []; return perks.length > 0 ? <> &middot; {perks.slice(0, 3).join(', ')}{perks.length > 3 ? ` +${perks.length - 3}` : ''}</> : null; })()}
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

      {showAddModal && (
        <RoomModal roomTypes={roomTypes} onSave={addRoom} onClose={() => setShowAddModal(false)} setDraftRoom={setDraftRoom} />
      )}

      {modalRoom && (
        <RoomModal room={modalRoom} roomTypes={roomTypes} onSave={addRoom} onUpdate={updateRoom} onClose={() => setModalRoom(null)} setDraftRoom={setDraftRoom} />
      )}

      {previewRoom && (
        <RoomPreviewModal room={previewRoom} roomTypes={roomTypes} onClose={() => setPreviewRoom(null)} />
      )}

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
