'use client';

import {
    Trash2, Mail, Phone, User, MessageSquare,
    ChevronDown, ChevronUp, PhoneCall, Globe,
} from 'lucide-react';
import type { ContactSubmission } from '@/types';
import { cardCls, formatDate } from '../shared';

interface ContactCardProps {
    submission: ContactSubmission;
    isExpanded: boolean;
    onToggle: () => void;
    onDelete: () => void;
}

function getSourceBadge(source: string) {
    if (source === 'phone') return <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300"><PhoneCall className="h-2.5 w-2.5" />Phone</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300"><Globe className="h-2.5 w-2.5" />Form</span>;
}

export { getSourceBadge };

/** Expandable contact submission card with source badge and detail panel. */
export default function ContactCard({ submission: sub, isExpanded, onToggle, onDelete }: ContactCardProps) {
    return (
        <div className={`${cardCls} overflow-hidden transition-shadow hover:shadow-md`}>
            <div className="flex items-center p-5 cursor-pointer" onClick={onToggle}>
                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 font-bold text-sm">{sub.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2"><h4 className="font-semibold text-hotel-900 dark:text-white truncate">{sub.fullName}</h4>{getSourceBadge(sub.source)}</div>
                        <p className="text-sm text-hotel-500 dark:text-hotel-400 truncate">{sub.subject || sub.email}</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm text-hotel-600 dark:text-hotel-300">
                        <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-hotel-400" /><span className="truncate max-w-[150px]">{sub.email || '—'}</span></div>
                        <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-hotel-400" />{formatDate(sub.createdAt.slice(0, 10))}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-hotel-400" /> : <ChevronDown className="h-5 w-5 text-hotel-400" />}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="border-t border-hotel-100 dark:border-dark-border bg-hotel-50/50 dark:bg-dark-bg/50 px-5 py-5">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start gap-3"><User className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Name</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{sub.fullName}</p></div></div>
                        <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Email</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{sub.email || '—'}</p></div></div>
                        <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Phone</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{sub.phone || '—'}</p></div></div>
                        <div className="flex items-start gap-3"><MessageSquare className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Subject</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{sub.subject || '—'}</p></div></div>
                    </div>
                    <div className={`mt-4 rounded-xl p-4 ${cardCls}`}>
                        <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider mb-1">Message</p>
                        <p className="text-sm text-hotel-700 dark:text-hotel-300 whitespace-pre-wrap">{sub.message}</p>
                    </div>
                    <p className="mt-4 text-xs text-hotel-400">Received on {new Date(sub.createdAt).toLocaleString()} · via {sub.source === 'phone' ? 'Phone Call' : 'Website Form'}</p>
                </div>
            )}
        </div>
    );
}
