import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import CuReportsView from './components/CuReportsView';
import UsersView from './components/UsersView';
import UserProfileView from './components/UserProfileView';
import StrategiesView from './components/StrategiesView';
import BotDetailView from './components/BotDetailView';
import { AffiliateView, AuditLogView, SettingsView } from './components/ExtraViews';
import ExchangesView from './components/ExchangesView';

import { User, Bot, CUHistoryRecord, SpendEvent, DailyBurn, AdminActivity, Exchange } from './types';
import {
  INITIAL_USERS,
  INITIAL_BOTS,
  INITIAL_SPEND_EVENTS,
  INITIAL_DAILY_BURN,
  INITIAL_ADMIN_ACTIVITY,
  MOCK_CU_HISTORY,
  MOCK_API_KEYS,
  MOCK_PAYMENTS,
  MOCK_REFERRALS,
  INITIAL_EXCHANGES
} from './data';
import { ShieldAlert, Check, X, AlertTriangle, Play } from 'lucide-react';

export default function App() {
  // Navigation & Drill down context
  const [currentView, setCurrentView] = useState<string>('cu_reports');
  const [selectedUsername, setSelectedUsername] = useState<string>('@cryptodan88');
  const [selectedBotId, setSelectedBotId] = useState<string>('S-99201');

  // Unified State Engine
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [bots, setBots] = useState<Bot[]>(INITIAL_BOTS);
  const [cuHistory, setCuHistory] = useState<Record<string, CUHistoryRecord[]>>(MOCK_CU_HISTORY);
  const [adminActivities, setAdminActivities] = useState<AdminActivity[]>(INITIAL_ADMIN_ACTIVITY);
  const [exchanges, setExchanges] = useState<Exchange[]>(INITIAL_EXCHANGES);

  // Spend and burn states
  const [spendEvents, setSpendEvents] = useState<SpendEvent[]>(INITIAL_SPEND_EVENTS);
  const [dailyBurn, setDailyBurn] = useState<DailyBurn[]>(INITIAL_DAILY_BURN);

  // Emergency Kill Switch trigger state
  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);
  const [showKillSwitchConfirm, setShowKillSwitchConfirm] = useState(false);

  // Mutation Engine (Tracks pending bot modifications or status updates before committing)
  const [originalBots, setOriginalBots] = useState<Bot[]>(INITIAL_BOTS);
  const [pendingChanges, setPendingChanges] = useState<Record<string, 'TOGGLE' | 'DELETE' | 'ADJUST'>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Toasts
  const [showExportToast, setShowExportToast] = useState(false);
  const [generalToast, setGeneralToast] = useState<string | null>(null);

  // Dynamic values
  const totalSpentCU = useMemo(() => {
    return spendEvents.reduce((acc, curr) => acc + curr.spent, 0) + 
      users.reduce((acc, u) => acc + (INITIAL_USERS.find(iu => iu.username === u.username)?.cuBalance || 0) - u.cuBalance, 0);
  }, [spendEvents, users]);

  const activeUsersCount = useMemo(() => {
    return users.filter(u => u.status === 'ONLINE').length + 800; // adding baseline to match screenshot's 832
  }, [users]);

  // View Drill-down Helpers
  const handleViewUserProfile = (username: string) => {
    setSelectedUsername(username);
    setCurrentView('user-profile');
  };

  const handleViewBotDetail = (botId: string) => {
    setSelectedBotId(botId);
    setCurrentView('bot-detail');
  };

  // State manipulation: Dynamic CU Balance Adjustment from User Profile modal
  const handleModifyCuBalance = (username: string, amount: number, description: string) => {
    // Update balance
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.username === username
          ? { ...u, cuBalance: Math.max(0, u.cuBalance + amount) }
          : u
      )
    );

    // Dynamic timestamp helper
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // E.g., 10:15:22
    const dateStr = now.toISOString().split('T')[0]; // E.g., 2026-06-04

    // Append history
    const newTxId = `tx-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: CUHistoryRecord = {
      id: newTxId,
      timestamp: `${dateStr} ${timeStr.slice(0, 5)}`,
      type: amount >= 0 ? 'ADJUST' : 'SPENT',
      amount: amount,
      description: description
    };

    setCuHistory(prev => ({
      ...prev,
      [username]: [newRecord, ...(prev[username] || [])]
    }));

    // Append admin activity
    const newActivity: AdminActivity = {
      timestamp: timeStr,
      message: `Balance adjusted for ${username}: ${amount >= 0 ? '+' : ''}${amount.toLocaleString()} CU (${newTxId})`,
      admin: '@admin_jack'
    };
    setAdminActivities(prev => [newActivity, ...prev]);

    // Update Daily chart metrics slightly to illustrate dynamic shifts!
    setDailyBurn(prev =>
      prev.map((d, id) => (id === prev.length - 1 ? { ...d, spent: d.spent + Math.abs(amount) / 10 } : d))
    );

    setGeneralToast(`CU Balance adjusted successfully by ${amount >= 0 ? '+' : ''}${amount.toLocaleString()} for ${username}`);
    setTimeout(() => setGeneralToast(null), 3000);
  };

  // Bot Status toggles (adds mutations list)
  const handleToggleBotStatus = (botId: string) => {
    setBots(prevBots =>
      prevBots.map(b => {
        if (b.id === botId) {
          const nextStatus = b.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );

    setPendingChanges(prev => ({
      ...prev,
      [botId]: 'TOGGLE'
    }));
  };

  // Dry deletion (mark pending delete or execute dry filter)
  const handleDeleteBot = (botId: string) => {
    setBots(prev => prev.filter(b => b.id !== botId));
    setPendingChanges(prev => ({
      ...prev,
      [botId]: 'DELETE'
    }));
  };

  // Save changes callback (Apply modifications / Commit changes bottom widgets)
  const handleApplyPendingChanges = () => {
    setOriginalBots(bots);
    setPendingChanges({});

    // Append summary admin audit logs
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newActivity: AdminActivity = {
      timestamp: timeStr,
      message: `Committed strategy adjustments. Redeployed live container instances.`,
      admin: '@admin_jack'
    };
    setAdminActivities(prev => [newActivity, ...prev]);

    setGeneralToast('Changes successfully applied to live production trading containers!');
    setTimeout(() => setGeneralToast(null), 3500);
  };

  // Discard changes callback
  const handleDiscardPendingChanges = () => {
    setBots(originalBots);
    setPendingChanges({});

    setGeneralToast('Pending container mutations discarded successfully.');
    setTimeout(() => setGeneralToast(null), 3000);
  };

  // Activate EMERGENCY MASS COLD SWITCH
  const handleConfirmKillSwitch = () => {
    setIsKillSwitchActive(true);
    setShowKillSwitchConfirm(false);

    // Halt all bots!
    setBots(prev => prev.map(b => ({ ...b, status: 'PAUSED', pauseReason: 'EMERGENCY COLD HALT TRIGGERED' })));

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newActivity: AdminActivity = {
      timestamp: timeStr,
      message: `🔴 COLD STOP ORDER: EMERGENCY KILL SWITCH PRESSED. Halting all container channels!`,
      admin: '@admin_jack'
    };
    setAdminActivities(prev => [newActivity, ...prev]);

    setGeneralToast('EMERGENCY KILL SWITCH: HALTED ALL ACTIVE TRADING BOTS IMMEDIATELY.');
    setTimeout(() => setGeneralToast(null), 4000);
  };

  // Disable / Reset Emergency Stop Switch
  const handleResetKillSwitch = () => {
    setIsKillSwitchActive(false);

    // Re-active standard bots
    setBots(INITIAL_BOTS);
    setOriginalBots(INITIAL_BOTS);
    setPendingChanges({});

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newActivity: AdminActivity = {
      timestamp: timeStr,
      message: `🟢 EMERGENCY SYSTEM OVERRIDE: Kill switch reset. Resuming scheduler channels.`,
      admin: '@admin_jack'
    };
    setAdminActivities(prev => [newActivity, ...prev]);

    setGeneralToast('Emergency status cleared. Bot nodes scheduler restored.');
    setTimeout(() => setGeneralToast(null), 3000);
  };

  // Dummy action for export csv click
  const handleExportCsvClick = () => {
    setShowExportToast(true);
    // Auto clear after 4 seconds
    setTimeout(() => {
      setShowExportToast(false);
    }, 4500);
  };

  // Auxiliary data values for extra pages
  const referralStatsSummary = {
    code: 'DAN88QUANT',
    totalEarningsUsd: 1850,
    commissionRate: 15,
    clicks: 1420,
    signups: 68
  };

  // Retrieve details for inspected bot
  const activeBotObject = useMemo(() => {
    return bots.find(b => b.id === selectedBotId) || bots[0];
  }, [bots, selectedBotId]);

  // Retrieve details for inspected user profile
  const activeUserObject = useMemo(() => {
    return users.find(u => u.username === selectedUsername) || users[0];
  }, [users, selectedUsername]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d121f] text-[#f1f5f9] antialiased" id="quant-admin-dashboard">
      
      {/* 1. SIDE NAVIGATION ELEMENT */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userCount={users.length}
        exchangeCount={exchanges.length}
        onKillSwitchClick={() => {
          if (isKillSwitchActive) {
            handleResetKillSwitch();
          } else {
            setShowKillSwitchConfirm(true);
          }
        }}
        isKillSwitchActive={isKillSwitchActive}
      />

      {/* 2. MAIN COGNITIVE SCREEN CARDS PANELS */}
      <main className="flex-1 overflow-y-auto flex flex-col h-full bg-[#080c14] relative pb-28" id="quant-main-workspace">
        
        {/* Flashing Kill-Switch Global Warning overlay */}
        {isKillSwitchActive && (
          <div className="bg-rose-950/80 border-b border-rose-600/30 text-rose-200 px-6 py-3.5 flex items-center justify-between text-xs font-mono animate-pulse shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <span className="font-bold text-white uppercase tracking-wider block">EMERGENCY SYSTEM SUSPENSION IN PROGRESS</span>
                <span>The system-wide Kill Switch is active. All bot API calls are blocked. Schedule algorithms are frozen.</span>
              </div>
            </div>
            <button
              onClick={handleResetKillSwitch}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
            >
              System Override Reset
            </button>
          </div>
        )}

        {/* Global Floating Success Action Toasts */}
        {generalToast && (
          <div className="fixed top-6 right-6 z-50 bg-[#121f1a] text-slate-100 border border-emerald-500/20 shadow-2xl p-4.5 rounded-xl max-w-sm flex items-start gap-3 animate-slide-down">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold font-sans">Operation Successful</h5>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 leading-snug">{generalToast}</p>
            </div>
          </div>
        )}

        {/* Dynamic Inner Layout Body */}
        <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto" id="inner-workspace-container">
          {(() => {
            switch (currentView) {
              case 'cu_reports':
                return (
                  <CuReportsView
                    totalSpent={totalSpentCU}
                    activeUsersCount={activeUsersCount}
                    spendEvents={spendEvents}
                    dailyBurn={dailyBurn}
                  />
                );
              case 'users':
                return (
                  <UsersView
                    users={users}
                    onViewProfile={handleViewUserProfile}
                    onEditUserClick={(user) => {
                      setSelectedUsername(user.username);
                      setCurrentView('user-profile');
                    }}
                    onExportCsv={handleExportCsvClick}
                    showExportToast={showExportToast}
                    setShowExportToast={setShowExportToast}
                  />
                );
              case 'user-profile':
                return (
                  <UserProfileView
                    user={activeUserObject}
                    bots={bots}
                    cuHistory={cuHistory[activeUserObject.username] || []}
                    apiKeys={MOCK_API_KEYS[activeUserObject.username] || []}
                    payments={MOCK_PAYMENTS[activeUserObject.username] || []}
                    referrals={MOCK_REFERRALS[activeUserObject.username] || {
                      referralCode: 'DAN88QUANT',
                      clicks: 0,
                      signups: 0,
                      activeReferrals: 0,
                      totalEarningsCu: 0,
                      referredUsers: []
                    }}
                    adminActivities={adminActivities.filter(a => a.message.includes(activeUserObject.username) || a.message.includes('Committed'))}
                    onBackToList={() => setCurrentView('users')}
                    onModifyCuBalance={handleModifyCuBalance}
                    onToggleBot={handleToggleBotStatus}
                  />
                );
              case 'strategies':
                return (
                  <StrategiesView
                    bots={bots}
                    onViewBotDetail={handleViewBotDetail}
                    onToggleBotStatus={handleToggleBotStatus}
                    onDeleteBot={handleDeleteBot}
                    onApplyPendingChanges={handleApplyPendingChanges}
                    onDiscardPendingChanges={handleDiscardPendingChanges}
                    pendingChangesCount={Object.keys(pendingChanges).length}
                  />
                );
              case 'bot-detail':
                return (
                  <BotDetailView
                    bot={activeBotObject}
                    onBackToStrategies={() => setCurrentView('strategies')}
                    onToggleStatus={() => handleToggleBotStatus(activeBotObject.id)}
                  />
                );
              case 'affiliate':
                return (
                  <AffiliateView referralStatsSummary={referralStatsSummary} />
                );
              case 'audit_log':
                return (
                  <AuditLogView
                    logs={adminActivities}
                    onAddLog={(msg) => {
                      const now = new Date();
                      const timeStr = now.toTimeString().split(' ')[0];
                      setAdminActivities(prev => [
                        { timestamp: timeStr, message: msg, admin: '@admin_jack' },
                        ...prev
                      ]);
                    }}
                  />
                );
              case 'exchanges':
                return (
                  <ExchangesView
                    exchanges={exchanges}
                    setExchanges={setExchanges}
                    onAddLog={(msg) => {
                      const now = new Date();
                      const timeStr = now.toTimeString().split(' ')[0];
                      setAdminActivities(prev => [
                        { timestamp: timeStr, message: msg, admin: '@admin_jack' },
                        ...prev
                      ]);
                    }}
                  />
                );
              case 'settings':
                return (
                  <SettingsView
                    onAddLog={(msg) => {
                      const now = new Date();
                      const timeStr = now.toTimeString().split(' ')[0];
                      setAdminActivities(prev => [
                        { timestamp: timeStr, message: msg, admin: '@admin_jack' },
                        ...prev
                      ]);
                    }}
                  />
                );
              default:
                return (
                  <CuReportsView
                    totalSpent={totalSpentCU}
                    activeUsersCount={activeUsersCount}
                    spendEvents={spendEvents}
                    dailyBurn={dailyBurn}
                  />
                );
            }
          })()}
        </div>

        {/* Global Mutation stick-bar indicators to reflect edits also on Dashboard page or others */}
        {Object.keys(pendingChanges).length > 0 && currentView !== 'strategies' && (
          <div
            id="global-sticky-mutation-bar"
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e15] border-t border-blue-500/20 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-xs text-slate-300 font-mono">
                <span className="font-bold text-white uppercase mr-1">Mutation Active:</span>
                Changes are pending for <span className="text-blue-400 font-bold">{Object.keys(pendingChanges).length}</span> trading bots. Commit them to load the container configurations.
              </p>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto font-mono text-xs">
              <button
                onClick={handleDiscardPendingChanges}
                className="px-3.5 py-1.5 text-slate-400 hover:text-white border border-[#1e2638] rounded-lg transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleApplyPendingChanges}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-md"
              >
                Commit Changes
              </button>
            </div>
          </div>
        )}
      </main>

      {/* EMERGENCY STOP CONFIRMATION MODAL */}
      {showKillSwitchConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none" id="kill-switch-modal-overlay">
          <div className="bg-[#121824] border-2 border-red-650/40 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in" id="kill-switch-alert-box">
            {/* Modal Header */}
            <div className="bg-[#0f111a] border-b border-red-500/15 p-5 flex items-center gap-2.5 text-red-500 font-mono text-xs font-bold tracking-wider">
              <ShieldAlert className="w-5 h-5" />
              <span>EMERGENCY SUSPENSION ORDER</span>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-sans text-white">Activate System-Wide Kill Switch?</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    This is an immediate system-wide instruction. Pressing this will immediately halts API calls for all <span className="text-white font-bold">{bots.length} active bots</span>, freezing DCA algorithms and position schedules.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2638]" id="kill-switch-modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowKillSwitchConfirm(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-450 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmKillSwitch}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#dc2626] hover:bg-red-500 text-white uppercase tracking-wider transition-colors cursor-pointer font-sans shadow-md"
                >
                  Confirm Halt Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
