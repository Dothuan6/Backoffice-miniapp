import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, Edit2, Cpu, Activity, ChevronDown, X, Check, Search, ArrowLeft, User, Zap, Hash } from 'lucide-react';
import { Agent, AiChatLog, AiModel } from '../../types';

interface AiMonitorViewProps {
  agents: Agent[];
  chatLogs: AiChatLog[];
  onUpdateAgent: (updated: Agent) => void;
}

const MODEL_OPTIONS: AiModel[] = [
  'claude-3-5-sonnet',
  'claude-3-haiku',
  'claude-3-opus',
  'gpt-4o',
  'gpt-4o-mini',
  'gemini-1.5-pro',
];

const MODEL_COLORS: Record<AiModel, string> = {
  'claude-3-5-sonnet': 'text-violet-400 bg-violet-950/40 border-violet-500/25',
  'claude-3-haiku':    'text-blue-400   bg-blue-950/40   border-blue-500/25',
  'claude-3-opus':     'text-amber-400  bg-amber-950/40  border-amber-500/25',
  'gpt-4o':            'text-emerald-400 bg-emerald-950/40 border-emerald-500/25',
  'gpt-4o-mini':       'text-teal-400   bg-teal-950/40   border-teal-500/25',
  'gemini-1.5-pro':    'text-sky-400    bg-sky-950/40    border-sky-500/25',
};

export default function AiMonitorView({ agents, chatLogs, onUpdateAgent }: AiMonitorViewProps) {
  const [activeTab, setActiveTab] = useState<'agents' | 'logs'>('agents');
  const [editingAgent, setEditingAgent]   = useState<Agent | null>(null);
  const [selectedLog, setSelectedLog]     = useState<AiChatLog | null>(null);
  const [filterAgent, setFilterAgent]     = useState('ALL');
  const [draftPrompt, setDraftPrompt]     = useState('');
  const [draftModel, setDraftModel]       = useState<AiModel>('claude-3-5-sonnet');
  const [saved, setSaved]                 = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [modelSearch, setModelSearch]     = useState('');
  const dropdownRef                       = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
        setModelSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setDraftPrompt(agent.systemPrompt);
    setDraftModel(agent.model);
    setSaved(false);
  };

  const handleSave = () => {
    if (!editingAgent) return;
    onUpdateAgent({ ...editingAgent, systemPrompt: draftPrompt, model: draftModel });
    setSaved(true);
    setTimeout(() => { setEditingAgent(null); setSaved(false); }, 800);
  };

  const filteredLogs = filterAgent === 'ALL'
    ? chatLogs
    : chatLogs.filter(l => l.agentId === filterAgent);

  const totalCu    = chatLogs.reduce((s, l) => s + l.cuCost, 0);
  const totalCalls = chatLogs.length;

  return (
    <div className="space-y-6" id="ai-monitor-view">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">AI Monitor</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-[#121824] px-3 py-1.5 rounded-lg border border-[#1e2638]">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {agents.filter(a => a.status === 'ACTIVE').length} agents running
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents',    value: agents.length.toString(),                                 color: 'text-white'       },
          { label: 'Active Agents',   value: agents.filter(a => a.status === 'ACTIVE').length.toString(), color: 'text-emerald-400' },
          { label: 'Total Calls',     value: totalCalls.toLocaleString(),                               color: 'text-white'       },
          { label: 'CU Consumed',     value: `${totalCu.toFixed(1)} CU`,                               color: 'text-blue-400'    },
        ].map(c => (
          <div key={c.label} className="bg-[#121824] border border-[#1e2638] rounded-xl p-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">{c.label}</span>
            <span className={`text-xl font-display font-bold ${c.color}`}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1e2638] flex gap-0">
        {([
          { id: 'agents', label: 'Agents', icon: <Bot className="w-3.5 h-3.5" /> },
          { id: 'logs',   label: 'Conversation Logs', icon: <MessageSquare className="w-3.5 h-3.5" /> },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === t.id
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── AGENTS TAB ───────────────────────────────────────────────────────── */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          {agents.map(agent => (
            <div key={agent.id} className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                    agent.status === 'ACTIVE'
                      ? 'bg-violet-500/10 border-violet-500/30'
                      : 'bg-slate-800 border-slate-700'
                  }`}>
                    <Bot className={`w-4 h-4 ${agent.status === 'ACTIVE' ? 'text-violet-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{agent.name}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        agent.status === 'ACTIVE'
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>{agent.status}</span>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border font-mono ${MODEL_COLORS[agent.model]}`}>
                        {agent.model}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{agent.description}</p>
                  </div>
                </div>

                {/* Stats + Edit */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(agent)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600/10 border border-violet-500/30 text-violet-400 hover:bg-violet-600/20 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                    <span><span className="text-slate-300">{agent.totalCalls.toLocaleString()}</span> calls</span>
                    <span><span className="text-blue-400">{agent.totalCuSpent.toLocaleString()}</span> CU</span>
                  </div>
                </div>
              </div>

              {/* System prompt preview */}
              <div className="mt-4 pt-4 border-t border-[#1e2638]">
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-2">System Prompt</div>
                <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed bg-[#0c101a] border border-[#1e2638] rounded-lg p-3 max-h-28 overflow-y-auto">
                  {agent.systemPrompt}
                </pre>
              </div>

              {/* Footer meta */}
              <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-600">
                <span>ID: {agent.id}</span>
                <span>Last active: {agent.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CONVERSATION LOGS TAB ────────────────────────────────────────────── */}
      {activeTab === 'logs' && !selectedLog && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono">Filter by agent:</span>
            <button
              onClick={() => setFilterAgent('ALL')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold border cursor-pointer transition-all ${
                filterAgent === 'ALL'
                  ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                  : 'bg-[#121824] border-[#1e2638] text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL ({chatLogs.length})
            </button>
            {agents.map(a => (
              <button
                key={a.id}
                onClick={() => setFilterAgent(a.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold border cursor-pointer transition-all ${
                  filterAgent === a.id
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-[#121824] border-[#1e2638] text-slate-400 hover:text-slate-200'
                }`}
              >
                {a.name} ({chatLogs.filter(l => l.agentId === a.id).length})
              </button>
            ))}
          </div>

          {/* Log list table */}
          <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0c101a] text-[9px] font-mono tracking-wider text-slate-500 border-b border-[#1e2638]">
                    <th className="py-3 px-5 font-semibold uppercase">Log ID</th>
                    <th className="py-3 px-5 font-semibold uppercase">User</th>
                    <th className="py-3 px-5 font-semibold uppercase">Agent</th>
                    <th className="py-3 px-5 font-semibold uppercase">Model</th>
                    <th className="py-3 px-5 font-semibold uppercase">Question</th>
                    <th className="py-3 px-5 font-semibold uppercase">Tokens</th>
                    <th className="py-3 px-5 font-semibold uppercase">CU Cost</th>
                    <th className="py-3 px-5 font-semibold uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2638]">
                  {filteredLogs.map(log => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-[#161d2d]/35 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-5 text-slate-500 text-xs font-mono">{log.id}</td>
                      <td className="py-3 px-5 text-blue-400 text-xs font-semibold">{log.username}</td>
                      <td className="py-3 px-5 text-slate-300 text-xs">{log.agentName}</td>
                      <td className="py-3 px-5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border font-mono ${MODEL_COLORS[log.model]}`}>
                          {log.model}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-slate-400 text-xs max-w-xs truncate">{log.question}</td>
                      <td className="py-3 px-5 text-slate-400 text-xs font-mono">{log.inputTokens + log.outputTokens}</td>
                      <td className="py-3 px-5 text-blue-400 text-xs font-mono font-semibold">{log.cuCost} CU</td>
                      <td className="py-3 px-5 text-slate-500 text-xs font-mono whitespace-nowrap">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── LOG DETAIL PAGE ──────────────────────────────────────────────────── */}
      {activeTab === 'logs' && selectedLog && (
        <div className="space-y-5">
          {/* Back breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <button
              onClick={() => setSelectedLog(null)}
              className="hover:text-violet-400 cursor-pointer font-semibold flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Logs
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-violet-400">{selectedLog.id}</span>
          </div>

          {/* Detail grid: meta cards + conversation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: conversation (2/3) */}
            <div className="lg:col-span-2 space-y-4">
              {/* AI Answer — left aligned */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-violet-300">{selectedLog.agentName}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border font-mono ${MODEL_COLORS[selectedLog.model]}`}>
                      {selectedLog.model}
                    </span>
                  </div>
                  <div className="bg-[#1a2133] border border-violet-500/15 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{selectedLog.answer}</p>
                  </div>
                </div>
              </div>

              {/* User Question — right aligned */}
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">{selectedLog.timestamp}</span>
                    <span className="text-xs font-semibold text-blue-400">{selectedLog.username}</span>
                  </div>
                  <div className="bg-blue-600/15 border border-blue-500/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[90%]">
                    <p className="text-sm text-slate-200 leading-relaxed">{selectedLog.question}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: detail cards (1/3) */}
            <div className="flex flex-col gap-4">
              {/* Log info */}
              <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-3.5">
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-1 flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Log Info
                </div>
                {[
                  { label: 'Log ID',    value: selectedLog.id },
                  { label: 'User',      value: selectedLog.username,  color: 'text-blue-400' },
                  { label: 'Agent',     value: selectedLog.agentName },
                  { label: 'Timestamp', value: selectedLog.timestamp },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-start gap-3 text-xs font-mono">
                    <span className="text-slate-500 shrink-0">{r.label}</span>
                    <span className={`text-right ${r.color ?? 'text-slate-200'} break-all`}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Token & CU breakdown */}
              <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-3.5">
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-1 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Usage & Cost
                </div>
                {[
                  { label: 'Model',          value: selectedLog.model,                           color: MODEL_COLORS[selectedLog.model].split(' ')[0] },
                  { label: 'Input Tokens',   value: `${selectedLog.inputTokens} tok` },
                  { label: 'Output Tokens',  value: `${selectedLog.outputTokens} tok` },
                  { label: 'Total Tokens',   value: `${selectedLog.inputTokens + selectedLog.outputTokens} tok`, color: 'text-white font-bold' },
                  { label: 'CU Cost',        value: `${selectedLog.cuCost} CU`,                  color: 'text-blue-400 font-bold' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center gap-3 text-xs font-mono">
                    <span className="text-slate-500 shrink-0">{r.label}</span>
                    <span className={r.color ?? 'text-slate-200'}>{r.value}</span>
                  </div>
                ))}
                {/* CU visual bar */}
                <div className="pt-1">
                  <div className="flex justify-between text-[9px] font-mono text-slate-600 mb-1">
                    <span>Input ratio</span>
                    <span>{Math.round((selectedLog.inputTokens / (selectedLog.inputTokens + selectedLog.outputTokens)) * 100)}% / {Math.round((selectedLog.outputTokens / (selectedLog.inputTokens + selectedLog.outputTokens)) * 100)}% Output</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-blue-500 rounded-l-full"
                      style={{ width: `${(selectedLog.inputTokens / (selectedLog.inputTokens + selectedLog.outputTokens)) * 100}%` }}
                    />
                    <div className="h-full bg-violet-500 flex-1 rounded-r-full" />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-600 mt-1">
                    <span className="text-blue-400">■ Input</span>
                    <span className="text-violet-400">■ Output</span>
                  </div>
                </div>
              </div>

              {/* Agent info */}
              <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-3">
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-1 flex items-center gap-2">
                  <Bot className="w-3 h-3" /> Agent
                </div>
                {(() => {
                  const agent = agents.find(a => a.id === selectedLog.agentId);
                  if (!agent) return <span className="text-xs text-slate-500">Agent not found</span>;
                  return (
                    <>
                      <div className="text-xs font-semibold text-white">{agent.name}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{agent.description}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#1e2638]">
                        <span>{agent.totalCalls.toLocaleString()} total calls</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${agent.status === 'ACTIVE' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{agent.status}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT AGENT MODAL ─────────────────────────────────────────────────── */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121824] border border-[#2a354d] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2638] bg-[#0c101a] shrink-0">
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Edit Agent — {editingAgent.name}</h3>
              </div>
              <button onClick={() => setEditingAgent(null)} className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto flex-1">
              {/* Model selector — searchable dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
                  <Cpu className="w-3 h-3 inline mr-1.5" />Model
                </label>
                <div className="relative" ref={dropdownRef}>
                  {/* Trigger */}
                  <button
                    type="button"
                    onClick={() => { setModelDropdownOpen(o => !o); setModelSearch(''); }}
                    className="w-full flex items-center justify-between gap-3 bg-[#0c101a] border border-[#1e2638] hover:border-violet-500/40 rounded-lg px-4 py-2.5 transition-colors cursor-pointer focus:outline-none focus:border-violet-500/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${MODEL_COLORS[draftModel]}`}>
                        {draftModel}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${modelDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown panel */}
                  {modelDropdownOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-[#121824] border border-[#2a354d] rounded-xl shadow-2xl overflow-hidden">
                      {/* Search input */}
                      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#1e2638]">
                        <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <input
                          autoFocus
                          type="text"
                          value={modelSearch}
                          onChange={e => setModelSearch(e.target.value)}
                          placeholder="Search model..."
                          className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                        />
                        {modelSearch && (
                          <button onClick={() => setModelSearch('')} className="text-slate-600 hover:text-slate-400 cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Options list */}
                      <div className="py-1 max-h-48 overflow-y-auto">
                        {MODEL_OPTIONS.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase())).length === 0 ? (
                          <div className="px-4 py-3 text-xs font-mono text-slate-500 text-center">No models found</div>
                        ) : (
                          MODEL_OPTIONS.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase())).map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => { setDraftModel(m); setModelDropdownOpen(false); setModelSearch(''); }}
                              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer hover:bg-[#1c2333] ${
                                draftModel === m ? 'bg-[#1c2333]' : ''
                              }`}
                            >
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${MODEL_COLORS[m]}`}>
                                {m}
                              </span>
                              {draftModel === m && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* System prompt editor */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
                  <Activity className="w-3 h-3 inline mr-1.5" />System Prompt
                </label>
                <textarea
                  value={draftPrompt}
                  onChange={e => setDraftPrompt(e.target.value)}
                  rows={12}
                  className="w-full bg-[#0c101a] border border-[#1e2638] rounded-lg px-4 py-3 text-[12px] font-mono text-slate-200 focus:outline-none focus:border-violet-500/60 leading-relaxed resize-none"
                  placeholder="Enter system prompt..."
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-600">
                  <span>Characters: {draftPrompt.length}</span>
                  <span>~{Math.ceil(draftPrompt.length / 4)} tokens</span>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#1e2638] shrink-0">
              <button
                onClick={() => setEditingAgent(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white transition-all cursor-pointer ${
                  saved ? 'bg-emerald-600' : 'bg-violet-600 hover:bg-violet-500'
                }`}
              >
                {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
