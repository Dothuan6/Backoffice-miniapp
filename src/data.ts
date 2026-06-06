// Central data barrel — re-exports all feature mock data
// Import directly from feature data files for new code

export { INITIAL_SPEND_EVENTS, INITIAL_DAILY_BURN, INITIAL_STRATEGY_ACTIVITIES } from './features/cu-reports/data';
export { INITIAL_USERS, MOCK_CU_HISTORY, MOCK_API_KEYS, MOCK_PAYMENTS, MOCK_REFERRALS, MOCK_USER_TRADING_STATS } from './features/users/data';
export { INITIAL_BOTS } from './features/strategies/data';
export { MOCK_ALL_PAYMENTS } from './features/payments/data';
export { MOCK_TRADING_REPORT } from './features/trading-report/data';
export { INITIAL_AGENTS, MOCK_AI_CHAT_LOGS, INITIAL_AI_SUPPORT_MODELS } from './features/ai/data';
export { INITIAL_EXCHANGES } from './features/exchanges/data';
export { INITIAL_ADMIN_ACTIVITY } from './features/audit-log/data';
