import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Copy, Check, Play, Pause, ExternalLink, Settings, HelpCircle, RefreshCw } from 'lucide-react';
import { Bot } from '../types';

interface BotDetailViewProps {
  bot: Bot;
  onBackToStrategies: () => void;
  onToggleStatus: () => void;
}

export default function BotDetailView({
  bot,
  onBackToStrategies,
  onToggleStatus
}: BotDetailViewProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [dcaRound, setDcaRound] = useState(2);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const executeRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Derived mock data depending on DCA state for higher interactivity
  const totalInvested = dcaRound * 100;
  const quantity = (totalInvested / 48240).toFixed(6);

  return (
    <div className="space-y-6" id="bot-detail-view">
      {/* Breadcrumbs navigation matching Screenshot 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500" id="bot-breadcrumbs">
        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
          <button onClick={onBackToStrategies} className="hover:text-blue-400 cursor-pointer text-slate-400 font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-650" />
          <span className="text-slate-400">Strategies</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-650" />
          <span className="text-blue-400 font-semibold">{bot.ticker} ({bot.userId})</span>
        </div>

        {/* Dynamic refresh indicators */}
        <button
          onClick={executeRefresh}
          className="flex items-center gap-1.5 hover:text-slate-350 bg-slate-800 px-3 py-1.5 rounded-lg border border-[#1e2638] cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Force Refresh</span>
        </button>
      </div>

      {/* Grid wrapper for Main elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="bot-header-metrics-row">
        {/* Main Bot Details Header Card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 lg:col-span-2 flex flex-col justify-between relative overflow-hidden" id="bot-profile-identity-card">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">{bot.name}</h2>
                <button
                  id="detail-status-toggle"
                  onClick={onToggleStatus}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded border transition-all cursor-pointer ${
                    bot.status === 'ACTIVE'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {bot.status}
                </button>
              </div>
              <div className="text-xs font-mono text-slate-405 space-y-1">
                <div>Ticker: <span className="text-slate-300 font-semibold uppercase">{bot.ticker.replace('-', '')}</span></div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span>ID: <span className="text-slate-200">64e2f38ab821cd94</span></span>
                  <button
                    onClick={() => handleCopy('64e2f38ab821cd94', 'bot-id')}
                    className="text-slate-505 hover:text-white"
                  >
                    {copiedText === 'bot-id' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div>Owner: <span className="text-blue-400">{bot.userId}</span></div>
              </div>
            </div>

            {/* Exchange & Gold Coin Logo block */}
            <div className="flex flex-col items-end gap-3 text-right">
              <div className="flex items-center gap-1.5 bg-[#1a2133] hover:bg-[#20293d] border border-slate-750 px-2.5 py-1 rounded text-xs select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="font-mono text-[11px] text-slate-300">{bot.exchange}</span>
              </div>

              {/* Big Golden Crypto Icon */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-[1.5px] shadow-lg shadow-amber-950/20 flex items-center justify-center font-display font-bold text-slate-900 border border-amber-500/20 select-none">
                ₿
              </div>
            </div>
          </div>
        </div>

        {/* Temporal Workflow Status Card (Screenshot 5 top right) */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-3.5 flex flex-col justify-between" id="temporal-workflow-card">
          <div className="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">TEMPORAL WORKFLOW</span>
            <span className="bg-emerald-950/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/25 flex items-center gap-1 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              RUNNING
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono leading-relaxed text-slate-400">
            <div className="flex justify-between">
              <span>WORKFLOW ID</span>
              <span className="text-slate-200 select-all font-semibold">dca-64e2f3-main-flow</span>
            </div>
            <div className="flex justify-between">
              <span>LAST RUN ID</span>
              <span className="text-slate-200 select-all">01JXK8...7F9S</span>
            </div>
            <div className="flex justify-between">
              <span>HEARTBEAT</span>
              <span className="text-emerald-400 font-bold">2s ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Current Cycle Stats & Strategy Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="bot-cycle-metrics-row">
        {/* Current Cycle specifications panel */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 lg:col-span-2 space-y-4" id="current-cycle-card">
          <div className="flex items-center justify-between border-b border-[#1e2638]/60 pb-2.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-305">Current Cycle</h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">cy-0047</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-blue-950/40 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/25">OPEN</span>
              <span className="bg-amber-950/40 text-amber-405 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/25">WAITING_TP</span>
            </div>
          </div>

          {/* Six Metrics Grid matching Screenshot 5 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4.5" id="current-cycle-metrics-grid">
            {/* DCA progress */}
            <div className="bg-[#0c101a] border border-[#1e2638] rounded-lg p-3.5 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">DCA Progress</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white font-mono">Round {dcaRound} / 10</span>
                {/* Micro interactivity toggle */}
                <div className="flex flex-col -space-y-0.5">
                  <button onClick={() => setDcaRound(prev => Math.min(prev + 1, 10))} className="text-[10px] text-slate-500 hover:text-white leading-none font-bold pr-0.5 cursor-pointer">▲</button>
                  <button onClick={() => setDcaRound(prev => Math.max(prev - 1, 1))} className="text-[10px] text-slate-500 hover:text-white leading-none font-bold pr-0.5 cursor-pointer">▼</button>
                </div>
              </div>
            </div>

            {/* Average Price */}
            <div className="bg-[#0c101a] border border-[#1e2638] rounded-lg p-3.5 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Avg Price</span>
              <span className="text-lg font-bold text-white font-mono">$48,294.10</span>
            </div>

            {/* Entry Price */}
            <div className="bg-[#0c101a] border border-[#1e2638] rounded-lg p-3.5 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Entry Price</span>
              <span className="text-lg font-bold text-white font-mono">$48,100.00</span>
            </div>

            {/* Total Invested */}
            <div className="bg-[#0c101a] border border-[#1e2638] rounded-lg p-3.5 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Total Invested</span>
              <span className="text-lg font-bold text-white font-mono">{totalInvested.toFixed(2)} USDT</span>
            </div>

            {/* Total Quantity */}
            <div className="bg-[#0c101a] border border-[#1e2638] rounded-lg p-3.5 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Total Quantity</span>
              <span className="text-lg font-bold text-white font-mono">{quantity} BTC</span>
            </div>

            {/* Unrealized P&L */}
            <div className="bg-[#0c101a] border border-[#1e2638] rounded-lg p-3.5 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Unrealized P&L</span>
              <span className="text-lg font-bold text-emerald-400 font-mono tracking-tight">+0.42%</span>
            </div>
          </div>
        </div>

        {/* Strategy Parameters Configuration Panel */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex flex-col justify-between" id="strategy-config-card">
          <div className="flex items-center justify-between border-b border-[#1e2638]/60 pb-2 mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">STRATEGY CONFIGURATION</h3>
          </div>

          {/* Grid key-values parameters matrix */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-mono leading-relaxed select-none">
            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Base Order:</span>
              <span className="text-slate-300 font-bold">100.0</span>
            </div>
            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Trailing Dev:</span>
              <span className="text-slate-300">0.5%</span>
            </div>

            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Safety Order:</span>
              <span className="text-slate-300 font-bold">100.0</span>
            </div>
            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Trailing Dev:</span>
              <span className="text-slate-300">0.2%</span>
            </div>

            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Price Deviation:</span>
              <span className="text-slate-300">1.5%</span>
            </div>
            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Max Safety:</span>
              <span className="text-slate-300">10</span>
            </div>

            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">TP PCT:</span>
              <span className="text-slate-300">3.5%</span>
            </div>
            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Multiplier:</span>
              <span className="text-slate-300">5</span>
            </div>

            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Entry Type:</span>
              <span className="text-slate-300 font-semibold text-blue-400">trailing</span>
            </div>
            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1">
              <span className="text-slate-505">Multiplier:</span>
              <span className="text-slate-300">1.05x</span>
            </div>

            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1 col-span-2">
              <span className="text-slate-505">Stop Loss:</span>
              <span className="text-rose-400 font-bold">DISABLED (10.0%)</span>
            </div>
            <div className="flex justify-between border-b border-[#1f293d]/45 pb-1 col-span-2">
              <span className="text-slate-505">Cooldown:</span>
              <span className="text-slate-300 font-semibold">300 seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tables: Open Orders Grid vs Cycle History Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="bot-tables-row">
        {/* Open Orders Table (Take 3/5 cols) */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 lg:col-span-3 space-y-3.5" id="open-orders-card">
          <div className="flex items-center justify-between border-b border-[#1e2638]/65 pb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-300">Open Orders</h3>
              <span className="bg-[#1e2638] text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">2</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#0c101a] border-b border-[#1e2638] text-[9px] text-slate-405 tracking-wider select-none">
                  <th className="py-2.5 px-4 font-semibold uppercase">CLIENT_ORDER_ID</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">SIDE</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">TYPE</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">QTY</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">PRICE</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">FILLED</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-[11px] text-slate-300">
                <tr className="hover:bg-[#161d2d]/25 transition-colors">
                  <td className="py-3 px-4 text-slate-400">dca-64e2f3-r2</td>
                  <td className="py-3 px-4 font-bold text-teal-400 uppercase">BUY</td>
                  <td className="py-3 px-4 text-slate-450 uppercase">BUY</td>
                  <td className="py-3 px-4">0.000145</td>
                  <td className="py-3 px-4">$48,291.10</td>
                  <td className="py-3 px-4">0</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">CLOSED</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#161d2d]/25 transition-colors">
                  <td className="py-3 px-4 text-slate-400">tp-64e2f3-r0</td>
                  <td className="py-3 px-4 font-bold text-rose-450 uppercase">SELL</td>
                  <td className="py-3 px-4 text-slate-450 uppercase">BUY</td>
                  <td className="py-3 px-4">0.004145</td>
                  <td className="py-3 px-4">$48,110.00</td>
                  <td className="py-3 px-4">0</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">CLOSED</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cycle History Table (Takes 2/5 cols) */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 lg:col-span-2 space-y-3.5" id="cycle-history-card">
          <div className="flex items-center justify-between border-b border-[#1e2638]/65 pb-2">
            <h3 className="text-sm font-semibold text-slate-300">Cycle History</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#0c101a] border-b border-[#1e2638] text-[9px] text-slate-405 tracking-wider select-none">
                  <th className="py-2.5 px-4 font-semibold uppercase">CYCLE ID</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">CLOSED DATE</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">ROUNDS DCA</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">AVG EXIT PRICE</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">REALIZED P&L</th>
                  <th className="py-2.5 px-4 font-semibold uppercase">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-[11px] text-slate-300">
                <tr className="hover:bg-[#161d2d]/25 transition-colors">
                  <td className="py-3 px-4 text-slate-400">cy-0046</td>
                  <td className="py-3 px-4">01/11/2023</td>
                  <td className="py-3 px-4 text-center">2</td>
                  <td className="py-3 px-4">$48,100.00</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">+0.42%</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">CLOSED</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#161d2d]/25 transition-colors">
                  <td className="py-3 px-4 text-slate-400">cy-0045</td>
                  <td className="py-3 px-4">01/11/2023</td>
                  <td className="py-3 px-4 text-center">2</td>
                  <td className="py-3 px-4">$48,294.10</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">+0.42%</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">CLOSED</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#161d2d]/25 transition-colors">
                  <td className="py-3 px-4 text-slate-400">cy-0044</td>
                  <td className="py-3 px-4">01/11/2023</td>
                  <td className="py-3 px-4 text-center">2</td>
                  <td className="py-3 px-4">$48,100.00</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">+0.42%</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">CLOSED</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
