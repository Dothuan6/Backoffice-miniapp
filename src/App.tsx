import React, { useState, useMemo } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

// Shared
import Sidebar from './shared/components/Sidebar';
import { ROUTES } from './shared/constants/routes';

// Feature views
import LoginView            from './features/auth/LoginView';
import CuReportsView        from './features/cu-reports/CuReportsView';
import UsersView            from './features/users/UsersView';
import UserProfileView      from './features/users/UserProfileView';
import StrategiesView       from './features/strategies/StrategiesView';
import BotDetailView        from './features/strategies/BotDetailView';
import PaymentsAllView      from './features/payments/PaymentsAllView';
import TradingReportView    from './features/trading-report/TradingReportView';
import AiMonitorView        from './features/ai/AiMonitorView';
import AiModelsView         from './features/ai/AiModelsView';
import ExchangesView        from './features/exchanges/ExchangesView';
import AdminManagementView  from './features/admins/AdminManagementView';
import AuditLogView         from './features/audit-log/AuditLogView';
import SettingsView         from './features/settings/SettingsView';

// Types
import {
  User, Bot, CUHistoryRecord, SpendEvent, DailyBurn,
  AdminActivity, Exchange, AdminUser, StrategyActivity,
  Agent, AiChatLog, AiSupportModel,
} from './types';

// Feature data
import { INITIAL_SPEND_EVENTS, INITIAL_DAILY_BURN, INITIAL_STRATEGY_ACTIVITIES } from './features/cu-reports/data';
import { INITIAL_USERS, MOCK_CU_HISTORY, MOCK_API_KEYS, MOCK_PAYMENTS, MOCK_REFERRALS, MOCK_USER_TRADING_STATS } from './features/users/data';
import { INITIAL_BOTS }              from './features/strategies/data';
import { MOCK_ALL_PAYMENTS }         from './features/payments/data';
import { MOCK_TRADING_REPORT }       from './features/trading-report/data';
import { INITIAL_AGENTS, MOCK_AI_CHAT_LOGS, INITIAL_AI_SUPPORT_MODELS } from './features/ai/data';
import { INITIAL_EXCHANGES }         from './features/exchanges/data';
import { INITIAL_ADMIN_ACTIVITY }    from './features/audit-log/data';

export default function App() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn]           = useState<boolean>(false);
  const [activeAdminEmail, setActiveAdminEmail] = useState<string>('admin@tca.cms');
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: 'ADM-101', email: 'admin@tca.cms', role: 'Super Admin', createdDate: '2026-06-01' },
    { id: 'ADM-102', email: 'jack@tca.cms',  role: 'Admin',       createdDate: '2026-06-02' },
  ]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const [currentView,      setCurrentView]      = useState<string>(ROUTES.CU_REPORTS);
  const [selectedUsername, setSelectedUsername] = useState<string>('@cryptodan88');
  const [selectedBotId,    setSelectedBotId]    = useState<string>('S-99201');

  // ── Domain state ─────────────────────────────────────────────────────────
  const [users,         setUsers]         = useState<User[]>(INITIAL_USERS);
  const [bots,          setBots]          = useState<Bot[]>(INITIAL_BOTS);
  const [cuHistory,     setCuHistory]     = useState<Record<string, CUHistoryRecord[]>>(MOCK_CU_HISTORY);
  const [adminActivities, setAdminActivities] = useState<AdminActivity[]>(INITIAL_ADMIN_ACTIVITY);
  const [exchanges,     setExchanges]     = useState<Exchange[]>(INITIAL_EXCHANGES);
  const [spendEvents,   setSpendEvents]   = useState<SpendEvent[]>(INITIAL_SPEND_EVENTS);
  const [dailyBurn,     setDailyBurn]     = useState<DailyBurn[]>(INITIAL_DAILY_BURN);
  const [strategyActivities]              = useState<StrategyActivity[]>(INITIAL_STRATEGY_ACTIVITIES);
  const [agents,        setAgents]        = useState<Agent[]>(INITIAL_AGENTS);
  const [aiChatLogs]                      = useState<AiChatLog[]>(MOCK_AI_CHAT_LOGS);
  const [aiSupportModels, setAiSupportModels] = useState<AiSupportModel[]>(INITIAL_AI_SUPPORT_MODELS);

  // ── Mutation tracking ─────────────────────────────────────────────────────
  const [originalBots,    setOriginalBots]    = useState<Bot[]>(INITIAL_BOTS);
  const [pendingChanges,  setPendingChanges]  = useState<Record<string, 'TOGGLE' | 'DELETE' | 'ADJUST'>>({});
  const [editingUser,     setEditingUser]     = useState<User | null>(null);

  // ── Toast state ───────────────────────────────────────────────────────────
  const [showExportToast, setShowExportToast] = useState(false);
  const [generalToast,    setGeneralToast]    = useState<string | null>(null);

  // ── Derived values ────────────────────────────────────────────────────────
  const totalSpentCU = useMemo(() => {
    return spendEvents.reduce((acc, curr) => acc + curr.spent, 0) +
      users.reduce((acc, u) => acc + (INITIAL_USERS.find(iu => iu.username === u.username)?.cuBalance || 0) - u.cuBalance, 0);
  }, [spendEvents, users]);

  const activeUsersCount = useMemo(() => {
    return users.filter(u => u.status === 'ONLINE').length + 800;
  }, [users]);

  const activeBotObject = useMemo(() => bots.find(b => b.id === selectedBotId) || bots[0], [bots, selectedBotId]);
  const activeUserObject = useMemo(() => users.find(u => u.username === selectedUsername) || users[0], [users, selectedUsername]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const appendAdminLog = (message: string, admin?: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setAdminActivities(prev => [{ timestamp: timeStr, message, admin: admin || activeAdminEmail }, ...prev]);
  };

  const showToast = (message: string, duration = 3000) => {
    setGeneralToast(message);
    setTimeout(() => setGeneralToast(null), duration);
  };

  // ── Navigation handlers ───────────────────────────────────────────────────
  const handleViewUserProfile = (username: string) => {
    setSelectedUsername(username);
    setCurrentView(ROUTES.USER_PROFILE);
  };

  const handleViewBotDetail = (botId: string) => {
    setSelectedBotId(botId);
    setCurrentView(ROUTES.BOT_DETAIL);
  };

  // ── CU balance handlers ───────────────────────────────────────────────────
  const handleModifyCuBalance = (username: string, amount: number, description: string) => {
    setUsers(prev => prev.map(u =>
      u.username === username ? { ...u, cuBalance: Math.max(0, u.cuBalance + amount) } : u
    ));

    const now      = new Date();
    const dateStr  = now.toISOString().split('T')[0];
    const timeStr  = now.toTimeString().split(' ')[0];
    const newTxId  = `tx-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: CUHistoryRecord = {
      id: newTxId,
      timestamp: `${dateStr} ${timeStr.slice(0, 5)}`,
      type: amount >= 0 ? 'ADJUST' : 'SPENT',
      amount,
      description,
    };

    setCuHistory(prev => ({ ...prev, [username]: [newRecord, ...(prev[username] || [])] }));
    appendAdminLog(`Balance adjusted for ${username}: ${amount >= 0 ? '+' : ''}${amount.toLocaleString()} CU (${newTxId})`, '@admin_jack');
    setDailyBurn(prev =>
      prev.map((d, i) => (i === prev.length - 1 ? { ...d, spent: d.spent + Math.abs(amount) / 10 } : d))
    );
    showToast(`CU Balance adjusted successfully by ${amount >= 0 ? '+' : ''}${amount.toLocaleString()} for ${username}`);
  };

  const handleToggleLock = (username: string) => {
    const user   = users.find(u => u.username === username);
    const action = user?.locked ? 'unlocked' : 'locked';
    setUsers(prev => prev.map(u => u.username === username ? { ...u, locked: !u.locked } : u));
    appendAdminLog(`Account ${action}: ${username}`);
  };

  // ── Bot mutation handlers ─────────────────────────────────────────────────
  const handleToggleBotStatus = (botId: string) => {
    setBots(prev => prev.map(b =>
      b.id === botId ? { ...b, status: b.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : b
    ));
    setPendingChanges(prev => ({ ...prev, [botId]: 'TOGGLE' }));
  };

  const handleDeleteBot = (botId: string) => {
    setBots(prev => prev.filter(b => b.id !== botId));
    setPendingChanges(prev => ({ ...prev, [botId]: 'DELETE' }));
  };

  const handleApplyPendingChanges = () => {
    setOriginalBots(bots);
    setPendingChanges({});
    appendAdminLog('Committed strategy adjustments. Redeployed live container instances.', '@admin_jack');
    showToast('Changes successfully applied to live production trading containers!', 3500);
  };

  const handleDiscardPendingChanges = () => {
    setBots(originalBots);
    setPendingChanges({});
    showToast('Pending container mutations discarded successfully.');
  };

  // ── Admin handlers ────────────────────────────────────────────────────────
  const handleCreateAdmin = (email: string, role: string) => {
    const dateStr    = new Date().toISOString().split('T')[0];
    const newAdminId = `ADM-${100 + admins.length + 1}`;
    setAdmins(prev => [...prev, { id: newAdminId, email, role, createdDate: dateStr }]);
    appendAdminLog(`Created new admin account: ${email} with role ${role} (${newAdminId})`);
    showToast(`Admin account ${email} created successfully!`);
  };

  const handleExportCsvClick = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 4500);
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={(email) => {
          setIsLoggedIn(true);
          setActiveAdminEmail(email);
          appendAdminLog(`CMS session initiated by administrator: ${email}`, email);
        }}
      />
    );
  }

  // ── Router ────────────────────────────────────────────────────────────────
  const renderView = () => {
    switch (currentView) {
      case ROUTES.CU_REPORTS:
        return (
          <CuReportsView
            totalSpent={totalSpentCU}
            activeUsersCount={activeUsersCount}
            spendEvents={spendEvents}
            dailyBurn={dailyBurn}
            strategyActivities={strategyActivities}
          />
        );

      case ROUTES.USERS:
        return (
          <UsersView
            users={users}
            onViewProfile={handleViewUserProfile}
            onEditUserClick={(user) => {
              setSelectedUsername(user.username);
              setCurrentView(ROUTES.USER_PROFILE);
            }}
            onExportCsv={handleExportCsvClick}
            showExportToast={showExportToast}
            setShowExportToast={setShowExportToast}
          />
        );

      case ROUTES.USER_PROFILE:
        return (
          <UserProfileView
            user={activeUserObject}
            bots={bots}
            cuHistory={cuHistory[activeUserObject.username] || []}
            apiKeys={MOCK_API_KEYS[activeUserObject.username] || []}
            payments={MOCK_PAYMENTS[activeUserObject.username] || []}
            referrals={MOCK_REFERRALS[activeUserObject.username] || {
              referralCode: activeUserObject.referralCode,
              clicks: 0, signups: 0, activeReferrals: 0, totalEarningsCu: 0,
              referredUsers: [],
            }}
            tradingStats={MOCK_USER_TRADING_STATS[activeUserObject.username]}
            adminActivities={adminActivities.filter(a =>
              a.message.includes(activeUserObject.username) || a.message.includes('Committed')
            )}
            onBackToList={() => setCurrentView(ROUTES.USERS)}
            onModifyCuBalance={handleModifyCuBalance}
            onToggleBot={handleToggleBotStatus}
            onToggleLock={handleToggleLock}
          />
        );

      case ROUTES.PAYMENTS_ALL:
        return <PaymentsAllView payments={MOCK_ALL_PAYMENTS} />;

      case ROUTES.TRADING_REPORT:
        return <TradingReportView rows={MOCK_TRADING_REPORT} />;

      case ROUTES.AI_MONITOR:
        return (
          <AiMonitorView
            agents={agents}
            chatLogs={aiChatLogs}
            onUpdateAgent={updated => setAgents(prev => prev.map(a => a.id === updated.id ? updated : a))}
          />
        );

      case ROUTES.AI_MODELS:
        return (
          <AiModelsView
            models={aiSupportModels}
            onAdd={m => setAiSupportModels(prev => [...prev, m])}
            onUpdate={m => setAiSupportModels(prev => prev.map(x => x.id === m.id ? m : x))}
            onDelete={id => setAiSupportModels(prev => prev.filter(x => x.id !== id))}
          />
        );

      case ROUTES.STRATEGIES:
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

      case ROUTES.BOT_DETAIL:
        return (
          <BotDetailView
            bot={activeBotObject}
            onBackToStrategies={() => setCurrentView(ROUTES.STRATEGIES)}
            onToggleStatus={() => handleToggleBotStatus(activeBotObject.id)}
          />
        );

      case ROUTES.ADMINS:
        return <AdminManagementView admins={admins} onAddAdmin={handleCreateAdmin} />;

      case ROUTES.AUDIT_LOG:
        return (
          <AuditLogView
            logs={adminActivities}
            onAddLog={(msg) => appendAdminLog(msg)}
          />
        );

      case ROUTES.EXCHANGES:
        return (
          <ExchangesView
            exchanges={exchanges}
            setExchanges={setExchanges}
            onAddLog={(msg) => appendAdminLog(msg)}
          />
        );

      case ROUTES.SETTINGS:
        return <SettingsView onAddLog={(msg) => appendAdminLog(msg)} />;

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
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d121f] text-[#f1f5f9] antialiased" id="quant-admin-dashboard">

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userCount={users.length}
        exchangeCount={exchanges.length}
        adminCount={admins.length}
        adminEmail={activeAdminEmail}
      />

      <main className="flex-1 overflow-y-auto flex flex-col h-full bg-[#080c14] relative pb-28 pt-14 md:pt-0" id="quant-main-workspace">

        {/* Global success toast */}
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

        <div className="p-4 md:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto" id="inner-workspace-container">
          {renderView()}
        </div>

        {/* Pending mutations banner */}
        {Object.keys(pendingChanges).length > 0 && currentView !== ROUTES.STRATEGIES && (
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
                Changes are pending for{' '}
                <span className="text-blue-400 font-bold">{Object.keys(pendingChanges).length}</span>{' '}
                trading bots. Commit them to load the container configurations.
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
