import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Package, X, AlertTriangle, Check, Star, Layers, LayoutGrid, List } from 'lucide-react';
import { CuPackage } from '../../types';

interface Props {
  packages: CuPackage[];
  onAdd: (p: CuPackage) => void;
  onUpdate: (p: CuPackage) => void;
  onDelete: (id: string) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
  'POPULAR':    'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'BEST VALUE': 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'ENTERPRISE': 'bg-blue-500/15 text-blue-400 border-blue-500/25',
};

function effectivePrice(price: number, discount: number) {
  return price * (1 - discount / 100);
}

const EMPTY_FORM = (): Omit<CuPackage, 'id' | 'createdDate'> => ({
  name: '', cuAmount: 1000, priceUsd: 9.99, discountPercent: 0, status: 'ACTIVE', badge: '',
});

// ── Package Modal ──────────────────────────────────────────────────────────
function PackageModal({
  initial, onClose, onSave,
}: {
  initial: CuPackage | null;
  onClose: () => void;
  onSave: (data: Omit<CuPackage, 'id' | 'createdDate'>) => void;
}) {
  const isEdit = initial !== null;
  const [form, setForm] = useState<Omit<CuPackage, 'id' | 'createdDate'>>(
    isEdit
      ? { name: initial.name, cuAmount: initial.cuAmount, priceUsd: initial.priceUsd, discountPercent: initial.discountPercent, status: initial.status, badge: initial.badge ?? '' }
      : EMPTY_FORM()
  );
  const [error, setError] = useState('');

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const effective = effectivePrice(form.priceUsd, form.discountPercent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Package name is required.'); return; }
    if (form.cuAmount <= 0) { setError('CU amount must be greater than 0.'); return; }
    if (form.priceUsd <= 0) { setError('Price must be greater than 0.'); return; }
    if (form.discountPercent < 0 || form.discountPercent > 100) { setError('Discount must be 0–100.'); return; }
    onSave({ ...form, badge: form.badge?.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-[#1e2638] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2638]">
          <h3 className="text-sm font-bold text-white">{isEdit ? 'Edit Package' : 'New CU Package'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />{error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Package Name <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Pro Pack"
              className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500" />
          </div>

          {/* CU + Price row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">CU Amount <span className="text-red-400">*</span></label>
              <input type="number" value={form.cuAmount} onChange={e => set('cuAmount', Number(e.target.value))}
                min={1} placeholder="10000"
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Price (USD) <span className="text-red-400">*</span></label>
              <input type="number" value={form.priceUsd} onChange={e => set('priceUsd', Number(e.target.value))}
                min={0.01} step={0.01} placeholder="79.99"
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Discount + Badge row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Discount %</label>
              <input type="number" value={form.discountPercent} onChange={e => set('discountPercent', Number(e.target.value))}
                min={0} max={100} placeholder="0"
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Badge Label</label>
              <input type="text" value={form.badge ?? ''} onChange={e => set('badge', e.target.value)}
                placeholder="e.g. POPULAR"
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Price preview */}
          {form.discountPercent > 0 && (
            <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-lg px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-slate-400">Effective price after discount</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">${effective.toFixed(2)}</span>
            </div>
          )}

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

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1e2638]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white border border-[#1e2638] rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors cursor-pointer">
              {isEdit ? 'Save Changes' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteModal({ pkg, paymentCount, onClose, onConfirm }: {
  pkg: CuPackage; paymentCount: number; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Delete Package</h3>
            <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          Delete <span className="font-semibold text-white">"{pkg.name}"</span>?
        </p>
        {paymentCount > 0 && (
          <div className="bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs px-3 py-2.5 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            This package has <strong>{paymentCount}</strong> associated payment(s). Deleting will not affect payment history.
          </div>
        )}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2 text-xs text-slate-400 hover:text-white border border-[#1e2638] rounded-lg transition-colors cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 text-xs bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Package Card ───────────────────────────────────────────────────────────
interface PackageCardProps {
  pkg: CuPackage;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onEdit, onDelete, onToggle }) => {
  const eff = effectivePrice(pkg.priceUsd, pkg.discountPercent);
  const isInactive = pkg.status === 'INACTIVE';

  return (
    <div className={`relative bg-[#121824] border rounded-xl p-5 flex flex-col gap-4 transition-all ${
      isInactive ? 'border-[#1e2638] opacity-60' : 'border-[#1e2638] hover:border-blue-500/30'
    }`}>
      {/* Badge */}
      {pkg.badge && (
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${BADGE_STYLES[pkg.badge] ?? 'bg-slate-700/40 text-slate-400 border-slate-600/30'}`}>
          {pkg.badge}
        </span>
      )}
      {/* Status dot */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isInactive ? 'bg-slate-600' : 'bg-emerald-400'}`} />
        <span className={`text-[10px] font-mono font-semibold ${isInactive ? 'text-slate-500' : 'text-emerald-400'}`}>
          {pkg.status}
        </span>
      </div>

      {/* Name + CU */}
      <div>
        <h3 className="text-sm font-bold text-white">{pkg.name}</h3>
        <p className="text-2xl font-bold text-blue-400 font-mono mt-1">{pkg.cuAmount.toLocaleString()} <span className="text-sm text-slate-400">CU</span></p>
      </div>

      {/* Pricing */}
      <div className="flex items-end gap-2">
        {pkg.discountPercent > 0 ? (
          <>
            <span className="text-xl font-bold text-white font-mono">${eff.toFixed(2)}</span>
            <span className="text-xs text-slate-500 line-through font-mono mb-0.5">${pkg.priceUsd.toFixed(2)}</span>
            <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full ml-auto mb-0.5">-{pkg.discountPercent}%</span>
          </>
        ) : (
          <span className="text-xl font-bold text-white font-mono">${pkg.priceUsd.toFixed(2)}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#1e2638]">
        <button onClick={onToggle}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
          {pkg.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
          {pkg.status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main View ─────────────────────────────────────────────────────────────
export default function CuPackagesView({ packages, onAdd, onUpdate, onDelete }: Props) {
  const [viewMode, setViewMode]     = useState<'cards' | 'table'>('cards');
  const [addOpen, setAddOpen]       = useState(false);
  const [editing, setEditing]       = useState<CuPackage | null>(null);
  const [deleting, setDeleting]     = useState<CuPackage | null>(null);
  const [toast, setToast]           = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const stats = useMemo(() => {
    const active = packages.filter(p => p.status === 'ACTIVE');
    const totalRevenue = packages.reduce((s, p) => s + effectivePrice(p.priceUsd, p.discountPercent), 0);
    return { active: active.length, total: packages.length, totalRevenue };
  }, [packages]);

  const handleAdd = (data: Omit<CuPackage, 'id' | 'createdDate'>) => {
    onAdd({ ...data, id: `pkg-${Date.now()}`, createdDate: new Date().toISOString().split('T')[0] });
    setAddOpen(false);
    showToast(`Package "${data.name}" created successfully`);
  };

  const handleEdit = (data: Omit<CuPackage, 'id' | 'createdDate'>) => {
    if (!editing) return;
    onUpdate({ ...editing, ...data });
    setEditing(null);
    showToast(`Package "${data.name}" updated successfully`);
  };

  const handleDelete = () => {
    if (!deleting) return;
    onDelete(deleting.id);
    showToast(`Package "${deleting.name}" deleted`);
    setDeleting(null);
  };

  const handleToggle = (pkg: CuPackage) => {
    onUpdate({ ...pkg, status: pkg.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' });
    showToast(`Package "${pkg.name}" set to ${pkg.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}`);
  };

  return (
    <div className="space-y-6" id="cu-packages-view">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[#121f1a] border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl shadow-xl font-mono">
          <Check className="w-3.5 h-3.5" />{toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">CU Packages</h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">{stats.active} active · {stats.total} total packages</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" /> New Package
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Packages',    val: stats.active,   icon: <Package className="w-4 h-4" />,       color: 'text-blue-400',    icbg: 'bg-blue-500/10' },
          { label: 'Total Packages',     val: stats.total,    icon: <Layers className="w-4 h-4" />,         color: 'text-slate-200',   icbg: 'bg-slate-500/10' },
          { label: 'Avg Package Value',  val: `$${(stats.totalRevenue / Math.max(stats.total, 1)).toFixed(0)}`, icon: <Star className="w-4 h-4" />, color: 'text-amber-400', icbg: 'bg-amber-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-[#121824] border border-[#1e2638] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${s.icbg} flex items-center justify-center shrink-0 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{s.label}</p>
              <p className={`text-lg font-bold mt-0.5 ${s.color}`}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center bg-[#121824] border border-[#1e2638] rounded-lg p-1">
          <button onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards view */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg}
              onEdit={() => setEditing(pkg)}
              onDelete={() => setDeleting(pkg)}
              onToggle={() => handleToggle(pkg)}
            />
          ))}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0c101a] border-b border-[#1e2638] text-[10px] text-slate-500 tracking-wider uppercase select-none">
                  <th className="px-5 py-3 font-semibold">Package Name</th>
                  <th className="px-5 py-3 font-semibold">CU Amount</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Discount</th>
                  <th className="px-5 py-3 font-semibold">Badge</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638]">
                {packages.map(pkg => {
                  const eff = effectivePrice(pkg.priceUsd, pkg.discountPercent);
                  return (
                    <tr key={pkg.id} className={`hover:bg-[#161d2d]/40 transition-colors ${pkg.status === 'INACTIVE' ? 'opacity-55' : ''}`}>
                      <td className="px-5 py-3.5 font-semibold text-white">{pkg.name}</td>
                      <td className="px-5 py-3.5 font-mono text-blue-400 font-bold">{pkg.cuAmount.toLocaleString()} CU</td>
                      <td className="px-5 py-3.5 font-mono text-white">
                        {pkg.discountPercent > 0 ? (
                          <span className="flex items-center gap-1.5">
                            <span>${eff.toFixed(2)}</span>
                            <span className="text-slate-500 line-through text-[10px]">${pkg.priceUsd.toFixed(2)}</span>
                          </span>
                        ) : `$${pkg.priceUsd.toFixed(2)}`}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-emerald-400">{pkg.discountPercent > 0 ? `-${pkg.discountPercent}%` : '—'}</td>
                      <td className="px-5 py-3.5">
                        {pkg.badge ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${BADGE_STYLES[pkg.badge] ?? 'bg-slate-700/40 text-slate-400 border-slate-600/30'}`}>
                            {pkg.badge}
                          </span>
                        ) : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button onClick={() => handleToggle(pkg)} className="inline-flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                          {pkg.status === 'ACTIVE' ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono">{pkg.createdDate}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditing(pkg)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleting(pkg)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
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
      )}

      {/* Modals */}
      {addOpen  && <PackageModal initial={null}    onClose={() => setAddOpen(false)} onSave={handleAdd} />}
      {editing  && <PackageModal initial={editing} onClose={() => setEditing(null)} onSave={handleEdit} />}
      {deleting && (
        <DeleteModal
          pkg={deleting}
          paymentCount={0}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
