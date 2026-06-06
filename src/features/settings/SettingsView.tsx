import React, { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  onAddLog: (message: string) => void;
}

const IPV4_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
const IPV6_REGEX = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

function isValidIpAddress(ip: string): boolean {
  return IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip);
}

export default function SettingsView({ onAddLog }: SettingsViewProps) {
  const [publicIp, setPublicIp] = useState('188.166.42.102');
  const [isSaved, setIsSaved]   = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!publicIp.trim()) {
      setErrorMsg('Public IP address cannot be empty.');
      return;
    }
    if (!isValidIpAddress(publicIp.trim())) {
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
          <h3 className="text-sm font-semibold text-slate-350 uppercase tracking-wider font-mono">
            Public IP Configuration
          </h3>
          <p className="text-xs text-slate-450 leading-relaxed font-sans">
            Specify the static public IP address of the node server. This IP is used to establish whitelist
            rules on exchange API gateways and secure RPC container endpoints.
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
