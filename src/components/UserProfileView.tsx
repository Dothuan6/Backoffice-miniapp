import React, { useState } from 'react';
import { ChevronRight, CreditCard, Play, Pause, Key, Copy, Check, Plus, Minus, Award, ArrowLeft, Lock, Unlock, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { User, Bot, CUHistoryRecord, UserApiKey, PaymentRecord, ReferralsInfo, AdminActivity, UserTradingStats } from '../types';

interface UserProfileViewProps {
  user: User;
  bots: Bot[];
  cuHistory: CUHistoryRecord[];
  apiKeys: UserApiKey[];
  payments: PaymentRecord[];
  referrals: ReferralsInfo;
  adminActivities: AdminActivity[];
  tradingStats?: UserTradingStats;
  onBackToList: () => void;
  onModifyCuBalance: (username: string, amount: number, description: string) => void;
  onToggleBot: (botId: string) => void;
  onToggleLock?: (username: string) => void;
}

export default function UserProfileView({
  user,
  bots,
  cuHistory,
  apiKeys,
  payments,
  referrals,
  adminActivities,
  tradingStats,
  onBackToList,
  onModifyCuBalance,
  onToggleBot,
  onToggleLock,
}: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'strategies' | 'activities' | 'api_keys' | 'payments' | 'referrals' | 'trading'>('strategies');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);

  const [adjustType, setAdjustType] = useState<'ADD' | 'DEDUCT'>('ADD');
  const [adjustAmount, setAdjustAmount] = useState('100.00');
  const [adjustDescription, setAdjustDescription] = useState('Credit Unit (CU) manual adjustment (Promo)');

  const userBots = bots.filter(b => b.userId === user.username);
  const isLocked = !!user.locked;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(adjustAmount) * (adjustType === 'ADD' ? 1 : -1);
    if (!isNaN(amountVal)) {
      onModifyCuBalance(user.username, amountVal, adjustDescription);
      setShowAdjustModal(false);
      setAdjustAmount('100.00');
      setAdjustDescription('Credit Unit (CU) manual adjustment (Promo)');
    }
  };

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'strategies', label: `Strategies (${userBots.length})` },
    { id: 'trading',    label: 'Trading Stats' },
    { id: 'activities', label: 'Activities' },
    { id: 'api_keys',   label: 'API Keys' },
    { id: 'payments',   label: 'Payments' },
    { id: 'referrals',  label: 'Referrals' },
  ];

  return (
    <div className="space-y-6" id="user-profile-view">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 overflow-x-auto shrink-0">
        <button onClick={onBackToList} className="hover:text-blue-400 font-semibold cursor-pointer flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <button onClick={onBackToList} className="hover:text-blue-400 cursor-pointer">Users</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-blue-400">{user.username}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-4 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToList}
            className="w-9 h-9 rounded-lg bg-slate-800 border border-[#1e2638] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">User Profile</h2>
            <p className="text-xs text-slate-500 font-mono">Manage trading attributes for {user.username}</p>
          </div>
        </div>
        {/* Lock / Unlock action */}
        <button
          onClick={() => setShowLockConfirm(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isLocked
              ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/20'
              : 'bg-rose-600/10 border-rose-500/40 text-rose-400 hover:bg-rose-600/20'
          }`}
        >
          {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          {isLocked ? 'Unlock Account' : 'Lock Account'}
        </button>
      </div>

      {/* Profile snapshot row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="profile-snapshots">
        {/* User info card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 lg:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-blue-500/30 object-cover" referrerPolicy="no-referrer" />
              <span className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-4 border-[#121824] ${user.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-display font-bold text-white leading-none">{user.username}</h3>
                {isLocked && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                    <Lock className="w-2.5 h-2.5" /> LOCKED
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <span>UUID: <span className="text-slate-300">{user.uuid}</span></span>
                  <button onClick={() => handleCopy(user.uuid, 'uuid')} className="hover:text-white p-0.5" title="Copy UUID">
                    {copiedText === 'uuid' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span>•</span>
                <span>Telegram ID: <span className="text-slate-200">{user.telegramId}</span></span>
              </div>
              <div className="flex items-center gap-2 mt-1 bg-[#0c101a] border border-[#1e2638] rounded-lg px-3 py-1.5 w-fit text-xs font-mono text-slate-400 overflow-x-auto">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider select-none mr-1">AFFILIATE:</span>
                <span className="text-blue-400 truncate select-all">https://quantadmin.app/register?ref={user.referralCode}</span>
                <button onClick={() => handleCopy(`https://quantadmin.app/register?ref=${user.referralCode}`, 'affLink')} className="hover:text-white p-0.5 shrink-0 ml-1 cursor-pointer">
                  {copiedText === 'affLink' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="bg-emerald-950/40 text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-emerald-500/20">
                  {user.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">Last active {user.lastActive}</span>
              </div>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-500 border-t md:border-t-0 border-[#1e2638] pt-3.5 md:pt-0 w-full md:w-auto">
            Joined Date: <span className="text-slate-300 block font-semibold mt-0.5">{user.joinedDateTime}</span>
          </div>
        </div>

        {/* CU Snapshot card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex flex-col justify-between" id="cu-snapshot-profile-card">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block mb-1">CU SNAPSHOT</span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span className="text-2xl font-mono font-bold text-white tracking-tight">
                  {user.cuBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-1">Compute Units Available</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 text-xs font-bold">CU</div>
          </div>
          <button
            id="adjust-cu-btn"
            onClick={() => setShowAdjustModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs tracking-wider uppercase py-2.5 rounded-lg transition-colors mt-4 cursor-pointer shadow-md shadow-blue-900/10"
          >
            ADJUST CU
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1e2638] flex flex-nowrap overflow-x-auto" id="profile-tabs-header">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 md:px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === t.id
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl" id="profile-tabs-content">

        {/* Strategies */}
        {activeTab === 'strategies' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-500 border-b border-[#1e2638]">
                  <th className="py-3 px-6 font-semibold uppercase">Bot</th>
                  <th className="py-3 px-6 font-semibold uppercase">ID</th>
                  <th className="py-3 px-6 font-semibold uppercase">Balance</th>
                  <th className="py-3 px-6 font-semibold uppercase">PL (24H)</th>
                  <th className="py-3 px-6 font-semibold uppercase">Status</th>
                  <th className="py-3 px-6 text-right font-semibold uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-sm">
                {userBots.length > 0 ? userBots.map(bot => (
                  <tr key={bot.id} className="hover:bg-[#161d2d]/35 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-200">{bot.name}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-400 text-xs">{bot.id}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-300 text-xs">{bot.balance}</td>
                    <td className="py-3.5 px-6">
                      <span className={`font-mono text-xs font-semibold ${bot.pl24h > 0 ? 'text-emerald-400' : bot.pl24h < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {bot.pl24h > 0 ? `+${bot.pl24h}` : bot.pl24h}%
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                        bot.status === 'ACTIVE' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>{bot.status}</span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => onToggleBot(bot.id)}
                        className="text-slate-400 hover:text-white inline-flex items-center gap-1 bg-[#1c2333] hover:bg-[#252f44] px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border border-[#2a354d]"
                      >
                        {bot.status === 'ACTIVE' ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                        {bot.status === 'ACTIVE' ? 'Pause' : 'Start'}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-400 text-xs font-mono">No active bot strategies running.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Trading Stats */}
        {activeTab === 'trading' && (
          <div className="p-6 space-y-6" id="profile-trading-tab">
            {tradingStats ? (
              <>
                {/* KPI row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Volume',  value: `$${(tradingStats.totalVolume / 1000).toFixed(1)}K`, color: 'text-white' },
                    { label: 'Net PnL',       value: (tradingStats.totalPnl >= 0 ? '+' : '') + `$${tradingStats.totalPnl.toLocaleString()}`, color: tradingStats.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400' },
                    { label: 'Total Orders',  value: tradingStats.totalTxns.toLocaleString(), color: 'text-white' },
                    { label: 'Win Rate',      value: `${tradingStats.winRate}%`, color: tradingStats.winRate >= 50 ? 'text-emerald-400' : 'text-amber-400' },
                  ].map(k => (
                    <div key={k.label} className="bg-[#1c2333] border border-[#2a354d] rounded-lg p-4">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">{k.label}</span>
                      <span className={`text-xl font-display font-bold ${k.color}`}>{k.value}</span>
                    </div>
                  ))}
                </div>

                {/* By exchange breakdown */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
                    <BarChart2 className="w-4 h-4 text-violet-400" /> Breakdown by Exchange
                  </h4>
                  <div className="border border-[#1e2638] rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0c101a] text-[10px] font-mono text-slate-500 border-b border-[#1e2638]">
                          <th className="py-2.5 px-4 font-semibold uppercase">Exchange</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">Volume</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">PnL</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">Txns</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2638] text-xs font-mono">
                        {tradingStats.byExchange.map(ex => (
                          <tr key={ex.exchange} className="hover:bg-[#161d2d]/25 transition-colors">
                            <td className="py-3 px-4 text-slate-200 font-semibold">{ex.exchange}</td>
                            <td className="py-3 px-4 text-right text-slate-300">${ex.volume.toLocaleString()}</td>
                            <td className={`py-3 px-4 text-right font-bold flex items-center justify-end gap-1 ${ex.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {ex.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {ex.pnl >= 0 ? '+' : ''}${ex.pnl.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-400">{ex.txns.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs font-mono">
                No trading data available for this user.
              </div>
            )}
          </div>
        )}

        {/* Activities (CU History) */}
        {activeTab === 'activities' && (
          <div className="overflow-x-auto" id="profile-activities-tab">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-500 border-b border-[#1e2638]">
                  <th className="py-3 px-6 font-semibold uppercase">ID</th>
                  <th className="py-3 px-6 font-semibold uppercase">Timestamp</th>
                  <th className="py-3 px-6 font-semibold uppercase">Type</th>
                  <th className="py-3 px-6 font-semibold uppercase">Amount (CU)</th>
                  <th className="py-3 px-6 font-semibold uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-sm font-mono">
                {cuHistory && cuHistory.length > 0 ? cuHistory.map(hist => (
                  <tr key={hist.id} className="hover:bg-[#161d2d]/35 transition-colors">
                    <td className="py-3.5 px-6 text-slate-500 text-xs">{hist.id}</td>
                    <td className="py-3.5 px-6 text-slate-400 text-xs">{hist.timestamp}</td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        hist.type === 'ADJUST' ? 'bg-blue-950/50 text-blue-400 border border-blue-500/10'
                        : hist.type === 'BONUS'  ? 'bg-purple-950/50 text-purple-400 border border-purple-500/10'
                        : hist.type === 'REFUND' ? 'bg-teal-950/50 text-teal-400 border border-teal-500/10'
                        : 'bg-rose-950/50 text-rose-400 border border-rose-500/10'
                      }`}>{hist.type}</span>
                    </td>
                    <td className={`py-3.5 px-6 text-xs font-bold ${hist.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {hist.amount >= 0 ? `+${hist.amount.toLocaleString()}` : hist.amount.toLocaleString()} CU
                    </td>
                    <td className="py-3.5 px-6 text-slate-300 text-xs max-w-sm truncate">{hist.description}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-xs">No activity recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* API Keys */}
        {activeTab === 'api_keys' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-500 border-b border-[#1e2638]">
                  <th className="py-3 px-6 font-semibold uppercase">API Name</th>
                  <th className="py-3 px-6 font-semibold uppercase">Exchange</th>
                  <th className="py-3 px-6 font-semibold uppercase">Key Mask</th>
                  <th className="py-3 px-6 font-semibold uppercase">Created</th>
                  <th className="py-3 px-6 font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-sm">
                {apiKeys && apiKeys.length > 0 ? apiKeys.map(key => (
                  <tr key={key.id} className="hover:bg-[#161d2d]/35 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-200 flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-slate-500 shrink-0" />{key.name}
                    </td>
                    <td className="py-3.5 px-6 text-slate-300 text-xs font-mono">{key.exchange}</td>
                    <td className="py-3.5 px-6 text-slate-400 text-xs font-mono uppercase">{key.keyMask}</td>
                    <td className="py-3.5 px-6 text-slate-400 text-xs font-mono">{key.created}</td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                        key.status === 'ACTIVE'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-950/40 text-rose-400 border border-rose-500/20 animate-pulse'
                      }`}>{key.status}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-xs font-mono">No API keys registered.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments */}
        {activeTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-500 border-b border-[#1e2638]">
                  <th className="py-3 px-6 font-semibold uppercase">Tx ID</th>
                  <th className="py-3 px-6 font-semibold uppercase">Date</th>
                  <th className="py-3 px-6 font-semibold uppercase">Amount</th>
                  <th className="py-3 px-6 font-semibold uppercase">CU Credited</th>
                  <th className="py-3 px-6 font-semibold uppercase">Method</th>
                  <th className="py-3 px-6 font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-sm font-mono">
                {payments && payments.length > 0 ? payments.map(p => (
                  <tr key={p.id} className="hover:bg-[#161d2d]/35 transition-colors">
                    <td className="py-3.5 px-6 text-slate-500 text-xs">{p.id}</td>
                    <td className="py-3.5 px-6 text-slate-400 text-xs">{p.timestamp}</td>
                    <td className="py-3.5 px-6 text-slate-300 font-semibold">${p.amountUsd.toFixed(2)}</td>
                    <td className="py-3.5 px-6 text-blue-400 font-bold">+{p.cuCredited.toLocaleString()} CU</td>
                    <td className="py-3.5 px-6 text-slate-400 text-xs">{p.method}</td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.status === 'SUCCESS' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                        : p.status === 'PENDING' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
                      }`}>{p.status}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-400 text-xs">No payment records.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Referrals */}
        {activeTab === 'referrals' && referrals && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'PROMO CODE',        value: referrals.referralCode, color: 'text-blue-400' },
                { label: 'Total Clicks',      value: referrals.clicks.toString(), color: 'text-white' },
                { label: 'Total Signups',     value: referrals.signups.toString(), color: 'text-white' },
                { label: 'Referred Earnings', value: `+${referrals.totalEarningsCu.toLocaleString()} CU`, color: 'text-emerald-400' },
              ].map(k => (
                <div key={k.label} className="bg-[#1c2333] border border-[#2a354d] rounded-lg p-3.5 text-center">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{k.label}</span>
                  <span className={`text-sm font-mono font-bold ${k.color} select-all`}>{k.value}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4 text-purple-400" /> referred networks ({referrals.referredUsers.length})
              </h4>
              <div className="border border-[#1e2638] rounded-xl overflow-hidden bg-[#0c101a]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#121824] text-[10px] font-mono text-slate-500 border-b border-[#1e2638]">
                      <th className="py-2.5 px-4 font-semibold uppercase">User</th>
                      <th className="py-2.5 px-4 font-semibold uppercase">Joined</th>
                      <th className="py-2.5 px-4 font-semibold uppercase">Status</th>
                      <th className="py-2.5 px-4 text-right font-semibold uppercase">Bonus Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2638] text-xs font-mono">
                    {referrals.referredUsers.map(ru => (
                      <tr key={ru.username} className="hover:bg-[#161d2d]/25 transition-colors">
                        <td className="py-3 px-4 text-slate-200 font-semibold">{ru.username}</td>
                        <td className="py-3 px-4 text-slate-400">{ru.joined}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            ru.status === 'ACTIVE' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' : 'bg-slate-800 text-slate-500'
                          }`}>{ru.status}</span>
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">+{ru.earningsCu} CU</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin session logs */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-400 mb-4">Admin Session Activity</h3>
        <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
          {adminActivities && adminActivities.length > 0 ? adminActivities.map((log, i) => (
            <div key={i} className="flex items-start justify-between py-2.5 border-b border-[#1e2638]/50 last:border-0 hover:bg-[#161d2d]/35 px-2 rounded transition-colors text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 whitespace-nowrap">{log.timestamp}</span>
                <span className="text-slate-200">{log.message}</span>
              </div>
              <span className="text-slate-500 font-semibold whitespace-nowrap ml-4">{log.admin}</span>
            </div>
          )) : (
            <div className="text-center py-6 text-slate-500 text-xs font-mono">No recent session logs.</div>
          )}
        </div>
      </div>

      {/* Adjust CU Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="adjust-cu-modal-overlay">
          <div className="bg-[#121824] border border-[#2a354d] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#1e2638] bg-[#0c101a] flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Adjust Compute Units (CU)</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4">
              <div className="bg-[#1c2333]/60 p-4 border border-[#1e2638] rounded-lg">
                <div className="text-xs text-slate-400 font-mono mb-1">Target Account</div>
                <div className="text-sm font-bold text-white">{user.name} ({user.username})</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">Current Balance: {user.cuBalance.toLocaleString()} CU</div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['ADD', 'DEDUCT'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { setAdjustType(type); setAdjustDescription(type === 'ADD' ? 'Credit Unit (CU) manual adjustment (Promo)' : 'Credit Unit (CU) manual adjustment (Debit Correction)'); }}
                      className={`py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        adjustType === type
                          ? type === 'ADD' ? 'bg-emerald-600/15 border-emerald-500 text-emerald-400 font-bold' : 'bg-rose-600/15 border-rose-500 text-rose-400 font-bold'
                          : 'bg-slate-800/80 border-[#1e2638] text-slate-400'
                      }`}
                    >
                      {type === 'ADD' ? <Plus className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      {type === 'ADD' ? 'Credit CU' : 'Deduct CU'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Amount (CU)</label>
                <div className="relative">
                  <input type="number" step="0.01" min="0.01" required value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)}
                    className="w-full bg-[#1c2333] border border-[#1e2638] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono" placeholder="100.00" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 select-none">CU</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Reason / Notes</label>
                <textarea required rows={2} value={adjustDescription} onChange={e => setAdjustDescription(e.target.value)}
                  className="w-full bg-[#1c2333] border border-[#1e2638] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2638]">
                <button type="button" onClick={() => setShowAdjustModal(false)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${adjustType === 'ADD' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}>
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lock confirmation modal */}
      {showLockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121824] border border-[#2a354d] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#1e2638] bg-[#0c101a] flex items-center gap-3">
              {isLocked ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-rose-400" />}
              <h3 className="text-sm font-bold text-white">{isLocked ? 'Unlock' : 'Lock'} Account</h3>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-400 font-mono">
                {isLocked
                  ? `Unlock ${user.username}? The user will regain access to the platform.`
                  : `Lock ${user.username}? The user will be prevented from accessing the platform.`}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setShowLockConfirm(false)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer">Cancel</button>
                <button
                  onClick={() => { onToggleLock?.(user.username); setShowLockConfirm(false); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${isLocked ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}
                >
                  Confirm {isLocked ? 'Unlock' : 'Lock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
