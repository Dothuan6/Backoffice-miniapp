import React, { useState } from 'react';
import { Plus, Search, ExternalLink, Edit2, Trash2, Globe, Check, AlertTriangle, X, BookOpen } from 'lucide-react';
import { Exchange } from '../types';

interface ExchangesViewProps {
  exchanges: Exchange[];
  setExchanges: React.Dispatch<React.SetStateAction<Exchange[]>>;
  onAddLog: (message: string) => void;
}

export default function ExchangesView({
  exchanges,
  setExchanges,
  onAddLog
}: ExchangesViewProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExchange, setEditingExchange] = useState<Exchange | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [formGuideUrl, setFormGuideUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Filter exchanges
  const filteredExchanges = exchanges.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingExchange(null);
    setFormName('');
    setFormImage('');
    setFormStatus('ACTIVE');
    setFormGuideUrl('');
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (ex: Exchange) => {
    setEditingExchange(ex);
    setFormName(ex.name);
    setFormImage(ex.image);
    setFormStatus(ex.status);
    setFormGuideUrl(ex.guideUrl);
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Exchange name is required');
      return;
    }
    if (!formImage.trim()) {
      setFormError('Exchange image URL is required');
      return;
    }
    if (!formGuideUrl.trim()) {
      setFormError('Guide link URL is required');
      return;
    }

    // Basic URL validation
    try {
      new URL(formGuideUrl);
    } catch (_) {
      setFormError('API Connection Guide Link must be a valid URL (e.g. https://example.com)');
      return;
    }

    try {
      new URL(formImage);
    } catch (_) {
      if (!formImage.startsWith('/') && !formImage.startsWith('http://') && !formImage.startsWith('https://')) {
        setFormError('Image link must be a valid URL or relative path');
        return;
      }
    }

    if (editingExchange) {
      // Update existing exchange
      setExchanges((prev) =>
        prev.map((item) =>
          item.id === editingExchange.id
            ? {
                ...item,
                name: formName.trim(),
                image: formImage.trim(),
                status: formStatus,
                guideUrl: formGuideUrl.trim()
              }
            : item
        )
      );
      onAddLog(`Updated exchange ${formName.trim()} configuration details`);
    } else {
      // Create new exchange
      const newEx: Exchange = {
        id: `ex-${Date.now()}`,
        name: formName.trim(),
        image: formImage.trim(),
        status: formStatus,
        guideUrl: formGuideUrl.trim()
      };
      setExchanges((prev) => [...prev, newEx]);
      onAddLog(`Created new exchange module: ${formName.trim()}`);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const ex = exchanges.find((item) => item.id === id);
    if (ex) {
      setExchanges((prev) => prev.filter((item) => item.id !== id));
      onAddLog(`Removed exchange: ${ex.name}`);
    }
    setDeleteConfirmId(null);
  };

  const handleToggleStatus = (id: string) => {
    setExchanges((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          onAddLog(`Exchange ${item.name} status toggled to ${nextStatus}`);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-6" id="exchanges-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Exchange Management</h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Configure, deploy, and adjust active exchanges and their API instructions.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer shadow-md hover:shadow-blue-550/20 active:scale-95"
          id="btn-add-exchange"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exchange</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search exchanges by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-sans"
          />
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-[#0d121f] px-2.5 py-1.5 rounded-lg border border-[#1e2638] shrink-0 select-none">
          Total: <span className="text-white font-bold">{exchanges.length}</span>
        </div>
      </div>

      {/* Grid of exchanges */}
      {filteredExchanges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="exchanges-grid">
          {filteredExchanges.map((ex) => {
            const isActive = ex.status === 'ACTIVE';
            return (
              <div
                key={ex.id}
                className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-blue-550 to-teal-400' : 'bg-slate-700'
                  }`}
                />

                {/* Logo and Name */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0c101a] border border-[#1e2638] overflow-hidden flex items-center justify-center p-2 group-hover:border-slate-600 transition-colors shrink-0">
                    {ex.image ? (
                      <img
                        src={ex.image}
                        alt={`${ex.name} Logo`}
                        className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                        onError={(e) => {
                          // Failover to letters if image breaks
                          (e.target as HTMLElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            const initial = document.createElement('div');
                            initial.className = 'w-full h-full flex items-center justify-center font-bold text-lg font-display text-blue-400 bg-blue-950/20';
                            initial.innerText = ex.name.charAt(0).toUpperCase();
                            parent.appendChild(initial);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg font-display text-blue-400 bg-blue-950/20">
                        {ex.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-display font-semibold text-white truncate">{ex.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-505'
                        }`}
                      />
                      <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details and Links */}
                <div className="mt-6 pt-4 border-t border-[#1e2638]/50 space-y-3">
                  {/* Guide Link Button */}
                  <a
                    href={ex.guideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-3 py-2 bg-[#0c101a] border border-[#1e2638] hover:border-slate-700 rounded-lg text-xs text-slate-350 hover:text-white transition-all font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-blue-450" />
                      <span>API Connection Guide</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 flex items-center justify-between">
                  {/* Switch Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-450 font-sans">Status:</span>
                    <button
                      onClick={() => handleToggleStatus(ex.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 focus:outline-none ${
                        isActive ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                      aria-label={`Toggle ${ex.name} status`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-250 ${
                          isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(ex)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-955/20 rounded-lg transition-all cursor-pointer"
                      title="Edit Exchange"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(ex.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-955/20 rounded-lg transition-all cursor-pointer"
                      title="Delete Exchange"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-12 text-center shadow-lg">
          <Globe className="w-12 h-12 text-slate-650 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No exchanges found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-sans">
            No exchanges matched your search query. Clear filters or add a new exchange.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Exchange
          </button>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#121824] border-2 border-[#1e2638] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="bg-[#0f111a] border-b border-[#1e2638] px-5 py-4 flex items-center justify-between">
              <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                {editingExchange ? 'Edit Exchange Module' : 'Create Exchange Module'}
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {formError && (
                <div className="bg-[#2c1414] border border-red-500/20 text-red-400 px-3.5 py-2.5 rounded-lg text-xs font-sans flex items-start gap-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Exchange Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="exchange-name">
                  Exchange Name
                </label>
                <input
                  id="exchange-name"
                  type="text"
                  placeholder="e.g. Binance Spot, OKX"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              {/* Logo URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="exchange-logo">
                  Exchange Logo / Image URL
                </label>
                <input
                  id="exchange-logo"
                  type="text"
                  placeholder="https://example.com/logo.png"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-blue-500 font-sans"
                />
                <span className="text-[10px] text-slate-500 block font-sans">
                  Provide a web URL to the exchange's image asset.
                </span>
              </div>

              {/* Guide Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="exchange-guide">
                  API Connection Guide Link URL
                </label>
                <input
                  id="exchange-guide"
                  type="text"
                  placeholder="https://support.binance.com/faq/..."
                  value={formGuideUrl}
                  onChange={(e) => setFormGuideUrl(e.target.value)}
                  className="w-full bg-[#0d121f] border border-[#1e2638] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between py-2 border-y border-[#1e2638]/50">
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">Initial Status</span>
                  <span className="text-[10px] text-slate-500 block font-sans">
                    Deploy exchange as active and ready for bot connections.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormStatus(formStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 focus:outline-none ${
                    formStatus === 'ACTIVE' ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-250 ${
                      formStatus === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2638]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-md"
                >
                  {editingExchange ? 'Save Changes' : 'Create Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#121824] border-2 border-red-500/20 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="bg-[#0f111a] border-b border-red-500/15 px-5 py-4 flex items-center gap-2 text-red-500 font-mono text-xs font-bold tracking-wider">
              <AlertTriangle className="w-5 h-5" />
              <span>DELETE EXCHANGE MODIFICATION</span>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Are you sure you want to remove this exchange configuration? This will delete the exchange module and hide connection guides for bots. This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2638]">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-450 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-red-650 hover:bg-red-550 text-white uppercase tracking-wider transition-colors cursor-pointer font-sans shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
