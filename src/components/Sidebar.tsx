import React, { useState } from 'react';
import { Users, Cpu, FileSpreadsheet, ScrollText, Settings, ChevronDown, Landmark, Menu, X, Shield, CreditCard, BarChart2 } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userCount: number;
  exchangeCount: number;
  adminCount: number;
  adminEmail?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  userCount,
  exchangeCount,
  adminCount,
  adminEmail = 'admin@tca.cms'
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminName = adminEmail.split('@')[0];

  const menuItems: MenuItem[] = [
    { id: 'users', label: 'Users', icon: Users, badge: userCount },
    { id: 'exchanges', label: 'Exchanges', icon: Landmark, badge: exchangeCount },
    { id: 'admins', label: 'Admins', icon: Shield, badge: adminCount },
    { id: 'strategies', label: 'Strategies', icon: Cpu },
    { id: 'cu_reports', label: 'CU Reports', icon: FileSpreadsheet },
    { id: 'trading_report', label: 'Trading Report', icon: BarChart2 },
    { id: 'payments_all', label: 'Payments', icon: CreditCard },
    { id: 'audit_log', label: 'Audit Log', icon: ScrollText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNav = (id: string) => {
    setCurrentView(id);
    setMobileOpen(false);
  };

  const renderNavItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = currentView === item.id ||
                     (item.id === 'users' && currentView === 'user-profile') ||
                     (item.id === 'strategies' && currentView === 'bot-detail');
    return (
      <button
        key={item.id}
        id={`nav-item-${item.id}`}
        onClick={() => handleNav(item.id)}
        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-[#18233c] to-[#121a2d] text-blue-400 font-medium border-l-[3px] border-blue-500 pl-[11px]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
          <span>{item.label}</span>
        </div>
        {item.badge !== undefined && item.badge > 0 && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
            isActive ? 'bg-blue-950/55 text-blue-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 bg-[#0d121f] border-r border-[#1e2638] flex-col h-screen overflow-y-auto select-none shrink-0" id="quant-sidebar">
        {/* Brand Logo */}
        <div className="p-6 border-b border-[#1e2638]" id="brand-header">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-teal-500 to-blue-400 p-[1.5px]">
              <div className="w-full h-full bg-[#0d121f] rounded-[6px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-teal-300 text-lg font-display">
                Q
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#0d121f] animate-pulse"></span>
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-base tracking-tight leading-none">QuantAdmin</h1>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block tracking-wider">V2.4.1-STABLE</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1" id="sidebar-nav">
          {menuItems.map(renderNavItem)}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#1e2638] space-y-3" id="sidebar-bottom">
          <div className="bg-[#121824] border border-[#1e2638] rounded-lg p-3 flex items-center justify-between" id="admin-user-card">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80"
                  alt="Admin Profile"
                  className="w-8 h-8 rounded-full border border-blue-500/50 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#121824]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-slate-200">Admin User</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">@{adminName}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Bar ──────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0d121f] border-b border-[#1e2638] flex items-center justify-between px-4 h-14" id="mobile-topbar">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-teal-500 to-blue-400 p-[1.5px]">
            <div className="w-full h-full bg-[#0d121f] rounded-[6px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-teal-300 text-base font-display">
              Q
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#0d121f] animate-pulse"></span>
          </div>
          <span className="font-display font-bold text-white text-sm tracking-tight">QuantAdmin</span>
        </div>

        {/* Hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#121824] border border-[#1e2638] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ───────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer Panel ─────────────────────────────────────── */}
      <div
        className={`md:hidden fixed top-14 left-0 bottom-0 z-40 w-72 bg-[#0d121f] border-r border-[#1e2638] flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="mobile-drawer"
      >
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(renderNavItem)}
        </nav>

        {/* Admin card in mobile drawer */}
        <div className="p-4 border-t border-[#1e2638]">
          <div className="bg-[#121824] border border-[#1e2638] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80"
                  alt="Admin Profile"
                  className="w-8 h-8 rounded-full border border-blue-500/50 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#121824]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-slate-200">Admin User</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">@{adminName}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>
    </>
  );
}
