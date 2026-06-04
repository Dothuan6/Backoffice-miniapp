import React, { useState } from 'react';
import { ScrollText, Settings, ShieldAlert, Check, RefreshCw, Key, ToggleLeft, ToggleRight, Radio, Landmark, AlertTriangle } from 'lucide-react';
import { AdminActivity } from '../types';



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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Audit Log</h2>
        <span className="text-xs font-mono text-slate-500 bg-[#121824] px-2.5 py-1.5 rounded-lg border border-[#1e2638] self-start sm:self-auto">System authorized sessions</span>
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
        <div className="overflow-x-auto">
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
    </div>
  );
}

/* ============================================================================
   3. SETTINGS VIEW
   ============================================================================ */
interface SettingsViewProps {
  onAddLog: (message: string) => void;
}

export function SettingsView({ onAddLog }: SettingsViewProps) {
  const [publicIp, setPublicIp] = useState('188.166.42.102');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidIp = (ip: string) => {
    const ipv4Regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!publicIp.trim()) {
      setErrorMsg('Public IP address cannot be empty.');
      return;
    }
    if (!isValidIp(publicIp.trim())) {
      setErrorMsg('Invalid IP address format. Please enter a valid IPv4 or IPv6 address.');
      return;
    }

    setIsSaved(true);
    onAddLog(`Updated system public IP configuration: ${publicIp.trim()}`);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6" id="settings-view">
      <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">System Settings</h2>

      <div className="max-w-xl">
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-6 space-y-4 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-350 uppercase tracking-wider font-mono">Public IP Configuration</h3>
          <p className="text-xs text-slate-450 leading-relaxed font-sans">
            Specify the static public IP address of the node server. This IP is used to establish whitelist rules on exchange API gateways and secure RPC container endpoints.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
            {errorMsg && (
              <div className="bg-[#2c1414] border border-red-500/20 text-red-400 px-3.5 py-2.5 rounded-lg text-xs font-sans flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300" htmlFor="public-ip-input">
                Server Public IP
              </label>
              <input
                id="public-ip-input"
                type="text"
                value={publicIp}
                onChange={(e) => setPublicIp(e.target.value)}
                placeholder="e.g. 188.166.42.102"
                className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-blue-500 font-mono transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors cursor-pointer shadow-md"
              >
                Save Configuration
              </button>
            </div>
          </form>

          {isSaved && (
            <div className="bg-[#14232c] text-teal-400 border border-teal-505/20 px-3.5 py-2.5 rounded-lg text-[11px] font-mono flex items-center gap-2">
              <Check className="w-3.5 h-3.5" /> Public IP updated successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
