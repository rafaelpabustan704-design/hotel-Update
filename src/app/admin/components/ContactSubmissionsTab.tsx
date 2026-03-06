'use client';

import { useState, useMemo } from 'react';
import {
    Search, MessageSquare, Mail, Phone,
    Filter, ArrowUpDown,
    X, Plus, Globe, Archive,
} from 'lucide-react';
import type { ContactSubmission } from '@/types';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/ui/Pagination';
import { cardCls, inputCls, selectCls, smallLabelCls, formatDate } from './shared';
import ConfirmModal from './ConfirmModal';
import ContactCard, { getSourceBadge } from './contacts/ContactCard';
import AddContactForm from './contacts/AddContactForm';

type SourceFilter = 'all' | 'form' | 'phone';
type SortBy = 'newest' | 'oldest' | 'name-asc';

interface ContactSubmissionsTabProps {
    submissions: ContactSubmission[];
    deleteSubmission: (id: string) => void;
    addSubmission: (data: Omit<ContactSubmission, 'id'>) => void;
    archivedSubmissions: ContactSubmission[];
}

export default function ContactSubmissionsTab({ submissions, deleteSubmission, addSubmission, archivedSubmissions }: ContactSubmissionsTabProps) {
    const [archiveView, setArchiveView] = useState(false);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
    const [sortBy, setSortBy] = useState<SortBy>('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);
    const [adding, setAdding] = useState(false);

    const hasActiveFilters = sourceFilter !== 'all' || sortBy !== 'newest';
    const clearFilters = () => { setSourceFilter('all'); setSortBy('newest'); setSearch(''); };

    const todayStr = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    const filtered = useMemo(() => {
        let result = [...submissions];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter((s) => s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.subject.toLowerCase().includes(q) || s.phone.toLowerCase().includes(q));
        }
        if (sourceFilter !== 'all') result = result.filter((s) => s.source === sourceFilter);
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'name-asc': return a.fullName.localeCompare(b.fullName);
                default: return 0;
            }
        });
        return result;
    }, [submissions, search, sourceFilter, sortBy]);

    const pagination = usePagination({ data: filtered, itemsPerPage: 10 });

    return (
        <>
            {/* Active / Archived toggle */}
            <div className="flex items-center justify-between mb-4">
                <div className="inline-flex rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-card p-1 shadow-sm">
                    <button onClick={() => setArchiveView(false)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${!archiveView ? 'bg-gold-600 text-white shadow-sm' : 'text-hotel-500 dark:text-hotel-400 hover:text-hotel-700 dark:hover:text-hotel-200'}`}>
                        <MessageSquare className="h-3.5 w-3.5" />Active ({submissions.length})
                    </button>
                    <button onClick={() => setArchiveView(true)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${archiveView ? 'bg-gold-600 text-white shadow-sm' : 'text-hotel-500 dark:text-hotel-400 hover:text-hotel-700 dark:hover:text-hotel-200'}`}>
                        <Archive className="h-3.5 w-3.5" />Archived ({archivedSubmissions.length})
                    </button>
                </div>
                {archiveView && archivedSubmissions.length > 0 && (
                    <p className="text-xs text-hotel-400 dark:text-hotel-500">Auto-archived after 14 days</p>
                )}
            </div>

            {/* Archived view */}
            {archiveView && (
                <>
                    {archivedSubmissions.length === 0 ? (
                        <div className={`${cardCls} p-16 text-center`}>
                            <Archive className="mx-auto h-16 w-16 text-hotel-200 dark:text-hotel-600 mb-4" />
                            <h3 className="font-serif text-xl font-bold text-hotel-900 dark:text-white mb-2">No Archived Inquiries</h3>
                            <p className="text-hotel-500 dark:text-hotel-400">Inquiries older than 14 days are automatically archived here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {archivedSubmissions.map((sub) => (
                                <div key={sub.id} className={`${cardCls} p-4`}>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hotel-100 dark:bg-hotel-800 text-hotel-500 dark:text-hotel-400 font-bold text-sm">{sub.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-hotel-900 dark:text-white truncate">{sub.fullName}</h4>
                                                <span className="inline-flex items-center rounded-full bg-hotel-100 dark:bg-hotel-800 px-2 py-0.5 text-[10px] font-semibold text-hotel-500 dark:text-hotel-400">Archived</span>
                                                {getSourceBadge(sub.source)}
                                            </div>
                                            <p className="text-sm text-hotel-500 dark:text-hotel-400 truncate">{sub.subject || sub.email}</p>
                                        </div>
                                        <div className="hidden md:flex items-center gap-6 text-sm text-hotel-500 dark:text-hotel-400">
                                            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span className="truncate max-w-[150px]">{sub.email || '—'}</span></div>
                                            <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />{formatDate(sub.createdAt.slice(0, 10))}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Active view */}
            {!archiveView && <>
                {/* Stat cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <div className={`${cardCls} px-4 py-3`}>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><MessageSquare className="h-4 w-4" /></div>
                            <div><p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{submissions.length}</p><p className="text-xs text-hotel-500 dark:text-hotel-400">Total Inquiries</p></div>
                        </div>
                    </div>
                    <div className={`${cardCls} px-4 py-3`}>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"><Mail className="h-4 w-4" /></div>
                            <div><p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{submissions.filter((s) => s.createdAt.startsWith(todayStr)).length}</p><p className="text-xs text-hotel-500 dark:text-hotel-400">Today</p></div>
                        </div>
                    </div>
                    <div className={`${cardCls} px-4 py-3`}>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><Phone className="h-4 w-4" /></div>
                            <div><p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{submissions.filter((s) => s.createdAt >= weekAgo).length}</p><p className="text-xs text-hotel-500 dark:text-hotel-400">This Week</p></div>
                        </div>
                    </div>
                </div>

                {/* Add phone call + search + filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <button onClick={() => setAdding(!adding)} className="flex items-center gap-1.5 rounded-xl bg-gold-600 px-4 py-3 text-sm font-bold text-white hover:bg-gold-700 transition-colors shrink-0">
                        <Plus className="h-4 w-4" />Log Phone Call
                    </button>
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hotel-400" />
                        <input type="text" placeholder="Search by name, email, phone, or subject..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-12`} />
                        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-hotel-400 hover:bg-hotel-100 hover:text-hotel-600 transition-colors"><X className="h-3.5 w-3.5" /></button>}
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition-all ${showFilters || hasActiveFilters ? 'border-gold-400 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400' : 'border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-card text-hotel-600 dark:text-hotel-300 hover:border-hotel-300'}`}>
                        <Filter className="h-4 w-4" />Filters
                        {hasActiveFilters && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white">{(sourceFilter !== 'all' ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)}</span>}
                    </button>
                </div>

                {adding && <AddContactForm onAdd={addSubmission} onClose={() => setAdding(false)} />}

                {showFilters && (
                    <div className={`mb-6 rounded-xl ${cardCls} p-5`}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-hotel-900 dark:text-white flex items-center gap-2"><Filter className="h-4 w-4 text-hotel-400" />Filter & Sort</h4>
                            {hasActiveFilters && <button onClick={clearFilters} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"><X className="h-3 w-3" />Clear all</button>}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className={smallLabelCls}><Globe className="h-3.5 w-3.5" />Source</label><select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as SourceFilter)} className={selectCls}><option value="all">All Sources</option><option value="form">Website Form</option><option value="phone">Phone Call</option></select></div>
                            <div><label className={smallLabelCls}><ArrowUpDown className="h-3.5 w-3.5" />Sort By</label><select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className={selectCls}><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="name-asc">Name (A-Z)</option></select></div>
                        </div>
                    </div>
                )}

                {(search || hasActiveFilters) && filtered.length > 0 && <p className="mb-4 text-sm text-hotel-500 dark:text-hotel-400">Showing <span className="font-semibold text-hotel-700 dark:text-hotel-200">{filtered.length}</span> of <span className="font-semibold text-hotel-700 dark:text-hotel-200">{submissions.length}</span> inquiries</p>}

                {filtered.length === 0 ? (
                    <div className={`${cardCls} p-16 text-center`}>
                        <MessageSquare className="mx-auto h-16 w-16 text-hotel-200 dark:text-hotel-600 mb-4" />
                        <h3 className="font-serif text-xl font-bold text-hotel-900 dark:text-white mb-2">{submissions.length === 0 ? 'No Inquiries Yet' : 'No Results Found'}</h3>
                        <p className="text-hotel-500 dark:text-hotel-400 mb-4">{submissions.length === 0 ? 'Customer inquiries from the contact form and phone calls will appear here.' : 'Try adjusting your search or filters.'}</p>
                        {(search || hasActiveFilters) && submissions.length > 0 && <button onClick={clearFilters} className="rounded-lg bg-hotel-100 dark:bg-hotel-800 px-4 py-2 text-sm font-medium text-hotel-700 dark:text-hotel-300 transition-colors hover:bg-hotel-200 dark:hover:bg-hotel-700">Clear All Filters</button>}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pagination.paginatedData.map((sub) => (
                            <ContactCard
                                key={sub.id}
                                submission={sub}
                                isExpanded={expandedId === sub.id}
                                onToggle={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                                onDelete={() => setDeleteTarget(sub)}
                            />
                        ))}
                    </div>
                )}

                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    onPageChange={pagination.setCurrentPage}
                    itemsPerPage={pagination.itemsPerPage}
                    onItemsPerPageChange={pagination.setItemsPerPage}
                    itemLabel="inquiries"
                />

                {deleteTarget && (
                    <ConfirmModal
                        title="Delete Inquiry"
                        message={`Are you sure you want to delete the inquiry from "${deleteTarget.fullName}"? This action cannot be undone.`}
                        onConfirm={() => { deleteSubmission(deleteTarget.id); setDeleteTarget(null); }}
                        onCancel={() => setDeleteTarget(null)}
                    />
                )}
            </>}
        </>
    );
}
