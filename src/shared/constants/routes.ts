export const ROUTES = {
  CU_REPORTS:     'cu_reports',
  TRADING_REPORT: 'trading_report',
  AI_MONITOR:     'ai_monitor',
  AI_MODELS:      'ai_models',
  USERS:          'users',
  USER_PROFILE:   'user-profile',
  STRATEGIES:     'strategies',
  BOT_DETAIL:     'bot-detail',
  PAYMENTS_ALL:   'payments_all',
  EXCHANGES:      'exchanges',
  ADMINS:         'admins',
  AUDIT_LOG:      'audit_log',
  SETTINGS:       'settings',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
