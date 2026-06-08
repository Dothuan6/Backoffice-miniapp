import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Zap, X, Check, AlertTriangle, Search } from 'lucide-react';
import { CuEvent, CuEventCategory } from '../../types';

interface Props {
  events: CuEvent[];
  onAdd: (e: CuEvent) => void;
  onUpdate: (e: CuEvent) => void;
  onDelete: (id: string) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<CuEventCategory, string> = {
  SPEND:  'bg-red-500/10 text-red-400 border-red-500/20',
  BONUS:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  SYSTEM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

function costDisplay(cost: number, category: CuEventCategory) {
  if (category === 'SYSTEM' && cost === 0) return { text: 'variable', cls: 'text-slate-400' };
  if (cost > 0) return { text: `+${cost.toLocaleString()} CU`, cls: 'text-emerald-400' };
  return { text: `${cost.toLocaleString()} CU`, cls: 'text-red-400' };
}

const EMPTY_FORM: Omit<CuEvent, 'id' | 'createdDate'> = {
  eventName: '', cuCost: 0, category: 'SPEND', description: '', status: 'ACTIVE',
};

// ── Modal ──────────────────────────────────────────────────────────────────
function EventModal({
  initial, existingNames, onClose, onSave,
}: {
  initial: Omit<CuEvent, 'id' | 'createdDate'> | null;
  existingNames: string[];
  onClose: () => void;
  onSave: (data: Omit<CuEvent, 'id' | 'createdDate'>) => void;
}) {
  const isEdit = initial !== null;
  const [form, setForm] = useState<Omit<CuEvent, 'id' | 'createdDate'>>(initial ?? EMPTY_FORM);
  const [error, setError] = useState('');

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.eventName.trim().toUpperCase();
    if (!name) { setError('Event name is required.'); return; }
    if (!isEdit && existingNames.includes(name)) { setError(`Event "${name}" already exists.`); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    onSave({ ...form, eventName: name });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-[#1e2638] rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2638]">
          <h3 className="text-sm font-bold text-white">{isEdit ? 'Edit CU Event' : 'Add CU Event'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />{error}
            </div>
          )}
          {/* Event Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Event Name <span className="text-red-400">*</span></label>
            <input
              type="text" value={form.eventName}
              onChange={e => set('eventName', e.target.value.toUpperCase())}
              disabled={isEdit}
              placeholder="e.g. CYCLE_START"
              className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          {/* Category + CU Cost row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category <span className="text-red-400">*</span></label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value as CuEventCategory)}
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="SPEND">SPEND</option>
                <option value="BONUS">BONUS</option>
                <option value="SYSTEM">SYSTEM</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">CU Cost</label>
              <input
                type="number" value={form.cuCost}
                onChange={e => set('cuCost', Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500">Negative = deduct, Positive = credit</p>
            </div>
          </div>
          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description <span className="text-red-400">*</span></label>
            <textarea
              rows={3} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe when this event is triggered..."
              className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Status</span>
            <button type="button" onClick={() => set('status', form.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                form.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-700/30 border-[#1e2638] text-slate-400'
              }`}>
              {form.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {form.status}
            </button>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1e2638]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white border border-[#1e2638] rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors cursor-pointer">
              {isEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteModal({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Delete Event</h3>
            <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          Are you sure you want to delete <span className="font-mono text-white bg-[#0d121f] px-1.5 py-0.5 rounded">{name}</span>?
        </p>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2 text-xs text-slate-400 hover:text-white border border-[#1e2638] rounded-lg transition-colors cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 text-xs bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────
export default function CuEventsView({ events, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState<'ALL' | CuEventCategory>('ALL');
  const [addOpen, setAddOpen]         = useState(false);
  const [editing, setEditing]         = useState<CuEvent | null>(null);
  const [deleting, setDeleting]       = useState<CuEvent | null>(null);
  const [toast, setToast]             = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const existingNames = useMemo(() => events.map(e => e.eventName), [events]);

  const filtered = useMemo(() => events.filter(e => {
    const matchSearch = e.eventName.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'ALL' || e.category === catFilter;
    return matchSearch && matchCat;
  }), [events, search, catFilter]);

  const stats = useMemo(() => ({
    total:    events.length,
    active:   events.filter(e => e.status === 'ACTIVE').length,
    spend:    events.filter(e => e.category === 'SPEND').length,
    bonus:    events.filter(e => e.category === 'BONUS').length,
    system:   events.filter(e => e.category === 'SYSTEM').length,
  }), [events]);

  const handleToggle = (ev: CuEvent) => {
    onUpdate({ ...ev, status: ev.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' });
    showToast(`Event ${ev.eventName} set to ${ev.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}`);
  };

  const handleAdd = (data: Omit<CuEvent, 'id' | 'createdDate'>) => {
    const now = new Date().toISOString().split('T')[0];
    onAdd({ ...data, id: `evt-${Date.now()}`, createdDate: now });
    setAddOpen(false);
    showToast(`Event "${data.eventName}" created successfully`);
  };

  const handleEdit = (data: Omit<CuEvent, 'id' | 'createdDate'>) => {
    if (!editing) return;
    onUpdate({ ...editing, ...data });
    setEditing(null);
    showToast(`Event "${data.eventName}" updated successfully`);
  };

  const handleDelete = () => {
    if (!deleting) return;
    onDelete(deleting.id);
    showToast(`Event "${deleting.eventName}" deleted`);
    setDeleting(null);
  };

  const TABS: { key: 'ALL' | CuEventCategory; label: string; count: number }[] = [
    { key: 'ALL',    label: 'All',    count: stats.total  },
    { key: 'SPEND',  label: 'Spend',  count: stats.spend  },
    { key: 'BONUS',  label: 'Bonus',  count: stats.bonus  },
    { key: 'SYSTEM', label: 'System', count: stats.system },
  ];

  return (
    <div className="space-y-6" id="cu-events-view">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[#121f1a] border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl shadow-xl font-mono">
          <Check className="w-3.5 h-3.5" />{toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">CU Events</h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">{stats.active} active · {stats.total} total events</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" /> Add Event
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', val: stats.total,  color: 'text-slate-200' },
          { label: 'Active',       val: stats.active, color: 'text-emerald-400' },
          { label: 'Spend Events', val: stats.spend,  color: 'text-red-400' },
          { label: 'Bonus Events', val: stats.bonus,  color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#121824] border border-[#1e2638] rounded-xl px-4 py-3">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search event name or description..."
            className="w-full bg-[#121824] border border-[#1e2638] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono" />
        </div>
        {/* Category tabs */}
        <div className="flex items-center gap-1 bg-[#121824] border border-[#1e2638] rounded-lg p-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setCatFilter(t.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                catFilter === t.key
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}>
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${catFilter === t.key ? 'bg-blue-700 text-blue-200' : 'bg-[#1e2638] text-slate-500'}`}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0c101a] border-b border-[#1e2638] text-[10px] text-slate-500 tracking-wider uppercase select-none">
                <th className="px-5 py-3 font-semibold">Event Name</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">CU Cost</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Description</th>
                <th className="px-5 py-3 font-semibold text-center">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500 text-xs font-mono">No events found.</td></tr>
              ) : filtered.map(ev => {
                const cost = costDisplay(ev.cuCost, ev.category);
                const isInactive = ev.status === 'INACTIVE';
                return (
                  <tr key={ev.id} className={`hover:bg-[#161d2d]/40 transition-colors ${isInactive ? 'opacity-55' : ''}`}>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-white text-[11px] font-semibold flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-400 shrink-0" />{ev.eventName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${CATEGORY_STYLES[ev.category]}`}>
                        {ev.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`font-mono font-bold text-[11px] ${cost.cls}`}>{cost.text}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-slate-400 max-w-xs truncate">{ev.description}</td>
                    <td className="px-5 py-3.5 text-center">
                      <button onClick={() => handleToggle(ev)} title={`Toggle ${ev.eventName}`}
                        className="inline-flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                        {ev.status === 'ACTIVE'
                          ? <ToggleRight className="w-5 h-5 text-emerald-400" />
                          : <ToggleLeft  className="w-5 h-5 text-slate-500" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditing(ev)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleting(ev)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {addOpen && (
        <EventModal initial={null} existingNames={existingNames} onClose={() => setAddOpen(false)} onSave={handleAdd} />
      )}
      {editing && (
        <EventModal
          initial={{ eventName: editing.eventName, cuCost: editing.cuCost, category: editing.category, description: editing.description, status: editing.status }}
          existingNames={existingNames}
          onClose={() => setEditing(null)}
          onSave={handleEdit}
        />
      )}
      {deleting && (
        <DeleteModal name={deleting.eventName} onClose={() => setDeleting(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}
