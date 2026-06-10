import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FlaskConical, Plus, Eye, RotateCw, Trash2, X, Search,
  CheckCircle2, Loader2, AlertCircle, Ban, Clock,
  ChevronUp, ChevronDown,
} from 'lucide-react';
import { BacktestJob, BacktestResult, BacktestStatus, BacktestTimeframe, BacktestStrategyType } from '../../types';
import { generateResult } from './data';

// ── Constants ──────────────────────────────────────────────────────────────
const STRATEGY_OPTIONS: { id: string; name: string; type: BacktestStrategyType }[] = [
  { id: 'STR-1', name: 'DCA Pro v2',          type: 'DCA'      },
  { id: 'STR-2', name: 'Grid Master ETH',      type: 'GRID'     },
  { id: 'STR-3', name: 'Trailing Scalper BNB', type: 'TRAILING' },
  { id: 'STR-4', name: 'DCA SOL Aggressive',   type: 'DCA'      },
  { id: 'STR-5', name: 'Grid BTC Long-term',   type: 'GRID'     },
];

const SYMBOLS    = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT'] as const;
const EXCHANGES  = ['Binance', 'OKX', 'Bybit'] as const;
const TIMEFRAMES: BacktestTimeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

const STATUS_CFG: Record<BacktestStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  QUEUED:    { label: 'Queued',    cls: 'bg-slate-500/10  text-slate-400  border-slate-500/20',   icon: <Clock       className="w-3 h-3" /> },
  RUNNING:   { label: 'Running',   cls: 'bg-blue-500/10   text-blue-400   border-blue-500/20',    icon: <Loader2     className="w-3 h-3 animate-spin" /> },
  SUCCESS:   { label: 'Success',   cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  FAILED:    { label: 'Failed',    cls: 'bg-red-500/10    text-red-400    border-red-500/20',     icon: <AlertCircle  className="w-3 h-3" /> },
  CANCELLED: { label: 'Cancelled', cls: 'bg-amber-500/10  text-amber-400  border-amber-500/20',   icon: <Ban          className="w-3 h-3" /> },
};

const TYPE_CLS: Record<BacktestStrategyType, string> = {
  DCA:      'bg-blue-500/10   text-blue-400   border border-blue-500/20',
  GRID:     'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  TRAILING: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
};

// ── New Backtest Modal ──────────────────────────────────────────────────────
interface NewModalProps {
  onClose: () => void;
  onSubmit: (job: Omit<BacktestJob, 'id' | 'createdAt' | 'status'>) => void;
  prefill?: BacktestJob;
}

function NewBacktestModal({ onClose, onSubmit, prefill }: NewModalProps) {
  const [stratIdx,   setStratIdx]   = useState(prefill ? STRATEGY_OPTIONS.findIndex(s => s.id === prefill.strategyId) : 0);
  const [symbol,     setSymbol]     = useState<string>(prefill?.symbol     ?? 'BTC/USDT');
  const [exchange,   setExchange]   = useState<string>(prefill?.exchange   ?? 'Binance');
  const [timeframe,  setTimeframe]  = useState<BacktestTimeframe>(prefill?.timeframe ?? '1h');
  const [startDate,  setStartDate]  = useState(prefill?.startDate ?? '2024-01-01');
  const [endDate,    setEndDate]    = useState(prefill?.endDate   ?? '2024-06-30');
  const [capital,    setCapital]    = useState(String(prefill?.initialCapital ?? 1000));
  const [error,      setError]      = useState('');

  const strat = STRATEGY_OPTIONS[stratIdx]!;

  const handleSubmit = () => {
    if (!startDate || !endDate) { setError('Please fill in all date fields.'); return; }
    if (new Date(startDate) >= new Date(endDate)) { setError('Start date must be before end date.'); return; }
    const capNum = parseFloat(capital);
    if (isNaN(capNum) || capNum < 10) { setError('Initial capital must be at least $10.'); return; }
    const diffDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    if (diffDays > 730) { setError('Date range cannot exceed 2 years.'); return; }
    onSubmit({
      strategyId:     strat.id,
      strategyName:   strat.name,
      strategyType:   strat.type,
      symbol, exchange, timeframe,
      startDate, endDate,
      initialCapital: capNum,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#1e2638] rounded-2xl w-full max-w-lg shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2638]">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">{prefill ? 'Re-run Backtest' : 'New Backtest'}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Strategy */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Strategy</label>
            <select value={stratIdx} onChange={e => setStratIdx(Number(e.target.value))}
              className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer">
              {STRATEGY_OPTIONS.map((s, i) => (
                <option key={s.id} value={i}>{s.name} ({s.type})</option>
              ))}
            </select>
          </div>

          {/* Symbol + Exchange */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Symbol</label>
              <select value={symbol} onChange={e => setSymbol(e.target.value)}
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                {SYMBOLS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Exchange</label>
              <select value={exchange} onChange={e => setExchange(e.target.value)}
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                {EXCHANGES.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Timeframe</label>
            <div className="flex gap-1.5">
              {TIMEFRAMES.map(tf => (
                <button key={tf} onClick={() => setTimeframe(tf)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-[#0d121f] text-slate-400 border-[#1e2638] hover:border-blue-500 hover:text-white'
                  }`}>{tf}</button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} max={new Date().toISOString().slice(0, 10)}
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer" />
            </div>
          </div>

          {/* Capital */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Initial Capital (USDT)</label>
            <input type="number" value={capital} onChange={e => setCapital(e.target.value)} min={10}
              className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>

          {error && <p className="text-xs text-red-400 font-mono bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#1e2638]">
          <button onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:text-white border border-[#1e2638] rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2">
            <FlaskConical className="w-3.5 h-3.5" />
            {prefill ? 'Re-run' : 'Run Backtest'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main View ──────────────────────────────────────────────────────────────
interface Props {
  jobs:       BacktestJob[];
  results:    Record<string, BacktestResult>;
  setJobs:    React.Dispatch<React.SetStateAction<BacktestJob[]>>;
  setResults: React.Dispatch<React.SetStateAction<Record<string, BacktestResult>>>;
  onViewDetail: (jobId: string) => void;
}

type SortKey = 'createdAt' | 'initialCapital' | 'pnl';

export default function BacktestJobsView({ jobs, results, setJobs, setResults, onViewDetail }: Props) {
  const [showNewModal, setShowNewModal]   = useState(false);
  const [rerunJob,     setRerunJob]       = useState<BacktestJob | null>(null);
  const [confirming,   setConfirming]     = useState<{ job: BacktestJob; action: 'delete' | 'cancel' } | null>(null);
  const [search,       setSearch]         = useState('');
  const [statusFilter, setStatusFilter]   = useState<'ALL' | BacktestStatus>('ALL');
  const [sortKey,      setSortKey]        = useState<SortKey>('createdAt');
  const [sortDir,      setSortDir]        = useState<'asc' | 'desc'>('desc');
  const [toast,        setToast]          = useState<string | null>(null);

  // ── Progression simulation ────────────────────────────────────────────────
  const jobsRef = useRef(jobs);
  useEffect(() => { jobsRef.current = jobs; }, [jobs]);

  useEffect(() => {
    const id = setInterval(() => {
      const cur = jobsRef.current;
      if (!cur.some(j => j.status === 'RUNNING' || j.status === 'QUEUED')) return;

      const newResults: BacktestResult[] = [];
      const updated = cur.map(job => {
        if (job.status === 'QUEUED') {
          return { ...job, status: 'RUNNING' as const, progress: 0 };
        }
        if (job.status === 'RUNNING') {
          const p = (job.progress ?? 0) + Math.floor(4 + Math.random() * 8);
          if (p >= 100) {
            newResults.push(generateResult(job));
            return { ...job, status: 'SUCCESS' as const, progress: 100, completedAt: new Date().toISOString().slice(0, 10), resultId: job.id };
          }
          return { ...job, progress: p };
        }
        return job;
      });

      setJobs(updated);
      if (newResults.length) {
        setResults(prev => ({ ...prev, ...Object.fromEntries(newResults.map(r => [r.jobId, r])) }));
        showToast(`Backtest completed: ${newResults.map(r => r.jobId).join(', ')}`);
      }
    }, 900);
    return () => clearInterval(id);
  }, [setJobs, setResults]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ── Add new job ───────────────────────────────────────────────────────────
  const handleAddJob = (partial: Omit<BacktestJob, 'id' | 'createdAt' | 'status'>) => {
    const newId = `BT-${String(Date.now()).slice(-4)}`;
    const job: BacktestJob = {
      ...partial,
      id:        newId,
      status:    'QUEUED',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setJobs(prev => [job, ...prev]);
    showToast(`Job ${newId} queued.`);
  };

  // ── Filtered + sorted list ────────────────────────────────────────────────
  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-30" />;

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let list = jobs.filter(j => {
      const q = search.toLowerCase();
      const match = !q || j.id.toLowerCase().includes(q) || j.strategyName.toLowerCase().includes(q) || j.symbol.toLowerCase().includes(q);
      const st = statusFilter === 'ALL' || j.status === statusFilter;
      return match && st;
    });
    list = [...list].sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === 'pnl') {
        va = results[a.id]?.totalPnlPct ?? -Infinity;
        vb = results[b.id]?.totalPnlPct ?? -Infinity;
      } else if (sortKey === 'initialCapital') {
        va = a.initialCapital; vb = b.initialCapital;
      } else {
        va = new Date(a.createdAt).getTime();
        vb = new Date(b.createdAt).getTime();
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return list;
  }, [jobs, results, search, statusFilter, sortKey, sortDir]);

  const stats = useMemo(() => ({
    total:     jobs.length,
    running:   jobs.filter(j => j.status === 'RUNNING').length,
    queued:    jobs.filter(j => j.status === 'QUEUED').length,
    success:   jobs.filter(j => j.status === 'SUCCESS').length,
    failed:    jobs.filter(j => j.status === 'FAILED').length,
  }), [jobs]);

  return (
    <div className="space-y-6" id="backtest-jobs-view">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#111f1a] border border-emerald-500/20 rounded-xl px-4 py-3 text-xs text-emerald-300 font-mono shadow-2xl flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />{toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Backtest</h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">{stats.total} jobs · {stats.running + stats.queued} active</p>
        </div>
        <button onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" /> New Backtest
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total',   val: stats.total,   color: 'text-white'        },
          { label: 'Queued',  val: stats.queued,  color: 'text-slate-400'    },
          { label: 'Running', val: stats.running, color: 'text-blue-400'     },
          { label: 'Success', val: stats.success, color: 'text-emerald-400'  },
          { label: 'Failed',  val: stats.failed,  color: 'text-red-400'      },
        ].map(s => (
          <div key={s.label} className="bg-[#121824] border border-[#1e2638] rounded-xl px-4 py-3">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold font-mono mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by job ID, strategy, or symbol…"
            className="w-full bg-[#121824] border border-[#1e2638] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono" />
        </div>
        <div className="flex items-center gap-1 bg-[#121824] border border-[#1e2638] rounded-lg p-1 shrink-0 flex-wrap">
          {(['ALL', 'QUEUED', 'RUNNING', 'SUCCESS', 'FAILED', 'CANCELLED'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}>{s === 'ALL' ? 'All' : s[0] + s.slice(1).toLowerCase()}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0c101a] border-b border-[#1e2638] text-[10px] text-slate-500 tracking-wider uppercase select-none">
                <th className="px-5 py-3 font-semibold">Job ID</th>
                <th className="px-5 py-3 font-semibold">Strategy</th>
                <th className="px-5 py-3 font-semibold">Symbol</th>
                <th className="px-5 py-3 font-semibold">TF</th>
                <th className="px-5 py-3 font-semibold hidden lg:table-cell">Date Range</th>
                <th className="px-5 py-3 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('initialCapital')}>
                  <span className="flex items-center gap-1">Capital <SortIcon k="initialCapital" /></span>
                </th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('pnl')}>
                  <span className="flex items-center gap-1">PnL <SortIcon k="pnl" /></span>
                </th>
                <th className="px-5 py-3 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('createdAt')}>
                  <span className="flex items-center gap-1">Created <SortIcon k="createdAt" /></span>
                </th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="py-16 text-center">
                  <FlaskConical className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs font-mono">No backtest jobs found.</p>
                </td></tr>
              ) : filtered.map(job => {
                const sc  = STATUS_CFG[job.status];
                const res = results[job.id];
                const pnlColor = res
                  ? (res.totalPnlPct >= 0 ? 'text-emerald-400' : 'text-red-400')
                  : 'text-slate-600';

                return (
                  <tr key={job.id} className="hover:bg-[#161d2d]/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-blue-400 font-semibold text-[11px]">{job.id}</td>

                    <td className="px-5 py-3.5">
                      <div className="text-slate-200 font-medium text-[11px] leading-tight">{job.strategyName}</div>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold mt-0.5 ${TYPE_CLS[job.strategyType]}`}>
                        {job.strategyType}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-300 text-[11px]">{job.symbol}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono font-semibold">{job.timeframe}</span>
                    </td>

                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <p className="text-[11px] text-slate-400 font-mono">{job.startDate}</p>
                      <p className="text-[10px] text-slate-600 font-mono">→ {job.endDate}</p>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-300 text-[11px]">
                      ${job.initialCapital.toLocaleString()}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="space-y-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.cls}`}>
                          {sc.icon}{sc.label}
                        </span>
                        {job.status === 'RUNNING' && (
                          <div className="w-20">
                            <div className="w-full bg-slate-800 rounded-full h-1">
                              <div className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                                style={{ width: `${job.progress ?? 0}%` }} />
                            </div>
                            <p className="text-[9px] text-slate-500 font-mono mt-0.5">{job.progress ?? 0}%</p>
                          </div>
                        )}
                        {job.status === 'FAILED' && job.errorMessage && (
                          <p className="text-[10px] text-red-400/70 font-mono max-w-[160px] truncate" title={job.errorMessage}>
                            {job.errorMessage}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className={`px-5 py-3.5 font-mono font-bold text-[11px] ${pnlColor}`}>
                      {res ? `${res.totalPnlPct >= 0 ? '+' : ''}${res.totalPnlPct}%` : '—'}
                    </td>

                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{job.createdAt}</td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {job.status === 'SUCCESS' && (
                          <>
                            <button onClick={() => onViewDetail(job.id)}
                              title="View result"
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setRerunJob(job)}
                              title="Re-run"
                              className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all cursor-pointer">
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirming({ job, action: 'delete' })}
                              title="Delete"
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {(job.status === 'RUNNING' || job.status === 'QUEUED') && (
                          <button onClick={() => setConfirming({ job, action: 'cancel' })}
                            title="Cancel"
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all cursor-pointer">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(job.status === 'FAILED' || job.status === 'CANCELLED') && (
                          <>
                            <button onClick={() => setRerunJob(job)}
                              title="Re-run"
                              className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all cursor-pointer">
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirming({ job, action: 'delete' })}
                              title="Delete"
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#1e2638]">
          <p className="text-[11px] text-slate-500 font-mono">Showing {filtered.length} of {jobs.length} jobs</p>
        </div>
      </div>

      {/* Modals */}
      {showNewModal && (
        <NewBacktestModal onClose={() => setShowNewModal(false)} onSubmit={handleAddJob} />
      )}
      {rerunJob && (
        <NewBacktestModal
          onClose={() => setRerunJob(null)}
          onSubmit={handleAddJob}
          prefill={rerunJob}
        />
      )}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1e2638] rounded-2xl w-full max-w-sm shadow-2xl mx-4 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${confirming.action === 'delete' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                {confirming.action === 'delete'
                  ? <Trash2 className="w-4 h-4 text-red-400" />
                  : <Ban className="w-4 h-4 text-amber-400" />
                }
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {confirming.action === 'delete' ? 'Delete Job' : 'Cancel Job'}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">{confirming.job.id} · {confirming.job.strategyName}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {confirming.action === 'delete'
                ? 'This will permanently remove the job and its result data.'
                : 'This will stop the running job. You can re-run it later.'}
            </p>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setConfirming(null)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:text-white border border-[#1e2638] rounded-lg transition-colors cursor-pointer">
                Keep it
              </button>
              <button onClick={() => {
                if (confirming.action === 'delete') {
                  setJobs(prev => prev.filter(j => j.id !== confirming.job.id));
                  setResults(prev => { const n = { ...prev }; delete n[confirming.job.id]; return n; });
                  showToast(`${confirming.job.id} deleted.`);
                } else {
                  setJobs(prev => prev.map(j => j.id === confirming.job.id ? { ...j, status: 'CANCELLED' } : j));
                  showToast(`${confirming.job.id} cancelled.`);
                }
                setConfirming(null);
              }}
                className={`flex-1 py-2.5 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer ${
                  confirming.action === 'delete' ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-600 hover:bg-amber-500'
                }`}>
                {confirming.action === 'delete' ? 'Delete' : 'Cancel Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
