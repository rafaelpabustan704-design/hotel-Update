'use client';

import { useState } from 'react';
import { X, Save, PhoneCall } from 'lucide-react';
import type { ContactSubmission } from '@/types';
import { cardCls, inputCls } from '../shared';

const EMPTY_FORM = { fullName: '', email: '', phone: '', subject: '', message: '' };

interface AddContactFormProps {
    onAdd: (data: Omit<ContactSubmission, 'id'>) => void;
    onClose: () => void;
}

/** Inline form for logging a phone call inquiry. */
export default function AddContactForm({ onAdd, onClose }: AddContactFormProps) {
    const [form, setForm] = useState(EMPTY_FORM);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ ...form, source: 'phone', createdAt: new Date().toISOString() });
        setForm(EMPTY_FORM);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className={`${cardCls} p-5 mb-6 space-y-4`}>
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-hotel-900 dark:text-white flex items-center gap-2"><PhoneCall className="h-4 w-4 text-purple-500" />Log Phone Call Inquiry</h4>
                <button type="button" onClick={onClose} className="text-hotel-400 hover:text-hotel-600 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <input name="fullName" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="Caller Name *" required className={inputCls} />
                <input name="phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone Number *" required className={inputCls} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <input name="email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email (optional)" className={inputCls} />
                <input name="subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Subject *" required className={inputCls} />
            </div>
            <textarea name="message" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Call Notes / Message *" required rows={3} className={`${inputCls} resize-none`} />
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-gold-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gold-700 transition-colors"><Save className="h-4 w-4" />Save</button>
        </form>
    );
}
