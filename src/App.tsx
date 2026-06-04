import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import CuReportsView from './components/CuReportsView';
import UsersView from './components/UsersView';
import UserProfileView from './components/UserProfileView';
import StrategiesView from './components/StrategiesView';
import BotDetailView from './components/BotDetailView';
import { AuditLogView, SettingsView } from './components/ExtraViews';
import ExchangesView from './components/ExchangesView';
import LoginView from './components/LoginView';
import AdminManagementView from './components/AdminManagementView';

import { User, Bot, CUHistoryRecord, SpendEvent, DailyBurn, AdminActivity, Exchange, AdminUser, StrategyActivity } from './types';
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
  INITIAL_EXCHANGES,
  INITIAL_STRATEGY_ACTIVITIES,
  MOCK_ALL_PAYMENTS,
  MOCK_USER_TRADING_STATS,
  MOCK_TRADING_REPORT,
} from './data';
import PaymentsAllView from './components/PaymentsAllView';
import TradingReportView from './components/TradingReportView';
import { Check, X, AlertTriangle, Play } from 'lucide-react';

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeAdminEmail, setActiveAdminEmail] = useState<string>('admin@tca.cms');
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: 'ADM-101', email: 'admin@tca.cms', role: 'Super Admin', createdDate: '2026-06-01' },
    { id: 'ADM-102', email: 'jack@tca.cms', role: 'Admin', createdDate: '2026-06-02' }
  ]);

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
  const [strategyActivities] = useState<StrategyActivity[]>(INITIAL_STRATEGY_ACTIVITIES);



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

  const handleToggleLock = (username: string) => {
    setUsers(prev => prev.map(u => u.username === username ? { ...u, locked: !u.locked } : u));
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const user = users.find(u => u.username === username);
    const action = user?.locked ? 'unlocked' : 'locked';
    setAdminActivities(prev => [{ timestamp: timeStr, message: `Account ${action}: ${username}`, admin: activeAdminEmail }, ...prev]);
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

  const handleCreateAdmin = (email: string, role: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const newAdminId = `ADM-${100 + admins.length + 1}`;
    const newAdmin: AdminUser = {
      id: newAdminId,
      email: email,
      role: role,
      createdDate: dateStr
    };

    setAdmins(prev => [...prev, newAdmin]);

    // Append to admin activities log
    const newActivity: AdminActivity = {
      timestamp: timeStr,
      message: `Created new admin account: ${email} with role ${role} (${newAdminId})`,
      admin: activeAdminEmail
    };
    setAdminActivities(prev => [newActivity, ...prev]);

    setGeneralToast(`Admin account ${email} created successfully!`);
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


  // Retrieve details for inspected bot
  const activeBotObject = useMemo(() => {
    return bots.find(b => b.id === selectedBotId) || bots[0];
  }, [bots, selectedBotId]);

  // Retrieve details for inspected user profile
  const activeUserObject = useMemo(() => {
    return users.find(u => u.username === selectedUsername) || users[0];
  }, [users, selectedUsername]);

  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={(email) => {
          setIsLoggedIn(true);
          setActiveAdminEmail(email);
          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0];
          setAdminActivities(prev => [
            {
              timestamp: timeStr,
              message: `CMS session initiated by administrator: ${email}`,
              admin: email
            },
            ...prev
          ]);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d121f] text-[#f1f5f9] antialiased" id="quant-admin-dashboard">
      
      {/* 1. SIDE NAVIGATION ELEMENT */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userCount={users.length}
        exchangeCount={exchanges.length}
        adminCount={admins.length}
        adminEmail={activeAdminEmail}
      />

      {/* 2. MAIN COGNITIVE SCREEN CARDS PANELS */}
      <main className="flex-1 overflow-y-auto flex flex-col h-full bg-[#080c14] relative pb-28 pt-14 md:pt-0" id="quant-main-workspace">
        


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
        <div className="p-4 md:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto" id="inner-workspace-container">
          {(() => {
            switch (currentView) {
              case 'cu_reports':
                return (
                  <CuReportsView
                    totalSpent={totalSpentCU}
                    activeUsersCount={activeUsersCount}
                    spendEvents={spendEvents}
                    dailyBurn={dailyBurn}
                    strategyActivities={strategyActivities}
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
                    tradingStats={MOCK_USER_TRADING_STATS[activeUserObject.username]}
                    adminActivities={adminActivities.filter(a => a.message.includes(activeUserObject.username) || a.message.includes('Committed'))}
                    onBackToList={() => setCurrentView('users')}
                    onModifyCuBalance={handleModifyCuBalance}
                    onToggleBot={handleToggleBotStatus}
                    onToggleLock={handleToggleLock}
                  />
                );
              case 'payments_all':
                return <PaymentsAllView payments={MOCK_ALL_PAYMENTS} />;
              case 'trading_report':
                return <TradingReportView rows={MOCK_TRADING_REPORT} />;
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
              case 'admins':
                return (
                  <AdminManagementView
                    admins={admins}
                    onAddAdmin={handleCreateAdmin}
                  />
                );
              case 'audit_log':
                return (
                  <AuditLogView
                    logs={adminActivities}
                    onAddLog={(msg) => {
                      const now = new Date();
                      const timeStr = now.toTimeString().split(' ')[0];
                      setAdminActivities(prev => [
                        { timestamp: timeStr, message: msg, admin: activeAdminEmail },
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
                        { timestamp: timeStr, message: msg, admin: activeAdminEmail },
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
                        { timestamp: timeStr, message: msg, admin: activeAdminEmail },
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
                    strategyActivities={strategyActivities}
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
    </div>
  );
}
