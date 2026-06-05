import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Copy, Check, Play, Pause, RefreshCw, ChevronDown } from 'lucide-react';
import { Bot } from '../types';

interface BotDetailViewProps {
  bot: Bot;
  onBackToStrategies: () => void;
  onToggleStatus: () => void;
}

// ── Mock data types ──────────────────────────────────────────────────────────

interface CycleOrder {
  orderId: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'TRAILING';
  qty: number;
  price: number;
  filled: number;
  status: 'FILLED' | 'OPEN' | 'CANCELLED';
  time: string;
}

interface CycleRecord {
  cycleId: string;
  startTime: string;
  endTime: string;
  entryPrice: number;
  avgPrice: number;
  invested: number;
  qty: number;
  pnlPct: number;
  pnlUsdt: number;
  dcaRounds: number;
  status: 'CLOSED' | 'OPEN' | 'SL_HIT';
  orders: CycleOrder[];
}

// ── Mock cycle history ───────────────────────────────────────────────────────

const MOCK_CYCLES: CycleRecord[] = [
  {
    cycleId: 'cy-0046',
    startTime: '2026-06-03 08:12',
    endTime:   '2026-06-03 14:45',
    entryPrice: 48100.00,
    avgPrice:   48294.10,
    invested:   200.00,
    qty:        0.004145,
    pnlPct:     0.42,
    pnlUsdt:    0.84,
    dcaRounds:  2,
    status:     'CLOSED',
    orders: [
      { orderId: 'bo-64e2-r0', side: 'BUY',  type: 'TRAILING', qty: 0.002075, price: 48100.00, filled: 0.002075, status: 'FILLED',    time: '2026-06-03 08:12' },
      { orderId: 'dca-64e2-r1',side: 'BUY',  type: 'LIMIT',    qty: 0.002070, price: 48494.10, filled: 0.002070, status: 'FILLED',    time: '2026-06-03 11:20' },
      { orderId: 'tp-64e2-r0', side: 'SELL', type: 'LIMIT',    qty: 0.004145, price: 48904.20, filled: 0.004145, status: 'FILLED',    time: '2026-06-03 14:45' },
    ],
  },
  {
    cycleId: 'cy-0045',
    startTime: '2026-06-02 19:30',
    endTime:   '2026-06-03 07:55',
    entryPrice: 47820.00,
    avgPrice:   47950.55,
    invested:   300.00,
    qty:        0.006255,
    pnlPct:     1.12,
    pnlUsdt:    3.36,
    dcaRounds:  3,
    status:     'CLOSED',
    orders: [
      { orderId: 'bo-a811-r0',  side: 'BUY',  type: 'TRAILING', qty: 0.002090, price: 47820.00, filled: 0.002090, status: 'FILLED', time: '2026-06-02 19:30' },
      { orderId: 'dca-a811-r1', side: 'BUY',  type: 'LIMIT',    qty: 0.002095, price: 48010.20, filled: 0.002095, status: 'FILLED', time: '2026-06-02 22:14' },
      { orderId: 'dca-a811-r2', side: 'BUY',  type: 'LIMIT',    qty: 0.002070, price: 48021.45, filled: 0.002070, status: 'FILLED', time: '2026-06-03 02:40' },
      { orderId: 'tp-a811-r0',  side: 'SELL', type: 'LIMIT',    qty: 0.006255, price: 48490.00, filled: 0.006255, status: 'FILLED', time: '2026-06-03 07:55' },
    ],
  },
  {
    cycleId: 'cy-0044',
    startTime: '2026-06-02 10:05',
    endTime:   '2026-06-02 19:12',
    entryPrice: 47200.00,
    avgPrice:   47200.00,
    invested:   100.00,
    qty:        0.002118,
    pnlPct:     3.51,
    pnlUsdt:    3.51,
    dcaRounds:  1,
    status:     'CLOSED',
    orders: [
      { orderId: 'bo-c299-r0', side: 'BUY',  type: 'TRAILING', qty: 0.002118, price: 47200.00, filled: 0.002118, status: 'FILLED', time: '2026-06-02 10:05' },
      { orderId: 'tp-c299-r0', side: 'SELL', type: 'LIMIT',    qty: 0.002118, price: 48858.10, filled: 0.002118, status: 'FILLED', time: '2026-06-02 19:12' },
    ],
  },
  {
    cycleId: 'cy-0043',
    startTime: '2026-06-01 14:20',
    endTime:   '2026-06-02 09:50',
    entryPrice: 47900.00,
    avgPrice:   47655.30,
    invested:   200.00,
    qty:        0.004198,
    pnlPct:    -0.28,
    pnlUsdt:   -0.56,
    dcaRounds:  2,
    status:     'SL_HIT',
    orders: [
      { orderId: 'bo-d120-r0',  side: 'BUY',  type: 'TRAILING', qty: 0.002087, price: 47900.00, filled: 0.002087, status: 'FILLED',    time: '2026-06-01 14:20' },
      { orderId: 'dca-d120-r1', side: 'BUY',  type: 'LIMIT',    qty: 0.002111, price: 47410.60, filled: 0.002111, status: 'FILLED',    time: '2026-06-01 20:05' },
      { orderId: 'sl-d120-r0',  side: 'SELL', type: 'MARKET',   qty: 0.004198, price: 47522.00, filled: 0.004198, status: 'FILLED',    time: '2026-06-02 09:50' },
    ],
  },
];

// ── Open orders mock ─────────────────────────────────────────────────────────

const MOCK_OPEN_ORDERS: CycleOrder[] = [
  { orderId: 'dca-64e2f3-r2', side: 'BUY',  type: 'LIMIT',    qty: 0.000145, price: 48291.10, filled: 0,        status: 'OPEN',   time: '2026-06-04 09:12' },
  { orderId: 'tp-64e2f3-r0',  side: 'SELL', type: 'TRAILING', qty: 0.004145, price: 48110.00, filled: 0,        status: 'OPEN',   time: '2026-06-04 09:12' },
];

// ── Strategy config params ───────────────────────────────────────────────────

const STRATEGY_CONFIG = [
  { group: 'Orders',    params: [
    { label: 'Base Order Size',     value: '100.0 USDT',  highlight: false },
    { label: 'Safety Order Size',   value: '100.0 USDT',  highlight: false },
    { label: 'Max Safety Orders',   value: '10',          highlight: false },
    { label: 'Price Deviation',     value: '1.5%',        highlight: false },
    { label: 'SO Step Scale',       value: '1.05×',       highlight: false },
    { label: 'SO Volume Scale',     value: '1.0×',        highlight: false },
  ]},
  { group: 'Entry',     params: [
    { label: 'Entry Type',          value: 'Trailing',    highlight: true  },
    { label: 'Entry Trailing Dev',  value: '0.5%',        highlight: false },
  ]},
  { group: 'Take Profit', params: [
    { label: 'TP %',                value: '3.5%',        highlight: false },
    { label: 'TP Trailing',         value: 'Enabled',     highlight: true  },
    { label: 'TP Trailing Dev',     value: '0.2%',        highlight: false },
  ]},
  { group: 'Stop Loss', params: [
    { label: 'Stop Loss',           value: 'DISABLED',    highlight: false, danger: true },
    { label: 'SL %',                value: '10.0%',       highlight: false, muted: true  },
  ]},
  { group: 'Timing',    params: [
    { label: 'Cooldown',            value: '300 s',       highlight: false },
    { label: 'Min Volume 24h',      value: '5,000 USDT',  highlight: false },
  ]},
];

// ── Temporal log events ──────────────────────────────────────────────────────

interface TemporalLog {
  time: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  runId?: string;
}

const TEMPORAL_LOGS: TemporalLog[] = [
  { time: '2026-06-04 09:14:02', level: 'INFO',  message: 'Workflow heartbeat received — cycle cy-0047 still OPEN.',         runId: '01JXK8...7F9S' },
  { time: '2026-06-04 09:12:10', level: 'INFO',  message: 'WAITING_TP state entered. TP order tp-64e2f3-r0 placed.',          runId: '01JXK8...7F9S' },
  { time: '2026-06-04 09:12:05', level: 'INFO',  message: 'DCA round 2 filled. Safety order dca-64e2f3-r2 executed.',         runId: '01JXK8...7F9S' },
  { time: '2026-06-04 08:55:30', level: 'INFO',  message: 'Trailing entry confirmed. Base order bo-64e2f3-r0 FILLED.',        runId: '01JXK8...7F9S' },
  { time: '2026-06-04 08:50:12', level: 'DEBUG', message: 'Entry trailing deviation threshold reached: -0.52% (target 0.5%).', runId: '01JXK8...7F9S' },
  { time: '2026-06-04 08:45:00', level: 'INFO',  message: 'Cycle cy-0047 started. Monitoring entry conditions.',              runId: '01JXK8...7F9S' },
  { time: '2026-06-03 14:45:11', level: 'INFO',  message: 'Cycle cy-0046 CLOSED. TP hit at $48,904.20. PnL +0.42%.',         runId: '01JXK7...4A2R' },
  { time: '2026-06-03 11:20:44', level: 'INFO',  message: 'DCA round 2 triggered. Price deviation 1.51% exceeded threshold.', runId: '01JXK7...4A2R' },
  { time: '2026-06-03 08:12:05', level: 'INFO',  message: 'Cycle cy-0046 started. Base order placed via TRAILING entry.',    runId: '01JXK7...4A2R' },
  { time: '2026-06-02 09:50:00', level: 'WARN',  message: 'Cycle cy-0043 closed via STOP LOSS at $47,522.00. PnL -0.28%.',   runId: '01JXK5...9C1T' },
  { time: '2026-06-02 09:48:22', level: 'WARN',  message: 'Stop loss threshold triggered: current price below SL level.',    runId: '01JXK5...9C1T' },
  { time: '2026-06-01 20:05:33', level: 'INFO',  message: 'DCA round 2 safety order filled at $47,410.60.',                  runId: '01JXK5...9C1T' },
  { time: '2026-06-01 14:20:01', level: 'INFO',  message: 'Cycle cy-0043 started.',                                          runId: '01JXK5...9C1T' },
  { time: '2026-06-01 09:00:00', level: 'INFO',  message: 'Workflow dca-64e2f3-main-flow started on worker node wk-02.',     runId: '—' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const statusBadge = (s: CycleRecord['status']) => {
  const map = {
    CLOSED: 'bg-slate-800 text-slate-400 border-slate-700',
    OPEN:   'bg-blue-950/40 text-blue-400 border-blue-500/25',
    SL_HIT: 'bg-rose-950/40 text-rose-400 border-rose-500/25',
  };
  return <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${map[s]}`}>{s}</span>;
};

const orderStatusBadge = (s: CycleOrder['status']) => {
  const map = {
    FILLED:    'bg-emerald-950/40 text-emerald-400 border-emerald-500/25',
    OPEN:      'bg-blue-950/40 text-blue-400 border-blue-500/25',
    CANCELLED: 'bg-slate-800 text-slate-400 border-slate-700',
  };
  return <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${map[s]}`}>{s}</span>;
};

const pnlColor = (v: number) => v > 0 ? 'text-emerald-400' : v < 0 ? 'text-rose-400' : 'text-slate-400';
const pnlFmt  = (v: number, suffix = '%') => `${v > 0 ? '+' : ''}${v.toFixed(2)}${suffix}`;

// ── Component ────────────────────────────────────────────────────────────────

export default function BotDetailView({ bot, onBackToStrategies, onToggleStatus }: BotDetailViewProps) {
  const [copiedText, setCopiedText]         = useState<string | null>(null);
  const [dcaRound, setDcaRound]             = useState(2);
  const [isRefreshing, setIsRefreshing]     = useState(false);
  const [expandedCycles, setExpandedCycles] = useState<Set<string>>(new Set());

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleCycle = (id: string) =>
    setExpandedCycles(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const totalInvested = dcaRound * 100;
  const quantity      = (totalInvested / 48240).toFixed(6);

  return (
    <div className="space-y-5" id="bot-detail-view">

      {/* ── Breadcrumbs ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
          <button onClick={onBackToStrategies} className="hover:text-blue-400 cursor-pointer text-slate-400 font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">Strategies</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-blue-400 font-semibold">{bot.ticker} · {bot.userId}</span>
        </div>
        <button
          onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 800); }}
          className="flex items-center gap-1.5 hover:text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-[#1e2638] cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          Force Refresh
        </button>
      </div>

      {/* ── 2-column layout: left = identity + cycle history, right = workflow + config ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* ── LEFT COLUMN (col-span-2) ──────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-5">
        {/* Strategy identity card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex flex-col relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight truncate">{bot.name}</h2>
                <button
                  onClick={onToggleStatus}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded border transition-all cursor-pointer shrink-0 ${
                    bot.status === 'ACTIVE' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {bot.status}
                </button>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded border bg-violet-950/40 text-violet-300 border-violet-500/20 font-mono shrink-0">
                  {bot.botType}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 space-y-1">
                <div>Ticker: <span className="text-slate-200 font-semibold uppercase">{bot.ticker}</span></div>
                <div className="flex items-center gap-1.5">
                  ID: <span className="text-slate-200">64e2f38ab821cd94</span>
                  <button onClick={() => handleCopy('64e2f38ab821cd94', 'bot-id')} className="text-slate-500 hover:text-white cursor-pointer">
                    {copiedText === 'bot-id' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div>Owner: <span className="text-blue-400">{bot.userId}</span></div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-[#1a2133] border border-[#2a354d] px-2.5 py-1 rounded text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-slate-300">{bot.exchange}</span>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-[1.5px] shadow-lg shadow-amber-950/20 flex items-center justify-center font-display font-bold text-slate-900 text-lg select-none">
                ₿
              </div>
            </div>
          </div>

          {/* Current Cycle metrics */}
          <div className="mt-4 pt-4 border-t border-[#1e2638] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">Current Cycle</span>
                <span className="text-[10px] bg-[#1c2333] text-slate-400 px-2 py-0.5 rounded font-mono border border-[#2a354d]">cy-0047</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-blue-950/40 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/25">OPEN</span>
                <span className="bg-amber-950/40 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/25">WAITING_TP</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                {
                  label: 'DCA Progress',
                  node: (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white font-mono">Round {dcaRound} / 10</span>
                      <div className="flex flex-col -space-y-0.5 ml-2">
                        <button onClick={() => setDcaRound(p => Math.min(p+1,10))} className="text-[10px] text-slate-500 hover:text-white cursor-pointer leading-none font-bold">▲</button>
                        <button onClick={() => setDcaRound(p => Math.max(p-1,1))} className="text-[10px] text-slate-500 hover:text-white cursor-pointer leading-none font-bold">▼</button>
                      </div>
                    </div>
                  ),
                },
                { label: 'Entry Price',    value: '$48,100.00' },
                { label: 'Avg Price',      value: '$48,294.10' },
                { label: 'Total Invested', value: `${totalInvested.toFixed(2)} USDT` },
                { label: 'Total Qty',      value: `${quantity} BTC` },
                { label: 'Unrealized P&L', value: '+0.42%', color: 'text-emerald-400' },
              ].map((m, i) => (
                <div key={i} className="bg-[#0c101a] border border-[#1e2638] rounded-lg p-2.5 space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">{m.label}</span>
                  {m.node ?? (
                    <span className={`text-sm font-bold font-mono ${m.color ?? 'text-white'}`}>{m.value}</span>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Cycle History — inside left column */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2638]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-200">Cycle History</h3>
              <span className="bg-[#1c2333] text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-[#2a354d]">{MOCK_CYCLES.length}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Click row to expand orders</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#0c101a] text-[9px] text-slate-500 tracking-wider border-b border-[#1e2638]">
                  <th className="py-2.5 px-4 font-semibold uppercase w-6"></th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">Cycle</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">Start</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">End</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">Entry</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">Avg</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">Invested</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">Qty</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">DCA</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">PnL</th>
                  <th className="py-2.5 px-4 font-semibold uppercase whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638]">
                {MOCK_CYCLES.map(cycle => {
                  const isOpen = expandedCycles.has(cycle.cycleId);
                  return (
                    <React.Fragment key={cycle.cycleId}>
                      <tr className="hover:bg-[#161d2d]/35 transition-colors cursor-pointer select-none" onClick={() => toggleCycle(cycle.cycleId)}>
                        <td className="py-2.5 px-4">
                          <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-300">{cycle.cycleId}</td>
                        <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{cycle.startTime}</td>
                        <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{cycle.endTime}</td>
                        <td className="py-2.5 px-4 text-slate-200">${cycle.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2.5 px-4 text-slate-200">${cycle.avgPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2.5 px-4 text-slate-300">{cycle.invested.toFixed(2)}</td>
                        <td className="py-2.5 px-4 text-slate-300">{cycle.qty.toFixed(6)}</td>
                        <td className="py-2.5 px-4 text-center text-slate-400">{cycle.dcaRounds}</td>
                        <td className="py-2.5 px-4">
                          <div className="flex flex-col leading-tight">
                            <span className={`font-bold ${pnlColor(cycle.pnlPct)}`}>{pnlFmt(cycle.pnlPct)}</span>
                            <span className={`text-[10px] ${pnlColor(cycle.pnlUsdt)}`}>{pnlFmt(cycle.pnlUsdt, ' USDT')}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">{statusBadge(cycle.status)}</td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={11} className="p-0">
                            <div className="bg-[#0a0e18] border-t border-[#1e2638]/60 px-8 py-3">
                              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-2 flex items-center gap-2">
                                <span>Orders in {cycle.cycleId}</span>
                                <div className="flex-1 h-px bg-[#1e2638]" />
                                <span>{cycle.orders.length} orders</span>
                              </div>
                              <table className="w-full text-left border-collapse text-[11px] font-mono">
                                <thead>
                                  <tr className="text-[9px] text-slate-600 tracking-wider">
                                    <th className="py-1.5 pr-5 font-semibold uppercase">Order ID</th>
                                    <th className="py-1.5 pr-5 font-semibold uppercase">Side</th>
                                    <th className="py-1.5 pr-5 font-semibold uppercase">Type</th>
                                    <th className="py-1.5 pr-5 font-semibold uppercase">Qty</th>
                                    <th className="py-1.5 pr-5 font-semibold uppercase">Price</th>
                                    <th className="py-1.5 pr-5 font-semibold uppercase">Filled</th>
                                    <th className="py-1.5 pr-5 font-semibold uppercase">Time</th>
                                    <th className="py-1.5 font-semibold uppercase">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e2638]/40">
                                  {cycle.orders.map(o => (
                                    <tr key={o.orderId} className="hover:bg-white/[0.02] transition-colors">
                                      <td className="py-1.5 pr-5 text-slate-500">{o.orderId}</td>
                                      <td className="py-1.5 pr-5"><span className={`font-bold uppercase ${o.side === 'BUY' ? 'text-teal-400' : 'text-rose-400'}`}>{o.side}</span></td>
                                      <td className="py-1.5 pr-5 text-slate-500 uppercase">{o.type}</td>
                                      <td className="py-1.5 pr-5 text-slate-300">{o.qty.toFixed(6)}</td>
                                      <td className="py-1.5 pr-5 text-slate-300">${o.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                      <td className="py-1.5 pr-5 text-slate-400">{o.filled.toFixed(6)}</td>
                                      <td className="py-1.5 pr-5 text-slate-600">{o.time}</td>
                                      <td className="py-1.5">{orderStatusBadge(o.status)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Temporal Log Events */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2638]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-200">Temporal Log Events</h3>
              <span className="bg-[#1c2333] text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-[#2a354d]">
                {TEMPORAL_LOGS.length}
              </span>
            </div>
            <span className="bg-emerald-950/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/25 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="divide-y divide-[#1e2638] max-h-72 overflow-y-auto">
            {TEMPORAL_LOGS.map((log, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-2.5 hover:bg-[#161d2d]/25 transition-colors">
                <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                  log.level === 'ERROR' ? 'bg-rose-500' :
                  log.level === 'WARN'  ? 'bg-amber-400' :
                  log.level === 'INFO'  ? 'bg-blue-400'  : 'bg-slate-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-[10px] font-mono font-bold shrink-0 ${
                      log.level === 'ERROR' ? 'text-rose-400' :
                      log.level === 'WARN'  ? 'text-amber-400' :
                      log.level === 'INFO'  ? 'text-blue-400'  : 'text-slate-500'
                    }`}>{log.level}</span>
                    <span className="text-[10px] font-mono text-slate-600 shrink-0">{log.time}</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 mt-0.5 leading-snug">{log.message}</p>
                  {log.runId && (
                    <span className="text-[9px] font-mono text-slate-600">run: {log.runId}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>{/* end left column */}

        {/* ── RIGHT COLUMN ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Temporal Workflow */}
          <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between border-b border-[#1e2638]/60 pb-2.5 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Temporal Workflow</span>
              <span className="bg-emerald-950/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/25 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                RUNNING
              </span>
            </div>
            <div className="space-y-2.5 text-xs font-mono text-slate-400">
              {[
                { label: 'WORKFLOW ID',  value: 'dca-64e2f3-main-flow' },
                { label: 'LAST RUN ID',  value: '01JXK8...7F9S' },
                { label: 'HEARTBEAT',    value: '2s ago',               color: 'text-emerald-400' },
                { label: 'STARTED AT',   value: '2026-06-01 09:00' },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span>{r.label}</span>
                  <span className={`font-semibold ${r.color ?? 'text-slate-200'} select-all text-right`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy Configuration — compact 2-col grid */}
          <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex flex-col gap-3">
            <div className="border-b border-[#1e2638]/60 pb-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Strategy Configuration</h3>
            </div>
            <div className="space-y-4">
              {STRATEGY_CONFIG.map(group => (
                <div key={group.group}>
                  <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <span>{group.group}</span>
                    <div className="flex-1 h-px bg-[#1e2638]" />
                  </div>
                  <div className="space-y-1.5">
                    {group.params.map(p => (
                      <div key={p.label} className="flex items-center justify-between gap-3 text-[11px] font-mono">
                        <span className="text-slate-500 shrink-0">{p.label}</span>
                        <span className={
                          (p as any).danger  ? 'text-rose-400 font-bold'     :
                          (p as any).muted   ? 'text-slate-600'              :
                          p.highlight        ? 'text-blue-400 font-semibold' :
                          'text-slate-200 text-right'
                        }>
                          {p.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
