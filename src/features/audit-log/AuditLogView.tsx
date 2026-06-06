import React, { useState } from 'react';
import { AdminActivity } from '../../types';

interface AuditLogProps {
  logs: AdminActivity[];
  onAddLog: (message: string) => void;
}

export default function AuditLogView({ logs, onAddLog }: AuditLogProps) {
  const [search, setSearch] = useState('');

  const filteredLogs = [...logs].reverse().filter((log) =>
    log.message.toLowerCase().includes(search.toLowerCase()) ||
    log.admin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" id="audit-log-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Audit Log</h2>
        <span className="text-xs font-mono text-slate-500 bg-[#121824] px-2.5 py-1.5 rounded-lg border border-[#1e2638] self-start sm:self-auto">
          System authorized sessions
        </span>
      </div>

      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-4">
        <input
          type="text"
          placeholder="Filter audit logs by Message, Admin, or IP Trigger..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 font-mono"
        />
      </div>

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
              {filteredLogs.map((log, index) => (
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
