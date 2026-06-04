import React, { useState } from 'react';
import { ChevronRight, CreditCard, Edit2, Play, Pause, Key, ArrowUpRight, Copy, Check, Plus, Minus, Landmark, ShieldAlert, Award, ArrowLeft } from 'lucide-react';
import { User, Bot, CUHistoryRecord, UserApiKey, PaymentRecord, ReferralsInfo, AdminActivity } from '../types';

interface UserProfileViewProps {
  user: User;
  bots: Bot[];
  cuHistory: CUHistoryRecord[];
  apiKeys: UserApiKey[];
  payments: PaymentRecord[];
  referrals: ReferralsInfo;
  adminActivities: AdminActivity[];
  onBackToList: () => void;
  onModifyCuBalance: (username: string, amount: number, description: string) => void;
  onToggleBot: (botId: string) => void;
}

export default function UserProfileView({
  user,
  bots,
  cuHistory,
  apiKeys,
  payments,
  referrals,
  adminActivities,
  onBackToList,
  onModifyCuBalance,
  onToggleBot
}: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'strategies' | 'cu_history' | 'api_keys' | 'payments' | 'referrals'>('strategies');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  
  // Balance adjustment modal inputs
  const [adjustType, setAdjustType] = useState<'ADD' | 'DEDUCT'>('ADD');
  const [adjustAmount, setAdjustAmount] = useState('100.00');
  const [adjustDescription, setAdjustDescription] = useState('Credit Unit (CU) manual adjustment (Promo)');

  const userBots = bots.filter(b => b.userId === user.username);

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
      // Reset inputs
      setAdjustAmount('100.00');
      setAdjustDescription('Credit Unit (CU) manual adjustment (Promo)');
    }
  };

  return (
    <div className="space-y-6" id="user-profile-view">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-505" id="profile-breadcrumbs">
        <div className="flex items-center gap-2">
          <button onClick={onBackToList} className="hover:text-blue-400 font-semibold cursor-pointer flex items-center gap-1 text-slate-400">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-650" />
          <span className="text-slate-400">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-650" />
          <button onClick={onBackToList} className="hover:text-blue-400 cursor-pointer">Users</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-655" />
          <span className="text-blue-400">{user.username}</span>
        </div>
      </div>

      {/* Header and Back button */}
      <div className="flex items-center gap-4 border-b border-[#1e2638] pb-4">
        <button
          onClick={onBackToList}
          className="w-9 h-9 rounded-lg bg-slate-800 border border-[#1e2638] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-2xl font-display font-medium text-white tracking-tight">User Profile</h2>
          <p className="text-xs text-slate-500 font-mono">Manage trading attributes for {user.username}</p>
        </div>
      </div>

      {/* Profile Info and CU Snapshot (2 card grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="profile-snapshots">
        {/* User Stats Card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 lg:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 pb-1">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-blue-500/30 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute bottom-0 right-1 w-4.5 h-4.5 rounded-full border-4 border-[#121824] ${
                user.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-500'
              }`}></span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold text-white leading-none">{user.username}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-405">
                <div className="flex items-center gap-1 group">
                  <span>UUID: <span className="text-slate-300">{user.uuid}</span></span>
                  <button
                    onClick={() => handleCopy(user.uuid, 'uuid')}
                    className="hover:text-white p-0.5"
                    title="Copy UUID"
                  >
                    {copiedText === 'uuid' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span>•</span>
                <span>Telegram ID: <span className="text-slate-200">{user.telegramId}</span></span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="bg-emerald-950/40 text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-emerald-500/20">
                  Status {user.status}
                </span>
                <span className="text-xs text-slate-505 font-mono">Last active {user.lastActive}</span>
              </div>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-500 border-t md:border-t-0 border-[#1e2638] pt-3.5 md:pt-0 w-full md:w-auto">
            Joined Date: <span className="text-slate-300 block font-semibold mt-0.5">{user.joinedDateTime}</span>
          </div>
        </div>

        {/* CU Snapshot Card */}
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
              <span className="text-xs text-slate-450 block mt-1">Compute Units Available</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
              CU
            </div>
          </div>

          <button
            id="adjust-cu-btn"
            onClick={() => setShowAdjustModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs tracking-wider uppercase py-2.5 rounded-lg transition-colors mt-4 text-center cursor-pointer shadow-md shadow-blue-900/10"
          >
            ADJUST CU
          </button>
        </div>
      </div>

      {/* Tabs Control Header */}
      <div className="border-b border-[#1e2638] flex flex-wrap" id="profile-tabs-header">
        <button
          onClick={() => setActiveTab('strategies')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'strategies'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Strategies ({userBots.length})
        </button>
        <button
          onClick={() => setActiveTab('cu_history')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'cu_history'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          CU History
        </button>
        <button
          onClick={() => setActiveTab('api_keys')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'api_keys'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          API Keys
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'referrals'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Referrals
        </button>
      </div>

      {/* Dynamic Tab Body Viewer */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl" id="profile-tabs-content">
        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="overflow-x-auto" id="profile-strategies-tab">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-405 border-b border-[#1e2638]">
                  <th className="py-3 px-6 font-semibold uppercase">Bot</th>
                  <th className="py-3 px-6 font-semibold uppercase">ID</th>
                  <th className="py-3 px-6 font-semibold uppercase">Balance</th>
                  <th className="py-3 px-6 font-semibold uppercase">PL (24H)</th>
                  <th className="py-3 px-6 font-semibold uppercase">Status</th>
                  <th className="py-3 px-6 text-right font-semibold uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-sm">
                {userBots.length > 0 ? (
                  userBots.map((bot) => (
                    <tr key={bot.id} className="hover:bg-[#161d2d]/35 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-200">{bot.name}</td>
                      <td className="py-3.5 px-6 font-mono text-slate-400 text-xs">{bot.id}</td>
                      <td className="py-3.5 px-6 font-mono text-slate-300 text-xs">{bot.balance}</td>
                      <td className="py-3.5 px-6">
                        <span className={`font-mono text-xs font-semibold ${
                          bot.pl24h > 0 ? 'text-emerald-400' : bot.pl24h < 0 ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {bot.pl24h > 0 ? `+${bot.pl24h}` : bot.pl24h}%
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                          bot.status === 'ACTIVE'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {bot.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          id={`toggle-bot-${bot.id}`}
                          onClick={() => onToggleBot(bot.id)}
                          className="text-slate-400 hover:text-white inline-flex items-center gap-1 bg-[#1c2333] hover:bg-[#252f44] px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border border-[#2a354d]"
                        >
                          {bot.status === 'ACTIVE' ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                          <span>{bot.status === 'ACTIVE' ? 'Pause' : 'Start'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 text-xs font-mono">
                      No active bot strategies running.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CU History Tab */}
        {activeTab === 'cu_history' && (
          <div className="overflow-x-auto" id="profile-history-tab">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-405 border-b border-[#1e2638]">
                  <th className="py-3 px-6 font-semibold uppercase">ID</th>
                  <th className="py-3 px-6 font-semibold uppercase">Timestamp</th>
                  <th className="py-3 px-6 font-semibold uppercase">Adjustment Type</th>
                  <th className="py-3 px-6 font-semibold uppercase">Amount</th>
                  <th className="py-3 px-6 font-semibold uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-sm font-mono">
                {cuHistory && cuHistory.length > 0 ? (
                  cuHistory.map((hist) => (
                    <tr key={hist.id} className="hover:bg-[#161d2d]/35 transition-colors">
                      <td className="py-3.5 px-6 text-slate-500 text-xs">{hist.id}</td>
                      <td className="py-3.5 px-6 text-slate-400 text-xs">{hist.timestamp}</td>
                      <td className="py-3.5 px-6">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          hist.type === 'ADJUST'
                            ? 'bg-blue-950/50 text-blue-400 border border-blue-500/10'
                            : hist.type === 'BONUS'
                            ? 'bg-purple-950/50 text-purple-400 border border-purple-500/10'
                            : hist.type === 'REFUND'
                            ? 'bg-teal-950/50 text-teal-400 border border-teal-500/10'
                            : 'bg-rose-950/50 text-rose-400 border border-rose-500/10'
                        }`}>
                          {hist.type}
                        </span>
                      </td>
                      <td className={`py-3.5 px-6 text-xs font-bold ${hist.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {hist.amount >= 0 ? `+${hist.amount.toLocaleString()}` : hist.amount.toLocaleString()} CU
                      </td>
                      <td className="py-3.5 px-6 text-slate-300 text-xs max-w-sm overflow-hidden text-overflow-ellipsis whitespace-nowrap">
                        {hist.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                      No CU History recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'api_keys' && (
          <div className="overflow-x-auto" id="profile-apikeys-tab">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-405 border-b border-[#1e2638]">
                  <th className="py-3 px-6 font-semibold uppercase">API NAME</th>
                  <th className="py-3 px-6 font-semibold uppercase">EXCHANGE</th>
                  <th className="py-3 px-6 font-semibold uppercase">KEY MASK</th>
                  <th className="py-3 px-6 font-semibold uppercase">CREATED ON</th>
                  <th className="py-3 px-6 font-semibold uppercase">STATUS STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-sm">
                {apiKeys && apiKeys.length > 0 ? (
                  apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-[#161d2d]/35 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-200 flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{key.name}</span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-300 text-xs font-mono">{key.exchange}</td>
                      <td className="py-3.5 px-6 text-slate-400 text-xs font-mono uppercase tracking-wide">{key.keyMask}</td>
                      <td className="py-3.5 px-6 text-slate-400 text-xs font-mono">{key.created}</td>
                      <td className="py-3.5 px-6">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                          key.status === 'ACTIVE'
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-950/40 text-rose-400 border border-rose-500/20 animate-pulse'
                        }`}>
                          {key.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 text-xs font-mono">
                      No API keys registered for this login.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="overflow-x-auto" id="profile-payments-tab">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-405 border-b border-[#1e2638]">
                  <th className="py-3 px-6 font-semibold uppercase">Tx ID</th>
                  <th className="py-3 px-6 font-semibold uppercase">Payment Date</th>
                  <th className="py-3 px-6 font-semibold uppercase">Amount Paid</th>
                  <th className="py-3 px-6 font-semibold uppercase">CU Credited</th>
                  <th className="py-3 px-6 font-semibold uppercase">Method</th>
                  <th className="py-3 px-6 font-semibold uppercase">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-sm font-mono">
                {payments && payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#161d2d]/35 transition-colors">
                      <td className="py-3.5 px-6 text-slate-500 text-xs">{p.id}</td>
                      <td className="py-3.5 px-6 text-slate-400 text-xs">{p.timestamp}</td>
                      <td className="py-3.5 px-6 text-slate-300 font-semibold">${p.amountUsd.toFixed(2)}</td>
                      <td className="py-3.5 px-6 text-blue-400 font-bold">+{p.cuCredited.toLocaleString()} CU</td>
                      <td className="py-3.5 px-6 text-slate-450 text-xs">{p.method}</td>
                      <td className="py-3.5 px-6">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.status === 'SUCCESS'
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                            : p.status === 'PENDING'
                            ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                      No payment deposits recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === 'referrals' && referrals && (
          <div className="p-6 space-y-6" id="profile-referrals-tab">
            {/* Referral overview stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#1c2333] border border-[#2a354d] rounded-lg p-3.5 text-center">
                <span className="text-[10px] text-slate-505 font-mono uppercase block mb-1">PROMO CODE</span>
                <span className="text-sm font-mono font-bold text-blue-400 select-all">{referrals.referralCode}</span>
              </div>
              <div className="bg-[#1c2333] border border-[#2a354d] rounded-lg p-3.5 text-center">
                <span className="text-[10px] text-slate-505 font-mono uppercase block mb-1">Total Clicks</span>
                <span className="text-lg font-mono font-bold text-white">{referrals.clicks}</span>
              </div>
              <div className="bg-[#1c2333] border border-[#2a354d] rounded-lg p-3.5 text-center">
                <span className="text-[10px] text-slate-505 font-mono uppercase block mb-1">Total Signups</span>
                <span className="text-lg font-mono font-bold text-white">{referrals.signups}</span>
              </div>
              <div className="bg-[#1c2333] border border-[#2a354d] rounded-lg p-3.5 text-center">
                <span className="text-[10px] text-slate-505 font-mono uppercase block mb-1">Referred Earnings</span>
                <span className="text-lg font-mono font-bold text-emerald-400">+{referrals.totalEarningsCu.toLocaleString()} CU</span>
              </div>
            </div>

            {/* Referred Users list */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4 text-purple-400" />
                referred networks ({referrals.referredUsers.length})
              </h4>
              <div className="border border-[#1e2638] rounded-xl overflow-hidden bg-[#0c101a]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#121824] text-[10px] font-mono text-slate-405 border-b border-[#1e2638]">
                      <th className="py-2.5 px-4 font-semibold uppercase">REFERRED USER</th>
                      <th className="py-2.5 px-4 font-semibold uppercase">JOINED</th>
                      <th className="py-2.5 px-4 font-semibold uppercase">ACCOUNT ACTIVITY</th>
                      <th className="py-2.5 px-4 text-right font-semibold uppercase">BONUS EARNED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2638] text-xs font-mono">
                    {referrals.referredUsers.map((refUser) => (
                      <tr key={refUser.username} className="hover:bg-[#161d2d]/25 transition-colors">
                        <td className="py-3 px-4 text-slate-200 font-semibold">{refUser.username}</td>
                        <td className="py-3 px-4 text-slate-400">{refUser.joined}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            refUser.status === 'ACTIVE' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' : 'bg-slate-800 text-slate-505'
                          }`}>
                            {refUser.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">+{refUser.earningsCu} CU</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Bottom Log Panel: Admin Session Activity */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5" id="profile-admin-logs">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider font-mono text-slate-400">Admin Session Activity</h3>
        <div className="space-y-3 max-h-52 overflow-y-auto pr-1" id="profile-admin-logs-scroll">
          {adminActivities && adminActivities.length > 0 ? (
            adminActivities.map((log, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-2.5 border-b border-[#1e2638]/50 last:border-0 hover:bg-[#161d2d]/35 px-2 rounded transition-colors text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-505 whitespace-nowrap">{log.timestamp}</span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
                <span className="text-slate-500 font-semibold whitespace-nowrap ml-4">{log.admin}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs font-mono">
              No recent session logs recorded.
            </div>
          )}
        </div>
      </div>

      {/* Floating Modal Trigger for Balance Adjustments */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none" id="adjust-cu-modal-overlay">
          <div className="bg-[#121824] border border-[#2a354d] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in" id="adjust-cu-modal">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1e2638] bg-[#0c101a] flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Adjust Compute Units (CU)</h3>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4">
              <div className="bg-[#1c2333]/60 p-4 border border-[#1e2638] rounded-lg">
                <div className="text-xs text-slate-450 font-mono mb-1">Target Account</div>
                <div className="text-sm font-bold text-white">{user.name} ({user.username})</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">Current Balance: {user.cuBalance.toLocaleString()} CU</div>
              </div>

              {/* Adjustment Type Trigger buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustType('ADD');
                      setAdjustDescription('Credit Unit (CU) manual adjustment (Promo)');
                    }}
                    className={`py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      adjustType === 'ADD'
                        ? 'bg-emerald-600/15 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-800/80 border-[#1e2638] text-slate-400'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Credit CU</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustType('DEDUCT');
                      setAdjustDescription('Credit Unit (CU) manual adjustment (Debit Correction)');
                    }}
                    className={`py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      adjustType === 'DEDUCT'
                        ? 'bg-rose-600/15 border-rose-500 text-rose-400 font-bold'
                        : 'bg-slate-800/80 border-[#1e2638] text-slate-400'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Deduct CU</span>
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block" htmlFor="adjust-amount-input">Amount (Compute Units)</label>
                <div className="relative">
                  <input
                    id="adjust-amount-input"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full bg-[#1c2333] border border-[#1e2638] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="100.00"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 select-none">CU</span>
                </div>
              </div>

              {/* Description Reason input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block" htmlFor="adjust-desc-input">Adjustment Reason / Notes</label>
                <textarea
                  id="adjust-desc-input"
                  required
                  rows={2}
                  value={adjustDescription}
                  onChange={(e) => setAdjustDescription(e.target.value)}
                  className="w-full bg-[#1c2333] border border-[#1e2638] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                  placeholder="Reason for adjustment..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2638]" id="adjust-cu-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${
                    adjustType === 'ADD' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal X Icon (since we didn't import it on the main types but need it for modal close)
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2050/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
