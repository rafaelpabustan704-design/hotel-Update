'use client';

import { useState, useEffect } from 'react';
import { Pencil, Plus, X } from 'lucide-react';
import type { RoomType } from '@/types';
import RoomTypeForm from './RoomTypeForm';

const DEFAULT_VALUES = { totalRooms: 1, maxAdults: 2, maxChildren: 2, color: 'blue' };

interface RoomTypeModalProps {
    roomType?: RoomType;
    onAdd: (data: Omit<RoomType, 'id' | 'createdAt'>) => void;
    onUpdate?: (id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt'>>) => void;
    onClose: () => void;
    setDraftRoomType: (id: string, data: Partial<RoomType> | null) => void;
}

export default function RoomTypeModal({ roomType, onAdd, onUpdate, onClose, setDraftRoomType }: RoomTypeModalProps) {
    const isEdit = !!roomType;
    const [name, setName] = useState(isEdit ? roomType.name : '');
    const [color, setColor] = useState(isEdit ? roomType.color : 'blue');
    const [perks, setPerks] = useState<string[]>(isEdit ? (roomType.perks || []) : []);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit && roomType) {
            setDraftRoomType(roomType.id, { name, color, perks });
            return () => setDraftRoomType(roomType.id, null);
        }
    }, [isEdit, roomType, name, color, perks, setDraftRoomType]);

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
