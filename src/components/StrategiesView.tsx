import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, RefreshCw, Eye, Settings, Trash2, Sliders, Check, CircleAlert, Pause, Play } from 'lucide-react';
import { Bot } from '../types';

interface StrategiesViewProps {
  bots: Bot[];
  onViewBotDetail: (botId: string) => void;
  onToggleBotStatus: (botId: string) => void;
  onDeleteBot: (botId: string) => void;
  onApplyPendingChanges: () => void;
  onDiscardPendingChanges: () => void;
  pendingChangesCount: number;
}

export default function StrategiesView({
  bots,
  onViewBotDetail,
  onToggleBotStatus,
  onDeleteBot,
  onApplyPendingChanges,
  onDiscardPendingChanges,
  pendingChangesCount
}: StrategiesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [exchangeFilter, setExchangeFilter] = useState('All Exchanges');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Dynamic calculations for cards
  const totalActiveBots = bots.filter(b => b.status === 'ACTIVE').length;
  const pausedBotsCount = bots.filter(b => b.status === 'PAUSED').length;

  // Filter bots
  const filteredBots = useMemo(() => {
    return bots.filter((bot) => {
      // Search
      const matchesSearch =
        bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.userId.toLowerCase().includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus =
        statusFilter === 'All Statuses' ||
        bot.status === statusFilter.toUpperCase();

      // Exchange
      const matchesExchange =
        exchangeFilter === 'All Exchanges' ||
        bot.exchange.toLowerCase().includes(exchangeFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesExchange;
    });
  }, [bots, searchQuery, statusFilter, exchangeFilter]);

  // Sync animation simulation
  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage(true);
      setTimeout(() => setSyncMessage(false), 3000);
    }, 1500);
  };

  // Render Status Badge matching Screenshot 4
  const renderStatusBadge = (status: Bot['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="bg-emerald-950/45 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide font-sans">
            ACTIVE
          </span>
        );
      case 'ANOMALY':
        return (
          <span className="bg-rose-950/45 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide font-sans animate-pulse flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            ANOMALY
          </span>
        );
      case 'PAUSED':
        return (
          <span className="bg-amber-950/45 text-amber-400 border border-amber-500/25 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide font-sans">
            PAUSED
          </span>
        );
      default:
        return null;
    }
  };

  // Render Exchange Logos
  const renderExchangeLabel = (exchange: string) => {
    const isBinance = exchange.toLowerCase().includes('binance');
    const isKraken = exchange.toLowerCase().includes('kraken');

    return (
      <div className="flex items-center gap-1.5 select-none font-mono text-xs">
        {isBinance ? (
          <div className="w-4.5 h-4.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-500 font-bold flex items-center justify-center text-[9px] scale-95 shrink-0" title="Binance API">
            B
          </div>
        ) : isKraken ? (
          <div className="w-4.5 h-4.5 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 font-bold flex items-center justify-center text-[9px] scale-95 shrink-0" title="Kraken API">
            K
          </div>
        ) : (
          <div className="w-4.5 h-4.5 bg-slate-800 border border-slate-700 rounded text-slate-400 font-bold flex items-center justify-center text-[9px] scale-95 shrink-0">
            ?
          </div>
        )}
        <span className="text-slate-300">{exchange}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="strategies-view-panel">
      {/* Page Title */}
      <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Strategies Management</h2>

      {/* Stats Summary Cards (replicates top cards of Screenshot 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="strategies-top-cards">
        {/* Total Active Bots Card with Sparkline */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex items-center justify-between" id="active-bots-qty-card">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-505 font-mono uppercase tracking-wider block">Total Active</span>
            <span className="text-3xl font-display font-bold text-white leading-none block">{totalActiveBots}</span>
          </div>

          {/* Miniature Sparkline Graphic */}
          <div className="w-36 h-12" id="sparkline-wrapper">
            <svg viewBox="0 0 120 40" className="w-full h-full">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Glow Area */}
              <path d="M 0 35 Q 20 15, 35 25 T 70 8 T 100 20 T 120 15 L 120 40 L 0 40 Z" fill="url(#sparkGrad)" />
              {/* Path stroke */}
              <path
                d="M 0 35 Q 20 15, 35 25 T 70 8 T 100 20 T 120 15"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Paused Bots Card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex items-center justify-between" id="paused-bots-qty-card">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-505 font-mono uppercase tracking-wider block">Paused Bots</span>
            <span className="text-3xl font-display font-bold text-white leading-none block">{pausedBotsCount}</span>
          </div>
          {/* Pause symbol button */}
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
            <Pause className="w-4 h-4 fill-rose-400/20" />
          </div>
        </div>
      </div>

      {/* Filter Options & Toolbar */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="strategies-toolbar">
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Ticker, User, or Strategy ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-550 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters dropdown and Action button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0d121f] text-slate-300 border border-[#1e2638] rounded-lg pl-3 pr-8 py-2 text-xs font-mono appearance-none cursor-pointer focus:outline-none"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Anomaly</option>
              <option>Paused</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Exchange Dropdown */}
          <div className="relative">
            <select
              value={exchangeFilter}
              onChange={(e) => setExchangeFilter(e.target.value)}
              className="bg-[#0d121f] text-slate-300 border border-[#1e2638] rounded-lg pl-3 pr-8 py-2 text-xs font-mono appearance-none cursor-pointer focus:outline-none"
            >
              <option>All Exchanges</option>
              <option>Binance</option>
              <option>Kraken</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Sync Button */}
          <button
            id="sync-strategies-btn"
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-[#1c2333] hover:bg-[#252f44] border border-[#2a354d] text-blue-400 px-3.5 py-2 rounded-lg text-xs font-mono transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Sync completed Announcement Banner */}
      {syncMessage && (
        <div id="sync-success-banner" className="bg-[#14232c] text-teal-400 border border-teal-500/20 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5 animate-fade-in font-mono">
          <Check className="w-4 h-4 text-teal-400" />
          Exchange strategies index synchronized successfully. Refreshed live latency.
        </div>
      )}

      {/* Bot Strategies Grid Table */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl" id="strategies-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="strategies-management-table">
            <thead>
              <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-405 border-b border-[#1e2638] select-none">
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Status</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Ticker</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Bot Type</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">User</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Exchange</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Cycle #</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Pause Reason</th>
                <th className="py-3 px-4 md:px-6 text-right font-semibold uppercase whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638] text-sm">
              {filteredBots.length > 0 ? (
                filteredBots.map((bot) => (
                  <tr
                    key={bot.id}
                    id={`bot-row-${bot.id}`}
                    className="hover:bg-[#161d2d]/35 transition-colors duration-150"
                  >
                    {/* Status badge */}
                    <td className="py-4 px-4 md:px-6">
                      {renderStatusBadge(bot.status)}
                    </td>

                    {/* Ticker drill-down link */}
                    <td className="py-4 px-4 md:px-6 font-bold text-[#3b82f6] hover:text-blue-400 cursor-pointer whitespace-nowrap" onClick={() => onViewBotDetail(bot.id)}>
                      {bot.ticker}
                    </td>

                    {/* Bot Type badge */}
                    <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded border bg-violet-950/40 text-violet-300 border-violet-500/20 font-mono">
                        {bot.botType}
                      </span>
                    </td>

                    {/* User profile username */}
                    <td className="py-4 px-4 md:px-6 text-xs font-mono text-slate-300 whitespace-nowrap">
                      {bot.userId}
                    </td>

                    {/* Exhcange with mini icon */}
                    <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                      {renderExchangeLabel(bot.exchange)}
                    </td>

                    {/* Cycle # */}
                    <td className="py-4 px-4 md:px-6 text-xs font-mono text-slate-350 whitespace-nowrap">
                      #{bot.cycleCount.toLocaleString()}
                    </td>

                    {/* Pause cause */}
                    <td className="py-4 px-4 md:px-6 text-xs font-sans text-slate-400 whitespace-nowrap">
                      {bot.pauseReason}
                    </td>

                    {/* Action toggles */}
                    <td className="py-4 px-4 md:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 text-slate-450">
                        {/* Detail Inspector Magnifying icon */}
                        <button
                          onClick={() => onViewBotDetail(bot.id)}
                          title="Inspect detailed cycle stats"
                          className="w-7 h-7 min-h-0 bg-slate-800/60 border border-[#1e2638] rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/20 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {/* Status Toggle play/pause settings icon */}
                        <button
                          onClick={() => onToggleBotStatus(bot.id)}
                          title={bot.status === 'ACTIVE' ? 'Pause bot' : 'Start bot'}
                          className="w-7 h-7 min-h-0 bg-slate-800/60 border border-[#1e2638] rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/20 transition-colors cursor-pointer"
                        >
                          {bot.status === 'ACTIVE' ? <Pause className="w-3 h-3 text-amber-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
                        </button>
                        {/* Remove Bot trash button */}
                        <button
                          onClick={() => setShowDeleteModal(bot.id)}
                          title="Remove strategy bot configuration"
                          className="w-7 h-7 min-h-0 bg-slate-800/60 border border-[#1e2638] rounded-lg flex items-center justify-center text-slate-505 hover:text-rose-400 hover:border-rose-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 text-xs font-mono">
                    No algorithm bots found matching your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Bot confirmation pop-up */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none" id="delete-bot-modal">
          <div className="bg-[#121824] border border-rose-550/25 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#1e2638] bg-[#0c101a] text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <CircleAlert className="w-4 h-4 text-rose-400" />
              <span>Confirm Bot Deletion</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-350 font-sans leading-relaxed">
                Are you sure you want to remove bot <span className="font-bold text-white">{showDeleteModal}</span>? This action deletes active api cycles and cannot be undone.
              </p>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#1e2638]">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteBot(showDeleteModal);
                    setShowDeleteModal(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer"
                >
                  Delete Bot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Mutation Active warning widget matching Screenshot 4 */}
      {pendingChangesCount > 0 && (
        <div
          id="mutation-action-footer-sticky"
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f17]/95 backdrop-blur-md border-t border-blue-900/40 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-2xl animate-slide-up select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <CircleAlert className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xs flex items-center flex-wrap gap-x-2 gap-y-0.5">
              <span className="font-bold text-white uppercase tracking-wide">MUTATION MODE ACTIVE —</span>
              <span className="text-slate-400 font-mono">Changes made here affect {pendingChangesCount} live production bots.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto font-mono text-xs">
            <button
              id="discard-mutations-btn"
              onClick={onDiscardPendingChanges}
              className="px-4 py-2 hover:bg-slate-800/60 text-slate-350 border border-[#2a354d] hover:border-slate-500 rounded-lg transition-colors cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              id="apply-mutations-btn"
              onClick={onApplyPendingChanges}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-blue-900/10"
            >
              Apply Modifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
