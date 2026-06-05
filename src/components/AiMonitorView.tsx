import React, { useState } from 'react';
import { Bot, MessageSquare, Edit2, Cpu, Activity, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { Agent, AiChatLog, AiModel } from '../types';

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
  const [expandedLog, setExpandedLog]     = useState<string | null>(null);
  const [filterAgent, setFilterAgent]     = useState('ALL');
  const [draftPrompt, setDraftPrompt]     = useState('');
  const [draftModel, setDraftModel]       = useState<AiModel>('claude-3-5-sonnet');
  const [saved, setSaved]                 = useState(false);

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
      {activeTab === 'logs' && (
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

          {/* Log list */}
          <div className="space-y-3">
            {filteredLogs.map(log => {
              const isExpanded = expandedLog === log.id;
              return (
                <div key={log.id} className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
                  {/* Header row */}
                  <button
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#161d2d]/35 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MessageSquare className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span className="text-xs font-semibold text-blue-400 shrink-0">{log.username}</span>
                      <span className="text-[9px] font-mono text-slate-600 shrink-0">→</span>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border font-mono shrink-0 ${MODEL_COLORS[log.model]}`}>
                        {log.agentName}
                      </span>
                      <span className="text-xs text-slate-400 truncate">{log.question}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
                        <span className="text-slate-500">{log.timestamp}</span>
                        <span className="text-blue-400 font-semibold">{log.cuCost} CU</span>
                        <span className="text-slate-600">{log.inputTokens + log.outputTokens} tok</span>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                        : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      }
                    </div>
                  </button>

                  {/* Expanded Q&A */}
                  {isExpanded && (
                    <div className="border-t border-[#1e2638] bg-[#0c101a]">
                      {/* Meta bar */}
                      <div className="flex flex-wrap items-center gap-4 px-5 py-2.5 border-b border-[#1e2638]/60 text-[10px] font-mono text-slate-500">
                        <span>Model: <span className={`font-semibold ${MODEL_COLORS[log.model].split(' ')[0]}`}>{log.model}</span></span>
                        <span>Input: <span className="text-slate-300">{log.inputTokens} tokens</span></span>
                        <span>Output: <span className="text-slate-300">{log.outputTokens} tokens</span></span>
                        <span>Cost: <span className="text-blue-400 font-bold">{log.cuCost} CU</span></span>
                        <span>Time: <span className="text-slate-400">{log.timestamp}</span></span>
                      </div>
                      {/* Q */}
                      <div className="px-5 py-3 border-b border-[#1e2638]/40">
                        <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-1.5">User</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{log.question}</p>
                      </div>
                      {/* A */}
                      <div className="px-5 py-3">
                        <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-violet-700 mb-1.5">Assistant</div>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{log.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
              {/* Model selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
                  <Cpu className="w-3 h-3 inline mr-1.5" />Model
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MODEL_OPTIONS.map(m => (
                    <button
                      key={m}
                      onClick={() => setDraftModel(m)}
                      className={`px-3 py-2 rounded-lg text-[11px] font-mono font-semibold border transition-all cursor-pointer text-left ${
                        draftModel === m
                          ? `${MODEL_COLORS[m]} ring-1 ring-violet-500/40`
                          : 'bg-[#1c2333] border-[#2a354d] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
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
