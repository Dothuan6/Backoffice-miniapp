import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, TrendingUp, TrendingDown, BarChart2,
  ShieldAlert, Percent, ListOrdered, Award, ChevronUp, ChevronDown,
} from 'lucide-react';
import { BacktestJob, BacktestResult, BacktestStrategyType } from '../../types';

interface Props {
  job:    BacktestJob;
  result: BacktestResult;
  onBack: () => void;
}

const TYPE_CLS: Record<BacktestStrategyType, string> = {
  DCA:      'bg-blue-500/10   text-blue-400   border border-blue-500/20',
  GRID:     'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  TRAILING: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
};

// ── Equity Curve SVG ───────────────────────────────────────────────────────
function EquityCurve({ result, initialCapital }: { result: BacktestResult; initialCapital: number }) {
  const curve = result.equityCurve;
  if (curve.length < 2) return null;

  const W = 860, H = 200;
  const padL = 68, padR = 20, padT = 15, padB = 32;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const equities = curve.map(p => p.equity);
  const rawMin   = Math.min(...equities);
  const rawMax   = Math.max(...equities);
  const padding  = (rawMax - rawMin) * 0.1 || 10;
  const minEq    = rawMin - padding;
  const maxEq    = rawMax + padding;
  const eqRange  = maxEq - minEq;

  const toX = (i: number) => padL + (i / (curve.length - 1)) * cW;
  const toY = (eq: number) => padT + (1 - (eq - minEq) / eqRange) * cH;

  const linePoints = curve.map((p, i) => `${toX(i).toFixed(1)},${toY(p.equity).toFixed(1)}`).join(' ');
  const areaPath = [
    `M${toX(0).toFixed(1)},${(padT + cH).toFixed(1)}`,
    ...curve.map((p, i) => `L${toX(i).toFixed(1)},${toY(p.equity).toFixed(1)}`),
    `L${toX(curve.length - 1).toFixed(1)},${(padT + cH).toFixed(1)}`,
    'Z',
  ].join(' ');

  const isProfit   = result.totalPnlPct >= 0;
  const lineColor  = isProfit ? '#3b82f6' : '#ef4444';
  const gradColor  = isProfit ? '#3b82f6' : '#ef4444';
  const gradId     = `eq-${result.jobId}`;
  const clipId     = `clip-${result.jobId}`;

  // Y-axis labels (5)
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const v = minEq + (i / 4) * eqRange;
    return { v, y: toY(v) };
  });

  // X-axis labels (5)
  const xLabels = Array.from({ length: 5 }, (_, i) => {
    const idx = Math.floor((i / 4) * (curve.length - 1));
    return { date: curve[idx]?.date?.slice(5) ?? '', x: toX(idx) };
  });

  // Capital reference line
  const capY   = toY(initialCapital);
  const capInRange = initialCapital > minEq && initialCapital < maxEq;

  // Grid lines at Y-label positions
  const gridYs = yLabels.map(l => l.y);

  return (
    <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-4">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 font-mono">Equity Curve</p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={gradColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={gradColor} stopOpacity="0.01" />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x={padL} y={padT} width={cW} height={cH} />
          </clipPath>
        </defs>

        {/* Horizontal grid */}
        {gridYs.map((y, i) => (
          <line key={i} x1={padL} y1={y} x2={padL + cW} y2={y}
            stroke="#1e2638" strokeWidth="1" />
        ))}

        {/* Capital reference line */}
        {capInRange && (
          <line x1={padL} y1={capY} x2={padL + cW} y2={capY}
            stroke="#475569" strokeWidth="1" strokeDasharray="5 4" />
        )}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} clipPath={`url(#${clipId})`} />

        {/* Line */}
        <polyline points={linePoints} fill="none" stroke={lineColor}
          strokeWidth="1.8" strokeLinejoin="round" clipPath={`url(#${clipId})`} />

        {/* Y-axis labels */}
        {yLabels.map((l, i) => (
          <text key={i} x={padL - 6} y={l.y + 4} textAnchor="end"
            fill="#64748b" fontSize="9" fontFamily="monospace">
            ${l.v.toFixed(0)}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={H - 6} textAnchor="middle"
            fill="#64748b" fontSize="9" fontFamily="monospace">
            {l.date}
          </text>
        ))}

        {/* Axis border */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#1e2638" strokeWidth="1" />
        <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#1e2638" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ── Trade List ─────────────────────────────────────────────────────────────
type TradeSortKey = 'entryTime' | 'pnlUsd' | 'pnlPct';

function TradeList({ result }: { result: BacktestResult }) {
  const [sortKey, setSortKey] = useState<TradeSortKey>('entryTime');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search,  setSearch]  = useState('');

  const handleSort = (k: TradeSortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir(k === 'entryTime' ? 'asc' : 'desc'); }
  };

  const SortIcon = ({ k }: { k: TradeSortKey }) =>
    sortKey === k
      ? sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-30" />;

  const sorted = useMemo(() => {
    let list = result.trades.filter(t =>
      !search || t.reason.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
    );
    return [...list].sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === 'entryTime') {
        va = new Date(a.entryTime).getTime();
        vb = new Date(b.entryTime).getTime();
      } else {
        va = a[sortKey]; vb = b[sortKey];
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [result.trades, sortKey, sortDir, search]);

  return (
    <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#1e2638] flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
          Trade List · {result.totalTrades} trades
        </p>
        <div className="relative w-52">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Filter by reason or ID…"
            className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg pl-3 pr-3 py-1.5 text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono" />
        </div>
      </div>
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0">
            <tr className="bg-[#0c101a] border-b border-[#1e2638] text-[10px] text-slate-500 tracking-wider uppercase select-none">
              <th className="px-4 py-2.5 font-semibold">#</th>
              <th className="px-4 py-2.5 font-semibold">Side</th>
              <th className="px-4 py-2.5 font-semibold">Entry Price</th>
              <th className="px-4 py-2.5 font-semibold">Exit Price</th>
              <th className="px-4 py-2.5 font-semibold">Qty</th>
              <th className="px-4 py-2.5 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('pnlUsd')}>
                <span className="flex items-center gap-1">PnL (USD) <SortIcon k="pnlUsd" /></span>
              </th>
              <th className="px-4 py-2.5 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('pnlPct')}>
                <span className="flex items-center gap-1">PnL % <SortIcon k="pnlPct" /></span>
              </th>
              <th className="px-4 py-2.5 font-semibold hidden md:table-cell">Duration</th>
              <th className="px-4 py-2.5 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('entryTime')}>
                <span className="flex items-center gap-1">Entry <SortIcon k="entryTime" /></span>
              </th>
              <th className="px-4 py-2.5 font-semibold hidden lg:table-cell">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2638]">
            {sorted.map((t, idx) => {
              const isWin = t.pnlUsd > 0;
              return (
                <tr key={t.id} className="hover:bg-[#161d2d]/40 transition-colors">
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px]">{idx + 1}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      t.side === 'BUY'
                        ? 'bg-blue-500/10   text-blue-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}>{t.side}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-300 text-[11px]">{t.entryPrice.toLocaleString()}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300 text-[11px]">{t.exitPrice.toLocaleString()}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px]">{t.qty}</td>
                  <td className={`px-4 py-2.5 font-mono font-bold text-[11px] ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isWin ? '+' : ''}{t.pnlUsd.toFixed(2)}
                  </td>
                  <td className={`px-4 py-2.5 font-mono text-[11px] ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isWin ? '+' : ''}{t.pnlPct.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px] hidden md:table-cell">{t.duration}</td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">{t.entryTime}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px] hidden lg:table-cell">{t.reason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-2.5 border-t border-[#1e2638]">
        <p className="text-[11px] text-slate-500 font-mono">Showing {sorted.length} of {result.totalTrades} trades</p>
      </div>
    </div>
  );
}

// ── Main View ──────────────────────────────────────────────────────────────
export default function BacktestDetailView({ job, result, onBack }: Props) {
  const isProfit = result.totalPnlPct >= 0;
  const pnlColor = isProfit ? 'text-emerald-400' : 'text-red-400';

  const metrics = [
    {
      label: 'Total PnL',
      val:   `${isProfit ? '+' : ''}$${result.totalPnlUsd.toFixed(2)}`,
      sub:   `${isProfit ? '+' : ''}${result.totalPnlPct}%`,
      color: pnlColor,
      icon:  isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
    },
    {
      label: 'Sharpe Ratio',
      val:   result.sharpeRatio.toFixed(2),
      sub:   result.sharpeRatio >= 1.5 ? 'Strong' : result.sharpeRatio >= 0.8 ? 'Moderate' : 'Weak',
      color: result.sharpeRatio >= 1.5 ? 'text-emerald-400' : result.sharpeRatio >= 0.8 ? 'text-amber-400' : 'text-red-400',
      icon:  <BarChart2 className="w-4 h-4" />,
    },
    {
      label: 'Max Drawdown',
      val:   `-${result.maxDrawdownPct}%`,
      sub:   result.maxDrawdownPct <= 15 ? 'Low risk' : result.maxDrawdownPct <= 25 ? 'Medium risk' : 'High risk',
      color: result.maxDrawdownPct <= 15 ? 'text-emerald-400' : result.maxDrawdownPct <= 25 ? 'text-amber-400' : 'text-red-400',
      icon:  <ShieldAlert className="w-4 h-4" />,
    },
    {
      label: 'Win Rate',
      val:   `${(result.winRate * 100).toFixed(1)}%`,
      sub:   `${result.winningTrades}W / ${result.losingTrades}L`,
      color: result.winRate >= 0.55 ? 'text-emerald-400' : result.winRate >= 0.45 ? 'text-amber-400' : 'text-red-400',
      icon:  <Percent className="w-4 h-4" />,
    },
    {
      label: 'Total Trades',
      val:   result.totalTrades.toString(),
      sub:   `Avg win $${result.avgWinUsd.toFixed(2)} · loss $${result.avgLossUsd.toFixed(2)}`,
      color: 'text-blue-400',
      icon:  <ListOrdered className="w-4 h-4" />,
    },
    {
      label: 'Profit Factor',
      val:   result.profitFactor >= 99 ? '∞' : result.profitFactor.toFixed(2),
      sub:   result.profitFactor >= 2 ? 'Excellent' : result.profitFactor >= 1.2 ? 'Good' : result.profitFactor >= 1 ? 'Marginal' : 'Losing',
      color: result.profitFactor >= 1.5 ? 'text-emerald-400' : result.profitFactor >= 1 ? 'text-amber-400' : 'text-red-400',
      icon:  <Award className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6" id="backtest-detail-view">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={onBack}
          className="mt-0.5 p-2 text-slate-400 hover:text-white hover:bg-[#1e2638] rounded-lg transition-all cursor-pointer shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-blue-400 text-sm font-bold">{job.id}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${TYPE_CLS[job.strategyType]}`}>
              {job.strategyType}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono font-semibold">
              {job.timeframe}
            </span>
          </div>
          <h2 className="text-xl font-display font-medium text-white">{job.strategyName}</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {job.symbol} · {job.exchange} · {job.startDate} → {job.endDate} · ${job.initialCapital.toLocaleString()} capital
          </p>
        </div>
        <div className={`text-right shrink-0`}>
          <p className={`text-2xl font-bold font-mono ${pnlColor}`}>
            {isProfit ? '+' : ''}{result.totalPnlPct}%
          </p>
          <p className={`text-xs font-mono ${pnlColor}`}>
            {isProfit ? '+' : ''}${result.totalPnlUsd.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="bg-[#121824] border border-[#1e2638] rounded-xl px-4 py-3">
            <div className={`mb-1.5 opacity-60 ${m.color}`}>{m.icon}</div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider leading-tight">{m.label}</p>
            <p className={`text-lg font-bold font-mono mt-0.5 ${m.color}`}>{m.val}</p>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Equity Curve */}
      <EquityCurve result={result} initialCapital={job.initialCapital} />

      {/* Trade List */}
      <TradeList result={result} />
    </div>
  );
}
