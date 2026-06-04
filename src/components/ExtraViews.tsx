import React, { useState } from 'react';
import { Share2, ScrollText, Settings, ShieldAlert, Check, RefreshCw, Key, ToggleLeft, ToggleRight, Radio, Landmark, UserPlus, Coins, Percent } from 'lucide-react';
import { AdminActivity } from '../types';

/* ============================================================================
   1. AFFILIATE VIEW
   ============================================================================ */
interface AffiliateProps {
  referralStatsSummary: {
    code: string;
    totalEarningsUsd: number;
    commissionRate: number;
    clicks: number;
    signups: number;
  };
}

export function AffiliateView({ referralStatsSummary }: AffiliateProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralStatsSummary.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="affiliate-view">
      <h2 className="text-2xl font-display font-medium text-white tracking-tight">Affiliate Program</h2>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 text-center">
          <UserPlus className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <span className="text-[10px] text-slate-500 font-mono uppercase block">Total Signups</span>
          <span className="text-2xl font-display font-bold text-white font-mono">{referralStatsSummary.signups}</span>
        </div>
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 text-center">
          <Coins className="w-5 h-5 text-emerald-450 mx-auto mb-2" />
          <span className="text-[10px] text-slate-505 font-mono uppercase block">Total Earnings</span>
          <span className="text-2xl font-display font-bold text-emerald-400 font-mono">${referralStatsSummary.totalEarningsUsd.toLocaleString()}</span>
        </div>
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 text-center">
          <Percent className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <span className="text-[10px] text-slate-505 font-mono uppercase block">Commission Rate</span>
          <span className="text-2xl font-display font-bold text-cyan-400 font-mono">{referralStatsSummary.commissionRate}%</span>
        </div>
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 text-center">
          <Share2 className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <span className="text-[10px] text-slate-505 font-mono uppercase block">Total Link Clicks</span>
          <span className="text-2xl font-display font-bold text-purple-400 font-mono">{referralStatsSummary.clicks}</span>
        </div>
      </div>

      {/* Share Link card */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">YOUR UNIQUE REFERRAL CODE</h3>
        <p className="text-xs text-slate-400 max-w-xl">
          Invite other high-frequency traders or bot masters to QuantAdmin. Earn {referralStatsSummary.commissionRate}% lifetime recurring commissions on all Compute Unit (CU) snapshot deposit purchases.
        </p>

        <div className="flex max-w-sm">
          <div className="bg-[#0c101a] border border-[#1e2638] border-r-0 rounded-l-lg px-4 py-2.5 flex-1 font-mono text-sm text-blue-400 font-bold tracking-widest select-all flex items-center">
            {referralStatsSummary.code}
          </div>
          <button
            onClick={handleCopyCode}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 text-xs uppercase tracking-wide rounded-r-lg transition-colors cursor-pointer shrink-0"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. AUDIT LOG VIEW
   ============================================================================ */
interface AuditLogProps {
  logs: AdminActivity[];
  onAddLog: (message: string) => void;
}

export function AuditLogView({ logs, onAddLog }: AuditLogProps) {
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log) => {
    return (
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.admin.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6" id="audit-log-view">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-medium text-white tracking-tight">Audit Log</h2>
        <span className="text-xs font-mono text-slate-500 bg-[#121824] px-2.5 py-1.5 rounded-lg border border-[#1e2638]">System authorized sessions</span>
      </div>

      {/* Searching toolbar */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-4">
        <input
          type="text"
          placeholder="Filter audit logs by Message, Admin, or IP Trigger..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 font-mono"
        />
      </div>

      {/* Main logs list */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-[#0c101a] border-b border-[#1e2638] text-[9px] text-slate-405 tracking-wider uppercase select-none">
              <th className="py-3 px-6 font-semibold">Timestamp</th>
              <th className="py-3 px-6 font-semibold">Event Message</th>
              <th className="py-3 px-6 font-semibold text-right">Executor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2638] text-[11px] text-slate-300">
            {filteredLogs.reverse().map((log, index) => (
              <tr key={index} className="hover:bg-[#161d2d]/25 transition-colors">
                <td className="py-3 px-6 text-slate-500 shrink-0 select-none">{log.timestamp}</td>
                <td className="py-3 px-6 text-slate-200">{log.message}</td>
                <td className="py-3 px-6 text-right font-semibold text-slate-455">{log.admin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================================
   3. SETTINGS VIEW
   ============================================================================ */
export function SettingsView() {
  const [debugMode, setDebugMode] = useState(true);
  const [latencyTolerance, setLatencyTolerance] = useState(500);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6" id="settings-view">
      <h2 className="text-2xl font-display font-medium text-white tracking-tight">System Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Settings card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">QuantAdmin Configurations</h3>

          {/* Debug mode toggle */}
          <div className="flex items-center justify-between py-2 border-b border-[#1e2638]/50">
            <div>
              <div className="text-xs font-semibold text-slate-200">Global Mutation Logs</div>
              <div className="text-[10px] text-slate-501 mt-0.5">Publish all state adjustments to Telegram webhooks</div>
            </div>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {debugMode ? (
                <ToggleRight className="w-8 h-8 text-blue-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
          </div>

          {/* Latency Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-200" htmlFor="latency-slider">Max SLA Latency Threshold</label>
              <span className="text-xs font-mono text-blue-400 font-bold">{latencyTolerance} ms</span>
            </div>
            <input
              id="latency-slider"
              type="range"
              min="100"
              max="2000"
              step="50"
              value={latencyTolerance}
              onChange={(e) => setLatencyTolerance(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer tracking-normal"
            />
            <div className="text-[10px] text-slate-500 font-mono">Triggers ANOMALY flags if response drops below SLA</div>
          </div>

          {/* Save button */}
          <div className="pt-3 border-t border-[#1e2638]">
            <button
              onClick={handleSaveSettings}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
            >
              Save Configurations
            </button>
          </div>

          {isSaved && (
            <div className="bg-[#14232c] text-teal-400 border border-teal-505/20 px-3 py-2 rounded-lg text-[11px] font-mono flex items-center gap-2 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Settings updated successfully.
            </div>
          )}
        </div>

        {/* RPC connection health */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">RPC Node Connections</h3>

          <div className="space-y-3.5 text-xs font-mono">
            <div className="flex justify-between items-center bg-[#0c101a] border border-[#1e2638] p-3 rounded-lg">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Binance API Spot Node</span>
                <span className="text-[10px] text-slate-505">wss://stream.binance.com:9443</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-450 font-bold text-[10px]">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>12ms</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#0c101a] border border-[#1e2638] p-3 rounded-lg">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Kraken High Speed RPC</span>
                <span className="text-[10px] text-slate-505">wss://ws.kraken.com/perf</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-405 font-bold text-[10px]">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>45ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
