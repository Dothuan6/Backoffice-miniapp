import React, { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { TradingReportRow } from '../types';

interface TradingReportViewProps {
  rows: TradingReportRow[];
}

type SortKey = keyof Pick<TradingReportRow, 'volume' | 'txns' | 'pnl' | 'winRate'>;

const EXCHANGES = ['ALL', 'Binance', 'OKX', 'Bybit', 'Kraken'];

export default function TradingReportView({ rows }: TradingReportViewProps) {
  const [filterExchange, setFilterExchange] = useState('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('volume');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = rows
    .filter(r => filterExchange === 'ALL' || r.exchange === filterExchange)
    .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);

  const totalVolume = rows.reduce((s, r) => s + r.volume, 0);
  const totalTxns   = rows.reduce((s, r) => s + r.txns, 0);
  const totalPnl    = rows.reduce((s, r) => s + r.pnl, 0);
  const avgWinRate  = rows.length ? (rows.reduce((s, r) => s + r.winRate, 0) / rows.length) : 0;

  // Volume by exchange for mini bar chart
  const byExchange = EXCHANGES.slice(1).map(ex => ({
    name: ex,
    volume: rows.filter(r => r.exchange === ex).reduce((s, r) => s + r.volume, 0),
    txns:   rows.filter(r => r.exchange === ex).reduce((s, r) => s + r.txns, 0),
  }));
  const maxVol = Math.max(...byExchange.map(e => e.volume));

  const fmtVol = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1_000).toFixed(0)}K`;

  const SortBtn = ({ col }: { col: SortKey }) => (
    <button onClick={() => handleSort(col)} className="ml-1 inline-flex cursor-pointer text-slate-600 hover:text-slate-300 transition-colors">
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="space-y-6" id="trading-report-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Trading Report</h2>
        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-[#121824] px-3 py-1.5 rounded-lg border border-[#1e2638] self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
          All exchanges · All time
        </div>
      </div>

      {/* Summary KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume',   value: fmtVol(totalVolume), sub: 'across all exchanges',  color: 'text-white' },
          { label: 'Total Txns',     value: totalTxns.toLocaleString(), sub: 'orders executed', color: 'text-white' },
          { label: 'Net PnL',        value: (totalPnl >= 0 ? '+' : '') + fmtVol(Math.abs(totalPnl)), sub: 'realised profit/loss', color: totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400' },
          { label: 'Avg Win Rate',   value: `${avgWinRate.toFixed(1)}%`, sub: 'win rate all pairs', color: avgWinRate >= 50 ? 'text-emerald-400' : 'text-amber-400' },
        ].map(k => (
          <div key={k.label} className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">{k.label}</span>
            <span className={`text-2xl font-display font-bold ${k.color}`}>{k.value}</span>
            <span className="text-xs text-slate-500 block mt-1">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Volume by exchange bar chart */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-5 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-violet-400" />
          Volume by Exchange
        </h3>
        <div className="space-y-3">
          {byExchange.map(ex => (
            <div key={ex.name} className="flex items-center gap-4">
              <span className="text-xs font-mono text-slate-400 w-16 shrink-0">{ex.name}</span>
              <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: maxVol > 0 ? `${(ex.volume / maxVol) * 100}%` : '0%' }}
                >
                  {ex.volume / maxVol > 0.25 && (
                    <span className="text-[10px] font-mono text-white/80">{fmtVol(ex.volume)}</span>
                  )}
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 w-20 text-right shrink-0">{ex.txns.toLocaleString()} txns</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exchange filter */}
      <div className="flex flex-wrap gap-2">
        {EXCHANGES.map(ex => (
          <button
            key={ex}
            onClick={() => setFilterExchange(ex)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
              filterExchange === ex
                ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                : 'bg-[#121824] border-[#1e2638] text-slate-400 hover:text-slate-200'
            }`}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Detail table */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-500 border-b border-[#1e2638]">
                <th className="py-3 px-5 font-semibold uppercase">Exchange</th>
                <th className="py-3 px-5 font-semibold uppercase">Pair</th>
                <th className="py-3 px-5 font-semibold uppercase">
                  Txns <SortBtn col="txns" />
                </th>
                <th className="py-3 px-5 font-semibold uppercase">
                  Volume <SortBtn col="volume" />
                </th>
                <th className="py-3 px-5 font-semibold uppercase">
                  PnL <SortBtn col="pnl" />
                </th>
                <th className="py-3 px-5 font-semibold uppercase">
                  Win Rate <SortBtn col="winRate" />
                </th>
                <th className="py-3 px-5 font-semibold uppercase">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638] text-sm font-mono">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-[#161d2d]/35 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="text-xs font-semibold text-slate-200 bg-[#1c2333] border border-[#2a354d] px-2 py-0.5 rounded">
                      {r.exchange}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300 font-semibold text-xs">{r.pair}</td>
                  <td className="py-3.5 px-5 text-white text-xs">{r.txns.toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-slate-200 text-xs">{fmtVol(r.volume)}</td>
                  <td className={`py-3.5 px-5 text-xs font-bold ${r.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className="flex items-center gap-1">
                      {r.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {r.pnl >= 0 ? '+' : ''}{fmtVol(Math.abs(r.pnl))}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${r.winRate >= 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${r.winRate}%` }}
                        />
                      </div>
                      <span className={`text-xs ${r.winRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>{r.winRate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 text-xs">{r.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
