export const ROUTES = {
  CU_REPORTS:      'cu_reports',
  TRADING_REPORT:  'trading_report',
  AI_MONITOR:      'ai_monitor',
  AI_MODELS:       'ai_models',
  // Subscription group
  SUB_CU_EVENTS:   'sub_cu_events',
  SUB_CU_PACKAGES: 'sub_cu_packages',
  SUB_PAYMENTS:    'sub_payments',
  // Backtest
  BACKTEST_JOBS:   'backtest_jobs',
  BACKTEST_DETAIL: 'backtest_detail',
  // Core
  USERS:           'users',
  USER_PROFILE:    'user-profile',
  STRATEGIES:      'strategies',
  BOT_DETAIL:      'bot-detail',
  EXCHANGES:       'exchanges',
  ADMINS:          'admins',
  AUDIT_LOG:       'audit_log',
  SETTINGS:        'settings',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
