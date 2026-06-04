import React, { useState } from 'react';
import { CreditCard, Search, Filter } from 'lucide-react';
import { PaymentRecord } from '../types';

interface PaymentsAllViewProps {
  payments: PaymentRecord[];
}

const STATUS_COLORS = {
  SUCCESS: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20',
  PENDING: 'bg-amber-950/40 text-amber-400 border-amber-500/20',
  FAILED:  'bg-rose-950/40 text-rose-400 border-rose-500/20',
};

export default function PaymentsAllView({ payments }: PaymentsAllViewProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');

  const filtered = payments.filter(p => {
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.id.toLowerCase().includes(q) ||
      (p.username || '').toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalRevenue = payments.filter(p => p.status === 'SUCCESS').reduce((a, p) => a + p.amountUsd, 0);
  const totalCu     = payments.filter(p => p.status === 'SUCCESS').reduce((a, p) => a + p.cuCredited, 0);

  return (
    <div className="space-y-6" id="payments-all-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Payments</h2>
        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-[#121824] px-3 py-1.5 rounded-lg border border-[#1e2638] self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {payments.length} total records
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Total Revenue</span>
          <span className="text-2xl font-display font-bold text-white">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className="text-xs text-slate-500 block mt-1">from successful payments</span>
        </div>
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">CU Credited</span>
          <span className="text-2xl font-display font-bold text-blue-400">{totalCu.toLocaleString()} <span className="text-slate-400 text-lg">CU</span></span>
          <span className="text-xs text-slate-500 block mt-1">distributed to users</span>
        </div>
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Transactions</span>
          <div className="flex items-end gap-3 mt-1">
            <div className="text-center">
              <span className="text-xl font-mono font-bold text-emerald-400">{payments.filter(p => p.status === 'SUCCESS').length}</span>
              <span className="text-[10px] text-slate-500 block">success</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-mono font-bold text-amber-400">{payments.filter(p => p.status === 'PENDING').length}</span>
              <span className="text-[10px] text-slate-500 block">pending</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-mono font-bold text-rose-400">{payments.filter(p => p.status === 'FAILED').length}</span>
              <span className="text-[10px] text-slate-500 block">failed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by TX ID, user, or method..."
            className="w-full bg-[#121824] border border-[#1e2638] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {(['ALL', 'SUCCESS', 'PENDING', 'FAILED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-[#121824] border-[#1e2638] text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-500 border-b border-[#1e2638]">
                <th className="py-3 px-5 font-semibold uppercase">TX ID</th>
                <th className="py-3 px-5 font-semibold uppercase">User</th>
                <th className="py-3 px-5 font-semibold uppercase">Date</th>
                <th className="py-3 px-5 font-semibold uppercase">Amount</th>
                <th className="py-3 px-5 font-semibold uppercase">CU Credited</th>
                <th className="py-3 px-5 font-semibold uppercase">Method</th>
                <th className="py-3 px-5 font-semibold uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638] text-sm font-mono">
              {filtered.length > 0 ? filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#161d2d]/35 transition-colors">
                  <td className="py-3.5 px-5 text-slate-500 text-xs">{p.id}</td>
                  <td className="py-3.5 px-5 text-blue-400 text-xs font-semibold">{p.username || '—'}</td>
                  <td className="py-3.5 px-5 text-slate-400 text-xs">{p.timestamp}</td>
                  <td className="py-3.5 px-5 text-slate-200 font-semibold">${p.amountUsd.toFixed(2)}</td>
                  <td className="py-3.5 px-5 text-blue-400 font-bold">+{p.cuCredited.toLocaleString()} CU</td>
                  <td className="py-3.5 px-5 text-slate-400 text-xs">{p.method}</td>
                  <td className="py-3.5 px-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs font-mono">
                    No payment records match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
