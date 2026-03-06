'use client';

import { useState, useEffect } from 'react';
import { Pencil, Plus, X } from 'lucide-react';
import type { RoomType, ManagedRoom } from '@/types';
import RoomForm, { EMPTY_FORM } from './RoomForm';

function getStaticDefaults(_room: ManagedRoom, _roomTypes: RoomType[]): {
    tagline?: string; description?: string; longDescription?: string;
    bedType?: string; roomSize?: string; view?: string; inclusions?: string[];
} {
    return {};
}

interface RoomModalProps {
    room?: ManagedRoom;
    roomTypes: RoomType[];
    onSave: (data: Omit<ManagedRoom, 'id' | 'createdAt'>) => void;
    onUpdate?: (id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => void;
    onClose: () => void;
    setDraftRoom: (id: string, data: Partial<ManagedRoom> | null) => void;
}

export default function RoomModal({ room, roomTypes, onSave, onUpdate, onClose, setDraftRoom }: RoomModalProps) {
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

    useEffect(() => {
        if (isEdit && room) {
            const amenitiesArr = form.amenities.split(',').map((a) => a.trim()).filter(Boolean);
            const inclusionsArr = form.inclusions.split(',').map((a) => a.trim()).filter(Boolean);
            setDraftRoom(room.id, {
                name: form.name,
                roomTypeId: form.roomTypeId,
                price: form.price,
                maxPax: form.maxPax,
                description: form.description,
                longDescription: form.longDescription,
                tagline: form.tagline,
                bedType: form.bedType,
                bedQty: form.bedQty,
                extraBedType: form.extraBedType,
                extraBedQty: form.extraBedType ? form.extraBedQty : 0,
                roomSize: form.roomSize,
                view: form.view,
                amenities: amenitiesArr,
                inclusions: inclusionsArr,
                images,
            });
            return () => setDraftRoom(room.id, null);
        }
    }, [isEdit, room, form, images, setDraftRoom]);

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
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-2xl p-6">
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
