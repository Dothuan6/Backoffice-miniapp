import React, { useState, useMemo } from 'react';
import { Search, Download, CreditCard, CheckCircle, Clock, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { PaymentRecord, CuPackage } from '../../types';

interface Props {
  payments: PaymentRecord[];
  packages: CuPackage[];
}

type SortKey = 'timestamp' | 'amountUsd' | 'cuCredited';
type SortDir = 'asc' | 'desc';

const STATUS_STYLES = {
  SUCCESS: { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle className="w-3 h-3" /> },
  PENDING: { cls: 'bg-amber-500/10  text-amber-400  border-amber-500/20',  icon: <Clock className="w-3 h-3" /> },
  FAILED:  { cls: 'bg-red-500/10    text-red-400    border-red-500/20',    icon: <XCircle className="w-3 h-3" /> },
};

const METHOD_SHORT: Record<string, string> = {
  'Stripe Credit Card':      'Stripe',
  'Crypto Pay (USDT_TRC20)': 'USDT TRC20',
  'GatePay Crypto':          'GatePay',
};

export default function SubscriptionPaymentsView({ payments, packages }: Props) {
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [packageFilter, setPackageFilter] = useState<string>('ALL');
  const [sortKey,       setSortKey]       = useState<SortKey>('timestamp');
  const [sortDir,       setSortDir]       = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-30" />;

  const filtered = useMemo(() => {
    let list = payments.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        p.id.toLowerCase().includes(q) ||
        (p.username ?? '').toLowerCase().includes(q) ||
        (p.packageName ?? '').toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q);
      const matchStatus  = statusFilter  === 'ALL' || p.status === statusFilter;
      const matchPackage = packageFilter === 'ALL' || p.packageId === packageFilter;
      return matchSearch && matchStatus && matchPackage;
    });

    list = [...list].sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === 'timestamp') {
        va = new Date(a.timestamp).getTime();
        vb = new Date(b.timestamp).getTime();
      } else {
        va = a[sortKey]; vb = b[sortKey];
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });

    return list;
  }, [payments, search, statusFilter, packageFilter, sortKey, sortDir]);

  const stats = useMemo(() => ({
    total:    payments.length,
    success:  payments.filter(p => p.status === 'SUCCESS').length,
    pending:  payments.filter(p => p.status === 'PENDING').length,
    failed:   payments.filter(p => p.status === 'FAILED').length,
    revenue:  payments.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + p.amountUsd, 0),
  }), [payments]);

  const activePackages = useMemo(() =>
    packages.filter(p => p.status === 'ACTIVE'), [packages]);

  return (
    <div className="space-y-6" id="subscription-payments-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Payments</h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">{stats.total} transactions · ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} total revenue</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#121824] hover:bg-[#1a2236] text-slate-300 text-xs font-semibold rounded-lg border border-[#1e2638] transition-colors cursor-pointer self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',  val: `$${stats.revenue.toFixed(2)}`, color: 'text-blue-400',    icon: <CreditCard className="w-4 h-4" /> },
          { label: 'Success',        val: stats.success,                  color: 'text-emerald-400', icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'Pending',        val: stats.pending,                  color: 'text-amber-400',   icon: <Clock className="w-4 h-4" /> },
          { label: 'Failed',         val: stats.failed,                   color: 'text-red-400',     icon: <XCircle className="w-4 h-4" /> },
        ].map(s => (
          <div key={s.label} className="bg-[#121824] border border-[#1e2638] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className={`${s.color} opacity-70`}>{s.icon}</div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{s.label}</p>
              <p className={`text-lg font-bold font-mono mt-0.5 ${s.color}`}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by username, TX ID, or package..."
            className="w-full bg-[#121824] border border-[#1e2638] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono" />
        </div>
        {/* Status filter */}
        <div className="flex items-center gap-1 bg-[#121824] border border-[#1e2638] rounded-lg p-1 shrink-0">
          {(['ALL', 'SUCCESS', 'PENDING', 'FAILED'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}>{s === 'ALL' ? 'All' : s}</button>
          ))}
        </div>
        {/* Package filter */}
        <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)}
          className="bg-[#121824] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer shrink-0">
          <option value="ALL">All Packages</option>
          {activePackages.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0c101a] border-b border-[#1e2638] text-[10px] text-slate-500 tracking-wider uppercase select-none">
                <th className="px-5 py-3 font-semibold">TX ID</th>
                <th className="px-5 py-3 font-semibold">Username</th>
                <th className="px-5 py-3 font-semibold">Package</th>
                <th className="px-5 py-3 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('amountUsd')}>
                  <span className="flex items-center gap-1">Amount <SortIcon k="amountUsd" /></span>
                </th>
                <th className="px-5 py-3 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('cuCredited')}>
                  <span className="flex items-center gap-1">CU Credited <SortIcon k="cuCredited" /></span>
                </th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Method</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('timestamp')}>
                  <span className="flex items-center gap-1">Date <SortIcon k="timestamp" /></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-500 text-xs font-mono">No payments found.</td></tr>
              ) : filtered.map(p => {
                const s = STATUS_STYLES[p.status];
                return (
                  <tr key={p.id} className="hover:bg-[#161d2d]/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">{p.id}</td>
                    <td className="px-5 py-3.5 font-mono text-blue-400 font-semibold">{p.username ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      {p.packageName
                        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">{p.packageName}</span>
                        : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">${p.amountUsd.toFixed(2)}</td>
                    <td className="px-5 py-3.5 font-mono text-blue-400 font-semibold">+{p.cuCredited.toLocaleString()}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-slate-400">{METHOD_SHORT[p.method] ?? p.method}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.cls}`}>
                        {s.icon}{p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{p.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#1e2638] flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-mono">Showing {filtered.length} of {payments.length} records</p>
          {filtered.length > 0 && (
            <p className="text-[11px] text-slate-500 font-mono">
              Total (filtered): <span className="text-white font-semibold">
                ${filtered.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + p.amountUsd, 0).toFixed(2)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
