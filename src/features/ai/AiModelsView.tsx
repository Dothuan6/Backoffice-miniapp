import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { AiSupportModel } from '../../types';

interface AiModelsViewProps {
  models: AiSupportModel[];
  onAdd: (m: AiSupportModel) => void;
  onUpdate: (m: AiSupportModel) => void;
  onDelete: (id: string) => void;
}

const PROVIDER_COLORS: Record<string, string> = {
  Anthropic: 'bg-violet-950/40 text-violet-300 border-violet-500/25',
  OpenAI:    'bg-emerald-950/40 text-emerald-300 border-emerald-500/25',
  Google:    'bg-blue-950/40 text-blue-300 border-blue-500/25',
};

const emptyModel = (): Omit<AiSupportModel, 'id' | 'addedDate'> => ({
  name: '',
  provider: 'Anthropic',
  modelId: '',
  apiKey: '',
  apiEndpoint: '',
  status: 'ACTIVE',
});

export default function AiModelsView({ models, onAdd, onUpdate, onDelete }: AiModelsViewProps) {
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState<AiSupportModel | null>(null);
  const [draft, setDraft]             = useState(emptyModel());
  const [showKey, setShowKey]         = useState<Record<string, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved]             = useState(false);

  const openAdd = () => {
    setEditing(null);
    setDraft(emptyModel());
    setSaved(false);
    setModalOpen(true);
  };

  const openEdit = (m: AiSupportModel) => {
    setEditing(m);
    setDraft({ name: m.name, provider: m.provider, modelId: m.modelId, apiKey: m.apiKey, apiEndpoint: m.apiEndpoint, status: m.status });
    setSaved(false);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!draft.name || !draft.modelId || !draft.apiKey || !draft.apiEndpoint) return;
    if (editing) {
      onUpdate({ ...editing, ...draft });
    } else {
      onAdd({
        ...draft,
        id: `asm-${Date.now()}`,
        addedDate: new Date().toISOString().split('T')[0],
      });
    }
    setSaved(true);
    setTimeout(() => { setModalOpen(false); setSaved(false); }, 700);
  };

  const toggleStatus = (m: AiSupportModel) => {
    onUpdate({ ...m, status: m.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' });
  };

  const maskKey = (key: string) => {
    const parts = key.split('...');
    if (parts.length === 2) return `${parts[0].slice(0, 12)}...${parts[1]}`;
    return key.slice(0, 8) + '••••••••••••' + key.slice(-4);
  };

  return (
    <div className="space-y-6" id="ai-models-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">AI Support Models</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Manage AI model providers, API keys and endpoints</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Model
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total',    value: models.length,                               color: 'text-white' },
          { label: 'Active',   value: models.filter(m => m.status === 'ACTIVE').length,   color: 'text-emerald-400' },
          { label: 'Inactive', value: models.filter(m => m.status === 'INACTIVE').length, color: 'text-slate-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#121824] border border-[#1e2638] rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase">{s.label}</span>
            <span className={`text-sm font-mono font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0c101a] text-[9px] font-mono tracking-wider text-slate-500 border-b border-[#1e2638]">
                <th className="py-3 px-5 font-semibold uppercase">Name</th>
                <th className="py-3 px-5 font-semibold uppercase">Provider</th>
                <th className="py-3 px-5 font-semibold uppercase">Model ID</th>
                <th className="py-3 px-5 font-semibold uppercase">API Key</th>
                <th className="py-3 px-5 font-semibold uppercase">API Endpoint</th>
                <th className="py-3 px-5 font-semibold uppercase">Added</th>
                <th className="py-3 px-5 font-semibold uppercase">Status</th>
                <th className="py-3 px-5 text-right font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638] text-sm font-mono">
              {models.map(m => (
                <tr key={m.id} className="hover:bg-[#161d2d]/25 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-200">{m.name}</td>
                  <td className="py-3.5 px-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PROVIDER_COLORS[m.provider] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {m.provider}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400 text-xs">{m.modelId}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs tracking-wider">
                        {showKey[m.id] ? m.apiKey : maskKey(m.apiKey)}
                      </span>
                      <button
                        onClick={() => setShowKey(p => ({ ...p, [m.id]: !p[m.id] }))}
                        className="text-slate-600 hover:text-slate-300 transition-colors cursor-pointer"
                        title={showKey[m.id] ? 'Hide key' : 'Show key'}
                      >
                        {showKey[m.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 text-xs max-w-xs truncate">{m.apiEndpoint}</td>
                  <td className="py-3.5 px-5 text-slate-600 text-xs">{m.addedDate}</td>
                  <td className="py-3.5 px-5">
                    <button
                      onClick={() => toggleStatus(m)}
                      className="flex items-center gap-1.5 cursor-pointer group"
                      title="Toggle status"
                    >
                      {m.status === 'ACTIVE' ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                          <span className="text-[10px] font-bold text-emerald-400 group-hover:text-emerald-300">ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300">INACTIVE</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(m)}
                        className="w-7 h-7 rounded-lg bg-[#1c2333] border border-[#2a354d] flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(m.id)}
                        className="w-7 h-7 rounded-lg bg-[#1c2333] border border-[#2a354d] flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {models.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">No models configured. Click "Add Model" to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121824] border border-[#2a354d] rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2638] bg-[#0c101a] shrink-0">
              <h3 className="text-sm font-bold text-white">{editing ? 'Edit Model' : 'Add New Model'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Name</label>
                <input
                  value={draft.name}
                  onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Claude 3.5 Sonnet"
                  className="w-full bg-[#0c101a] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500/60"
                />
              </div>
              {/* Provider */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Provider</label>
                <select
                  value={draft.provider}
                  onChange={e => setDraft(p => ({ ...p, provider: e.target.value }))}
                  className="w-full bg-[#0c101a] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500/60 cursor-pointer"
                >
                  {['Anthropic', 'OpenAI', 'Google', 'Mistral', 'Cohere', 'Other'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              {/* Model ID */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Model ID</label>
                <input
                  value={draft.modelId}
                  onChange={e => setDraft(p => ({ ...p, modelId: e.target.value }))}
                  placeholder="e.g. claude-3-5-sonnet-20241022"
                  className="w-full bg-[#0c101a] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500/60"
                />
              </div>
              {/* API Key */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">API Key</label>
                <input
                  type="password"
                  value={draft.apiKey}
                  onChange={e => setDraft(p => ({ ...p, apiKey: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full bg-[#0c101a] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500/60"
                />
              </div>
              {/* API Endpoint */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">API Endpoint</label>
                <input
                  value={draft.apiEndpoint}
                  onChange={e => setDraft(p => ({ ...p, apiEndpoint: e.target.value }))}
                  placeholder="https://api.example.com/v1/..."
                  className="w-full bg-[#0c101a] border border-[#1e2638] rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500/60"
                />
              </div>
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Status</label>
                <div className="flex gap-3">
                  {(['ACTIVE', 'INACTIVE'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDraft(p => ({ ...p, status: s }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        draft.status === s
                          ? s === 'ACTIVE'
                            ? 'bg-emerald-600/15 border-emerald-500 text-emerald-400'
                            : 'bg-slate-700/40 border-slate-500 text-slate-300'
                          : 'bg-[#1c2333] border-[#2a354d] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#1e2638] shrink-0">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!draft.name || !draft.modelId || !draft.apiKey || !draft.apiEndpoint}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  saved ? 'bg-emerald-600' : 'bg-violet-600 hover:bg-violet-500'
                }`}
              >
                {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : editing ? 'Save Changes' : 'Add Model'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121824] border border-[#2a354d] rounded-xl w-full max-w-sm shadow-2xl">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Delete Model</h3>
              </div>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                Are you sure? This will remove the model and its API key configuration. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
