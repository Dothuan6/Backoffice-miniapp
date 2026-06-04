// Data store — last updated 2026-06-04
import { User, Bot, SpendEvent, AdminActivity, DailyBurn, CUHistoryRecord, UserApiKey, PaymentRecord, ReferralsInfo, Exchange, StrategyActivity, UserTradingStats, TradingReportRow } from './types';

export const INITIAL_USERS: User[] = [
  {
    username: '@cryptodan88',
    name: 'Daniel Crypto',
    uuid: '8f4e-22c1-9002-ad94',
    telegramId: '559021134',
    cuBalance: 14290.45,
    joinedDate: 'Nov 14, 2023',
    joinedDateTime: '2023-11-14 09:42',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    status: 'ONLINE',
    lastActive: '4m ago',
    referralCode: 'DAN88QUANT'
  },
  {
    username: '@johndoe_quant',
    name: 'John Doe',
    uuid: '5a2b-88e2-1103-bc92',
    telegramId: '5829104832',
    cuBalance: 8420.00,
    joinedDate: 'Oct 12, 2023',
    joinedDateTime: '2023-10-12 14:15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    status: 'ONLINE',
    lastActive: '12s ago',
    referralCode: 'JDOE_QUANT'
  },
  {
    username: '@alice_trades',
    name: 'Alice Springs',
    uuid: 'bc2d-33f4-5512-ab90',
    telegramId: '6291948210',
    cuBalance: 1120.50,
    joinedDate: 'Oct 12, 2023',
    joinedDateTime: '2023-10-12 11:30',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    status: 'OFFLINE',
    lastActive: '2h ago',
    referralCode: 'ALICEXY'
  },
  {
    username: '@charlie_nodes',
    name: 'Charlie Smith',
    uuid: 'ff43-11a2-9904-de12',
    telegramId: '4123904832',
    cuBalance: 1120.50,
    joinedDate: 'Oct 12, 2023',
    joinedDateTime: '2023-10-12 16:45',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    status: 'ONLINE',
    lastActive: 'Just now',
    referralCode: 'NODE_CHARLIE'
  },
  {
    username: '@bob_whale',
    name: 'Robert Whale',
    uuid: '992b-88c2-4410-faef',
    telegramId: '5102948123',
    cuBalance: 42.00,
    joinedDate: 'Oct 12, 2023',
    joinedDateTime: '2023-10-12 08:20',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    status: 'OFFLINE',
    lastActive: '1d ago',
    referralCode: 'BOBWHALER'
  },
  {
    username: '@delta_grid',
    name: 'Delta Gridder',
    uuid: 'cd77-11ff-8822-192a',
    telegramId: '7712104830',
    cuBalance: 9350.00,
    joinedDate: 'Jan 02, 2024',
    joinedDateTime: '2024-01-02 22:15',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    status: 'ONLINE',
    lastActive: '5m ago',
    referralCode: 'DELTAGRID'
  },
  {
    username: '@omega_bot',
    name: 'Omega Alpha',
    uuid: 'ab11-22cd-33ef-4455',
    telegramId: '8821948234',
    cuBalance: 0.00,
    joinedDate: 'Feb 20, 2024',
    joinedDateTime: '2024-02-20 18:30',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
    status: 'OFFLINE',
    lastActive: '5d ago',
    referralCode: 'OMEGATRADE'
  }
];

export const INITIAL_BOTS: Bot[] = [
  // Bots for @cryptodan88
  { id: 'S-99201', botType: 'Trailing DCA', name: 'BTC Trend Follower v2',  ticker: 'BTC/USDT',   userId: '@cryptodan88',   exchange: 'Binance Spot', cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '0.842 BTC',   pl24h:  2.45 },
  { id: 'S-88392', botType: 'Arbitrage',    name: 'ETH/BTC Arbitrage',       ticker: 'ETH/BTC',    userId: '@cryptodan88',   exchange: 'Kraken',       cycleCount:   842, pauseReason: '—', status: 'PAUSED',  balance: '12.50 ETH',   pl24h:  0.00 },
  { id: 'S-77212', botType: 'Scalper',      name: 'Solana Volatility Scalp', ticker: 'SOL/USDT',   userId: '@cryptodan88',   exchange: 'Binance Spot', cycleCount:  1242, pauseReason: '—', status: 'ACTIVE',  balance: '450.00 SOL',  pl24h: -0.12 },
  { id: 'S-11200', botType: 'DCA',          name: 'AI Market Neutral Alpha', ticker: 'BTC/USDT',   userId: '@cryptodan88',   exchange: 'Binance Spot', cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '5,000 USDT',  pl24h:  0.05 },

  // Bots for @johndoe_quant
  { id: 'S-55101', botType: 'Trailing DCA', name: 'JD BTC Trailing',         ticker: 'BTC/USDT',   userId: '@johndoe_quant', exchange: 'Binance',      cycleCount:  4210, pauseReason: '—', status: 'ACTIVE',  balance: '0.22 BTC',    pl24h:  1.10 },
  { id: 'S-55102', botType: 'Grid',         name: 'JD ETH Grid',             ticker: 'ETH/USDT',   userId: '@johndoe_quant', exchange: 'OKX',          cycleCount:  1840, pauseReason: '—', status: 'PAUSED',  balance: '3.10 ETH',    pl24h:  0.00 },

  // Bots for @alice_trades
  { id: 'S-33101', botType: 'DCA',          name: 'Alice BTC DCA',           ticker: 'BTC/USDT',   userId: '@alice_trades',  exchange: 'Binance Spot', cycleCount:   620, pauseReason: '—', status: 'ACTIVE',  balance: '0.05 BTC',    pl24h:  0.80 },
  { id: 'S-33102', botType: 'Grid',         name: 'Alice SOL Grid',          ticker: 'SOL/USDT',   userId: '@alice_trades',  exchange: 'Bybit',        cycleCount:   310, pauseReason: '—', status: 'PAUSED',  balance: '120.00 SOL',  pl24h:  0.00 },

  // Bots for @charlie_nodes
  { id: 'S-44101', botType: 'Martingale',   name: 'Charlie BNB Martingale',  ticker: 'BNB/USDT',   userId: '@charlie_nodes', exchange: 'Binance Spot', cycleCount:  2890, pauseReason: '—', status: 'ACTIVE',  balance: '18.50 BNB',   pl24h:  3.12 },
  { id: 'S-44102', botType: 'Trailing DCA', name: 'Charlie ETH Trailing',    ticker: 'ETH/USDT',   userId: '@charlie_nodes', exchange: 'OKX',          cycleCount:  1150, pauseReason: '—', status: 'ACTIVE',  balance: '2.80 ETH',    pl24h:  1.55 },
  { id: 'S-44103', botType: 'Scalper',      name: 'Charlie DOGE Scalper',    ticker: 'DOGE/USDT',  userId: '@charlie_nodes', exchange: 'Bybit',        cycleCount:   480, pauseReason: 'API Latency Spike > 500ms', status: 'ANOMALY', balance: '8,200 DOGE', pl24h: -2.10 },

  // Bots for @delta_grid
  { id: 'S-66101', botType: 'Grid',         name: 'Delta BTC Grid',          ticker: 'BTC/USDT',   userId: '@delta_grid',    exchange: 'Binance Spot', cycleCount:  5540, pauseReason: '—', status: 'ACTIVE',  balance: '0.38 BTC',    pl24h:  2.10 },
  { id: 'S-66102', botType: 'DCA',          name: 'Delta ETH Accumulator',   ticker: 'ETH/USDT',   userId: '@delta_grid',    exchange: 'Binance Spot', cycleCount:  2210, pauseReason: '—', status: 'ACTIVE',  balance: '4.20 ETH',    pl24h:  0.95 },

  // Other general layout bots
  { id: 'S-14291', botType: 'Grid',         name: 'Grid Bot Extreme',        ticker: 'BTC/USDT',   userId: 'Quant_Alpha_99', exchange: 'Binance',      cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '1.25 BTC',    pl24h:  1.85 },
  { id: 'S-00842', botType: 'Arbitrage',    name: 'Arbitrage Bot v4',        ticker: 'ETH/PERP',   userId: 'System_Admin_01',exchange: 'Kraken',       cycleCount:   842, pauseReason: 'API Latency Spike > 500ms', status: 'ANOMALY', balance: '45.10 ETH', pl24h: -3.42 },
  { id: 'S-14292', botType: 'Trailing DCA', name: 'BTC Scalper Dual-Rail',   ticker: 'BTC/USDT',   userId: 'System_Admin_01',exchange: 'Binance',      cycleCount: 14292, pauseReason: '—', status: 'ACTIVE',  balance: '350.00 USDT', pl24h:  0.35 },
  { id: 'S-14293', botType: 'Grid',         name: 'BTC Grid Fast-Lane',      ticker: 'BTC/USDT',   userId: 'Quant_Alpha_99', exchange: 'Binance',      cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '0.045 BTC',   pl24h:  1.12 },
  { id: 'S-00843', botType: 'DCA',          name: 'Eth Moonshot Grid',       ticker: 'ETH/USDT',   userId: 'System_Admin_01',exchange: 'Kraken',       cycleCount:   842, pauseReason: '—', status: 'PAUSED',  balance: '2.50 ETH',    pl24h:  0.00 },
  { id: 'S-14294', botType: 'Martingale',   name: 'Saber-X SOL Raider',      ticker: 'SOL/USDT',   userId: 'System_Alpha_99',exchange: 'Binance',      cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '185.00 SOL',  pl24h:  4.52 },
  { id: 'S-00844', botType: 'Scalper',      name: 'Perp Grid Heuristic',     ticker: 'ETH/PERP',   userId: 'System_Admin_01',exchange: 'Kraken',       cycleCount:   842, pauseReason: '—', status: 'PAUSED',  balance: '1,200 USDT',  pl24h:  0.00 },
];

export const INITIAL_SPEND_EVENTS: SpendEvent[] = [
  { eventName: 'SIGNUP_BONUS', spent: 5420 },
  { eventName: 'START_BOT', spent: 5420 },
  { eventName: 'CYCLE_START', spent: 5420 },
  { eventName: 'DCA_EXECUTED', spent: 2105 },
  { eventName: 'SELL_EXECUTED', spent: 3812 },
  { eventName: 'ADD_SUB_BALANCE', spent: 3812 }
];

export const INITIAL_STRATEGY_ACTIVITIES: StrategyActivity[] = [
  { strategyName: 'BTC DCA Bot', pair: 'BTC/USDT', cuSpent: 4320, cycles: 87, status: 'ACTIVE' },
  { strategyName: 'ETH Grid', pair: 'ETH/USDT', cuSpent: 3105, cycles: 64, status: 'ACTIVE' },
  { strategyName: 'SOL Martingale', pair: 'SOL/USDT', cuSpent: 2780, cycles: 42, status: 'PAUSED' },
  { strategyName: 'BNB Scalper', pair: 'BNB/USDT', cuSpent: 1940, cycles: 33, status: 'ACTIVE' },
  { strategyName: 'DOGE Swing', pair: 'DOGE/USDT', cuSpent: 890, cycles: 11, status: 'STOPPED' },
];

export const INITIAL_DAILY_BURN: DailyBurn[] = [
  { time: '00:00', spent: 210 },
  { time: '04:40', spent: 150 },
  { time: '08:00', spent: 340 },
  { time: '12:09', spent: 220 },
  { time: '18:59', spent: 480 },
  { time: '20:00', spent: 310 },
  { time: '23:59', spent: 650 }
];

export const INITIAL_ADMIN_ACTIVITY: AdminActivity[] = [
  { timestamp: '12:15:02', message: 'IP Check bypassed for specific Telegram region.',                   admin: '@admin_jack'  },
  { timestamp: '10:04:11', message: 'CU manual adjustment +500 for @cryptodan88 (Promo)',               admin: '@system_bot'  },
  { timestamp: '09:42:00', message: 'User account @alice_trades created via REG_API_V1.',               admin: 'REG_API_V1'   },
  { timestamp: '09:10:55', message: 'Bot S-99201 status changed to ACTIVE for @cryptodan88.',           admin: '@admin_jack'  },
  { timestamp: '08:55:30', message: 'CU manual adjustment -200 for @johndoe_quant (System correction)', admin: '@system_bot'  },
  { timestamp: '08:40:12', message: 'API key key-03 marked ERROR for @cryptodan88.',                    admin: '@system_bot'  },
  { timestamp: '08:20:00', message: 'Referral reward +200 CU credited to @charlie_nodes.',              admin: '@system_bot'  },
  { timestamp: '07:55:44', message: 'Bot S-44103 triggered ANOMALY for @charlie_nodes.',                admin: '@system_bot'  },
  { timestamp: '07:30:11', message: 'Payment pay-410 SUCCESS verified for @charlie_nodes.',             admin: 'PAYMENT_API'  },
  { timestamp: '07:10:05', message: 'Account @delta_grid upgraded to VIP tier.',                        admin: '@admin_jack'  },
  { timestamp: '06:50:00', message: 'CU purchase pay-610 +20000 CU for @delta_grid.',                   admin: 'PAYMENT_API'  },
  { timestamp: '06:30:22', message: 'Committed strategy changes (pending mutations applied).',           admin: '@admin_jack'  },
  { timestamp: '06:00:00', message: 'User @bob_whale flagged for zero balance — account dormant.',       admin: '@system_bot'  },
  { timestamp: '05:45:10', message: 'Account @omega_bot auto-suspended: zero CU for 30+ days.',         admin: '@system_bot'  },
];

export const MOCK_CU_HISTORY: Record<string, CUHistoryRecord[]> = {
  '@cryptodan88': [
    { id: 'tx-201', timestamp: '2026-06-04 09:05', type: 'SPENT',   amount:  -18.0, description: 'Trailing DCA entry trigger (S-99201)',           botType: 'Trailing DCA' },
    { id: 'tx-202', timestamp: '2026-06-03 14:22', type: 'ADJUST',  amount:   500,  description: 'Credit Unit (CU) manual adjustment (Promo)' },
    { id: 'tx-203', timestamp: '2026-06-03 12:10', type: 'SPENT',   amount:  -15.5, description: 'Bot trade cycle START_BOT (S-99201)',             botType: 'Trailing DCA' },
    { id: 'tx-204', timestamp: '2026-06-02 22:40', type: 'SPENT',   amount:   -6.5, description: 'Scalper cycle tick (S-77212)',                   botType: 'Scalper' },
    { id: 'tx-205', timestamp: '2026-06-02 18:45', type: 'BONUS',   amount:   100,  description: 'Affiliate referral bonus from @user_921' },
    { id: 'tx-206', timestamp: '2026-06-02 09:30', type: 'REFUND',  amount:    45,  description: 'API Latency error gas refund on @ETH_ARB',       botType: 'Arbitrage' },
    { id: 'tx-207', timestamp: '2026-06-01 22:12', type: 'SPENT',   amount:   -8.2, description: 'Bot DCA execution DCA_EXECUTED (S-77212)',        botType: 'DCA' },
    { id: 'tx-208', timestamp: '2026-06-01 15:00', type: 'SPENT',   amount:  -12.0, description: 'Grid rebalance cycle (S-11200)',                  botType: 'Grid' },
    { id: 'tx-209', timestamp: '2026-06-01 10:05', type: 'SPENT',   amount:   -4.1, description: 'Scalper tick SELL triggered (S-77212)',           botType: 'Scalper' },
    { id: 'tx-210', timestamp: '2026-05-31 20:40', type: 'SPENT',   amount:  -10.0, description: 'Arbitrage spread captured (S-88392)',             botType: 'Arbitrage' },
    { id: 'tx-211', timestamp: '2026-05-31 08:15', type: 'SPENT',   amount:   -6.5, description: 'Trailing DCA safety order (S-99201)',             botType: 'Trailing DCA' },
    { id: 'tx-212', timestamp: '2026-05-30 18:00', type: 'ADJUST',  amount:  1000,  description: 'CU package purchase — 10,000 CU bundle' },
  ],
  '@johndoe_quant': [
    { id: 'tx-301', timestamp: '2026-06-04 08:40', type: 'SPENT',   amount:   -9.0, description: 'Trailing DCA buy trigger (S-55101)',              botType: 'Trailing DCA' },
    { id: 'tx-302', timestamp: '2026-06-03 15:30', type: 'ADJUST',  amount:  -200,  description: 'CU Deducted - System correction' },
    { id: 'tx-303', timestamp: '2026-06-03 10:15', type: 'BONUS',   amount:   500,  description: 'Bronze affiliate reward bonus' },
    { id: 'tx-304', timestamp: '2026-06-03 06:50', type: 'SPENT',   amount:   -3.5, description: 'Grid rebalance tick (S-55102)',                   botType: 'Grid' },
    { id: 'tx-305', timestamp: '2026-06-02 21:20', type: 'SPENT',   amount:   -5.0, description: 'Trailing DCA safety order filled (S-55101)',      botType: 'Trailing DCA' },
    { id: 'tx-306', timestamp: '2026-06-02 14:00', type: 'REFUND',  amount:    12,  description: 'API connectivity refund — OKX downtime' },
    { id: 'tx-307', timestamp: '2026-06-01 09:30', type: 'SPENT',   amount:   -7.5, description: 'Grid cycle close (S-55102)',                      botType: 'Grid' },
    { id: 'tx-308', timestamp: '2026-05-31 11:00', type: 'ADJUST',  amount:   500,  description: 'CU top-up (Promo — new user discount)' },
  ],
  '@alice_trades': [
    { id: 'tx-401', timestamp: '2026-06-04 07:10', type: 'SPENT',   amount:   -6.0, description: 'DCA base order placed (S-33101)',                 botType: 'DCA' },
    { id: 'tx-402', timestamp: '2026-06-03 18:30', type: 'SPENT',   amount:   -3.5, description: 'Grid rebalance tick (S-33102)',                   botType: 'Grid' },
    { id: 'tx-403', timestamp: '2026-06-03 11:00', type: 'ADJUST',  amount:   300,  description: 'Credit Unit (CU) manual top-up (Promo)' },
    { id: 'tx-404', timestamp: '2026-06-02 20:10', type: 'BONUS',   amount:    50,  description: 'Affiliate signup bonus from @ref_xyz' },
    { id: 'tx-405', timestamp: '2026-06-02 14:30', type: 'SPENT',   amount:   -4.0, description: 'DCA safety order triggered (S-33101)',             botType: 'DCA' },
    { id: 'tx-406', timestamp: '2026-06-01 22:00', type: 'SPENT',   amount:   -2.8, description: 'Grid close cycle (S-33102)',                      botType: 'Grid' },
    { id: 'tx-407', timestamp: '2026-06-01 10:05', type: 'REFUND',  amount:    15,  description: 'Network fee refund — Bybit maintenance' },
    { id: 'tx-408', timestamp: '2026-05-30 09:00', type: 'ADJUST',  amount:   200,  description: 'CU purchase — starter pack' },
  ],
  '@charlie_nodes': [
    { id: 'tx-501', timestamp: '2026-06-04 07:20', type: 'SPENT',   amount:  -14.0, description: 'Martingale entry trigger (S-44101)',              botType: 'Martingale' },
    { id: 'tx-502', timestamp: '2026-06-04 05:55', type: 'SPENT',   amount:   -9.5, description: 'Trailing DCA buy order (S-44102)',                botType: 'Trailing DCA' },
    { id: 'tx-503', timestamp: '2026-06-03 22:10', type: 'SPENT',   amount:   -2.1, description: 'Scalper tick (S-44103)',                          botType: 'Scalper' },
    { id: 'tx-504', timestamp: '2026-06-03 18:00', type: 'ADJUST',  amount:   500,  description: 'Admin manual credit (Promo Campaign)' },
    { id: 'tx-505', timestamp: '2026-06-03 12:40', type: 'SPENT',   amount:  -11.5, description: 'Martingale level 2 order (S-44101)',              botType: 'Martingale' },
    { id: 'tx-506', timestamp: '2026-06-03 08:00', type: 'SPENT',   amount:   -8.0, description: 'Trailing DCA TP triggered (S-44102)',             botType: 'Trailing DCA' },
    { id: 'tx-507', timestamp: '2026-06-02 20:30', type: 'BONUS',   amount:   200,  description: 'Referral reward — @grid_master signup' },
    { id: 'tx-508', timestamp: '2026-06-02 09:40', type: 'REFUND',  amount:    20,  description: 'API error refund — DOGE scalper timeout' },
    { id: 'tx-509', timestamp: '2026-06-01 15:00', type: 'SPENT',   amount:   -6.5, description: 'Scalper cycle BUY (S-44103)',                     botType: 'Scalper' },
    { id: 'tx-510', timestamp: '2026-05-31 09:00', type: 'ADJUST',  amount:  1000,  description: 'CU purchase — Pro pack 10,000 CU' },
  ],
  '@delta_grid': [
    { id: 'tx-601', timestamp: '2026-06-04 08:10', type: 'SPENT',   amount:  -11.0, description: 'Grid rebalance cycle (S-66101)',                  botType: 'Grid' },
    { id: 'tx-602', timestamp: '2026-06-04 04:30', type: 'SPENT',   amount:   -7.0, description: 'DCA accumulator tick (S-66102)',                  botType: 'DCA' },
    { id: 'tx-603', timestamp: '2026-06-03 22:00', type: 'SPENT',   amount:   -9.5, description: 'Grid close cycle TP hit (S-66101)',               botType: 'Grid' },
    { id: 'tx-604', timestamp: '2026-06-03 15:00', type: 'BONUS',   amount:   200,  description: 'VIP tier upgrade bonus' },
    { id: 'tx-605', timestamp: '2026-06-03 10:40', type: 'SPENT',   amount:   -5.5, description: 'DCA base order (S-66102)',                        botType: 'DCA' },
    { id: 'tx-606', timestamp: '2026-06-02 18:20', type: 'ADJUST',  amount:  1000,  description: 'Credit Unit (CU) purchase package' },
    { id: 'tx-607', timestamp: '2026-06-02 09:00', type: 'SPENT',   amount:  -13.0, description: 'Grid safety order placed (S-66101)',              botType: 'Grid' },
    { id: 'tx-608', timestamp: '2026-06-01 20:15', type: 'REFUND',  amount:    30,  description: 'System latency refund — Binance API timeout' },
    { id: 'tx-609', timestamp: '2026-06-01 08:00', type: 'ADJUST',  amount:  2000,  description: 'CU purchase — VIP bundle 20,000 CU' },
  ],
  '@bob_whale': [
    { id: 'tx-701', timestamp: '2026-06-01 11:00', type: 'ADJUST',  amount:   -42,  description: 'CU expired — zero balance auto-deduct' },
    { id: 'tx-702', timestamp: '2026-05-20 09:00', type: 'BONUS',   amount:    42,  description: 'Welcome signup bonus' },
  ],
  '@omega_bot': [
    { id: 'tx-801', timestamp: '2026-04-15 10:01', type: 'SPENT',   amount:   -50,  description: 'Initial bot test cycle — all balance consumed' },
    { id: 'tx-802', timestamp: '2026-04-15 10:00', type: 'BONUS',   amount:    50,  description: 'Welcome signup bonus' },
  ],
};

export const MOCK_API_KEYS: Record<string, UserApiKey[]> = {
  '@cryptodan88': [
    { id: 'key-01', name: 'Binance Live Trade API',    exchange: 'Binance Spot', keyMask: 'uT4b...89zK', created: 'Oct 14, 2023', status: 'ACTIVE' },
    { id: 'key-02', name: 'Kraken High Latency Hook',  exchange: 'Kraken',       keyMask: 'p99R...1z2A', created: 'Nov 02, 2023', status: 'ACTIVE' },
    { id: 'key-03', name: 'Bybit Scalp API (Stale)',   exchange: 'Bybit',        keyMask: '9x8A...aaW0', created: 'Jan 10, 2024', status: 'ERROR'  },
  ],
  '@johndoe_quant': [
    { id: 'key-11', name: 'Binance Main API',          exchange: 'Binance',      keyMask: 'aB3c...12dE', created: 'Nov 05, 2023', status: 'ACTIVE' },
    { id: 'key-12', name: 'OKX Grid Bot Key',          exchange: 'OKX',          keyMask: 'xZ9k...77mQ', created: 'Dec 18, 2023', status: 'ACTIVE' },
  ],
  '@alice_trades': [
    { id: 'key-21', name: 'Binance DCA Key',           exchange: 'Binance Spot', keyMask: 'rT8p...33nA', created: 'Jan 20, 2024', status: 'ACTIVE' },
    { id: 'key-22', name: 'Bybit Grid Key',            exchange: 'Bybit',        keyMask: 'mN2q...55bC', created: 'Feb 14, 2024', status: 'ERROR'  },
  ],
  '@charlie_nodes': [
    { id: 'key-31', name: 'Binance Martingale Key',    exchange: 'Binance Spot', keyMask: 'pQ4w...88eR', created: 'Mar 01, 2024', status: 'ACTIVE' },
    { id: 'key-32', name: 'OKX Trailing API',          exchange: 'OKX',          keyMask: 'kL5s...21fT', created: 'Mar 15, 2024', status: 'ACTIVE' },
    { id: 'key-33', name: 'Bybit DOGE Scalper',        exchange: 'Bybit',        keyMask: 'vW7u...99gU', created: 'Apr 02, 2024', status: 'ERROR'  },
  ],
  '@delta_grid': [
    { id: 'key-41', name: 'Binance Grid Primary',      exchange: 'Binance Spot', keyMask: 'yZ1x...44hV', created: 'Feb 10, 2024', status: 'ACTIVE' },
    { id: 'key-42', name: 'Binance DCA Secondary',     exchange: 'Binance Spot', keyMask: 'iJ6o...66iW', created: 'Mar 22, 2024', status: 'ACTIVE' },
  ],
};

export const MOCK_PAYMENTS: Record<string, PaymentRecord[]> = {
  '@cryptodan88': [
    { id: 'pay-772', timestamp: '2026-05-28 09:12', amountUsd: 150.00, cuCredited: 15000, method: 'Stripe Credit Card',      status: 'SUCCESS' },
    { id: 'pay-651', timestamp: '2026-04-12 11:45', amountUsd:  50.00, cuCredited:  5000, method: 'Crypto Pay (USDT_TRC20)', status: 'SUCCESS' },
    { id: 'pay-213', timestamp: '2026-03-30 18:22', amountUsd: 100.00, cuCredited: 10000, method: 'GatePay Crypto',           status: 'FAILED'  },
  ],
  '@johndoe_quant': [
    { id: 'pay-890', timestamp: '2026-05-20 14:05', amountUsd:  75.00, cuCredited:  7500, method: 'Stripe Credit Card',      status: 'SUCCESS' },
    { id: 'pay-512', timestamp: '2026-04-08 09:30', amountUsd:  25.00, cuCredited:  2500, method: 'Crypto Pay (USDT_TRC20)', status: 'PENDING' },
  ],
  '@alice_trades': [
    { id: 'pay-320', timestamp: '2026-05-10 16:00', amountUsd:  30.00, cuCredited:  3000, method: 'Stripe Credit Card',      status: 'SUCCESS' },
  ],
  '@charlie_nodes': [
    { id: 'pay-410', timestamp: '2026-06-01 11:20', amountUsd: 100.00, cuCredited: 10000, method: 'GatePay Crypto',           status: 'SUCCESS' },
    { id: 'pay-411', timestamp: '2026-05-05 08:45', amountUsd:  50.00, cuCredited:  5000, method: 'Crypto Pay (USDT_TRC20)', status: 'SUCCESS' },
    { id: 'pay-412', timestamp: '2026-04-18 14:30', amountUsd:  20.00, cuCredited:  2000, method: 'Stripe Credit Card',      status: 'FAILED'  },
  ],
  '@delta_grid': [
    { id: 'pay-610', timestamp: '2026-06-02 10:00', amountUsd: 200.00, cuCredited: 20000, method: 'Crypto Pay (USDT_TRC20)', status: 'SUCCESS' },
    { id: 'pay-611', timestamp: '2026-05-15 13:30', amountUsd: 100.00, cuCredited: 10000, method: 'GatePay Crypto',           status: 'SUCCESS' },
  ],
};

export const MOCK_REFERRALS: Record<string, ReferralsInfo> = {
  '@cryptodan88': {
    referralCode: 'DAN88QUANT',
    clicks: 1420,
    signups: 68,
    activeReferrals: 12,
    totalEarningsCu: 4500,
    referredUsers: [
      { username: '@moon_scalper', joined: 'Oct 23, 2023', status: 'ACTIVE', earningsCu: 1200 },
      { username: '@hodl_pro', joined: 'Nov 01, 2023', status: 'ACTIVE', earningsCu: 850 },
      { username: '@btc_enthusiast', joined: 'Jan 12, 2024', status: 'ACTIVE', earningsCu: 450 },
      { username: '@trading_noob', joined: 'Jan 22, 2024', status: 'INACTIVE', earningsCu: 0 }
    ]
  },
  '@johndoe_quant': {
    referralCode: 'JDOE_QUANT',
    clicks: 345,
    signups: 14,
    activeReferrals: 3,
    totalEarningsCu: 900,
    referredUsers: [
      { username: '@sub_trader', joined: 'Nov 12, 2023', status: 'ACTIVE',   earningsCu: 600 },
      { username: '@zero_risk',  joined: 'Nov 19, 2023', status: 'INACTIVE', earningsCu: 100 },
    ]
  },
  '@alice_trades': {
    referralCode: 'ALICEXY',
    clicks: 120,
    signups: 5,
    activeReferrals: 2,
    totalEarningsCu: 300,
    referredUsers: [
      { username: '@alice_friend1', joined: 'Feb 02, 2024', status: 'ACTIVE',   earningsCu: 200 },
      { username: '@alice_friend2', joined: 'Mar 10, 2024', status: 'INACTIVE', earningsCu: 100 },
    ]
  },
  '@charlie_nodes': {
    referralCode: 'NODE_CHARLIE',
    clicks: 820,
    signups: 32,
    activeReferrals: 8,
    totalEarningsCu: 2800,
    referredUsers: [
      { username: '@grid_master',   joined: 'Apr 05, 2024', status: 'ACTIVE',   earningsCu: 900 },
      { username: '@node_runner',   joined: 'Apr 18, 2024', status: 'ACTIVE',   earningsCu: 750 },
      { username: '@dca_daily',     joined: 'May 01, 2024', status: 'ACTIVE',   earningsCu: 650 },
      { username: '@crypto_lurker', joined: 'May 20, 2024', status: 'INACTIVE', earningsCu: 500 },
    ]
  },
  '@delta_grid': {
    referralCode: 'DELTAGRID',
    clicks: 540,
    signups: 21,
    activeReferrals: 6,
    totalEarningsCu: 1600,
    referredUsers: [
      { username: '@delta_ref1', joined: 'Mar 03, 2024', status: 'ACTIVE',   earningsCu: 700 },
      { username: '@delta_ref2', joined: 'Mar 25, 2024', status: 'ACTIVE',   earningsCu: 500 },
      { username: '@delta_ref3', joined: 'Apr 10, 2024', status: 'INACTIVE', earningsCu: 400 },
    ]
  },
};

export const MOCK_ALL_PAYMENTS: PaymentRecord[] = [
  { id: 'pay-772', username: '@cryptodan88',    timestamp: '2026-05-28 09:12', amountUsd: 150.00, cuCredited: 15000, method: 'Stripe Credit Card',      status: 'SUCCESS' },
  { id: 'pay-651', username: '@cryptodan88',    timestamp: '2026-04-12 11:45', amountUsd:  50.00, cuCredited:  5000, method: 'Crypto Pay (USDT_TRC20)', status: 'SUCCESS' },
  { id: 'pay-213', username: '@cryptodan88',    timestamp: '2026-03-30 18:22', amountUsd: 100.00, cuCredited: 10000, method: 'GatePay Crypto',           status: 'FAILED'  },
  { id: 'pay-890', username: '@johndoe_quant',  timestamp: '2026-05-20 14:05', amountUsd:  75.00, cuCredited:  7500, method: 'Stripe Credit Card',      status: 'SUCCESS' },
  { id: 'pay-512', username: '@johndoe_quant',  timestamp: '2026-04-08 09:30', amountUsd:  25.00, cuCredited:  2500, method: 'Crypto Pay (USDT_TRC20)', status: 'PENDING' },
  { id: 'pay-301', username: '@moon_scalper',   timestamp: '2026-05-15 17:44', amountUsd: 200.00, cuCredited: 20000, method: 'GatePay Crypto',           status: 'SUCCESS' },
  { id: 'pay-144', username: '@hodl_pro',       timestamp: '2026-05-10 08:20', amountUsd:  50.00, cuCredited:  5000, method: 'Stripe Credit Card',      status: 'SUCCESS' },
  { id: 'pay-088', username: '@btc_enthusiast', timestamp: '2026-04-22 21:15', amountUsd: 300.00, cuCredited: 30000, method: 'Crypto Pay (USDT_TRC20)', status: 'SUCCESS' },
];

export const MOCK_USER_TRADING_STATS: Record<string, UserTradingStats> = {
  '@cryptodan88': {
    totalVolume: 482310, totalPnl:  12450, totalTxns: 1842, winRate: 63.4,
    byExchange: [
      { exchange: 'Binance', volume: 280000, pnl:  8200, txns: 1120 },
      { exchange: 'Bybit',   volume: 120000, pnl:  3100, txns:  520 },
      { exchange: 'Kraken',  volume:  82310, pnl:  1150, txns:  202 },
    ]
  },
  '@johndoe_quant': {
    totalVolume: 134200, totalPnl:  -1820, totalTxns:  440, winRate: 48.2,
    byExchange: [
      { exchange: 'Binance', volume:  90000, pnl: -1200, txns: 280 },
      { exchange: 'OKX',     volume:  44200, pnl:  -620, txns: 160 },
    ]
  },
  '@alice_trades': {
    totalVolume:  48200, totalPnl:    920, totalTxns:  184, winRate: 54.3,
    byExchange: [
      { exchange: 'Binance', volume:  30000, pnl:   720, txns: 120 },
      { exchange: 'Bybit',   volume:  18200, pnl:   200, txns:  64 },
    ]
  },
  '@charlie_nodes': {
    totalVolume: 219800, totalPnl:   5410, totalTxns:  820, winRate: 58.1,
    byExchange: [
      { exchange: 'Binance', volume: 120000, pnl:  3200, txns: 480 },
      { exchange: 'OKX',     volume:  60000, pnl:  1500, txns: 220 },
      { exchange: 'Bybit',   volume:  39800, pnl:   710, txns: 120 },
    ]
  },
  '@delta_grid': {
    totalVolume: 312400, totalPnl:   8820, totalTxns: 1120, winRate: 61.8,
    byExchange: [
      { exchange: 'Binance', volume: 312400, pnl:  8820, txns: 1120 },
    ]
  },
  '@bob_whale': {
    totalVolume:    420, totalPnl:    -12, totalTxns:    4, winRate: 25.0,
    byExchange: []
  },
};

export const MOCK_TRADING_REPORT: TradingReportRow[] = [
  { exchange: 'Binance',  pair: 'BTC/USDT',  txns: 4820, volume: 9_240_000, pnl:  54200, winRate: 61.2, lastActivity: '2026-06-04 09:41' },
  { exchange: 'Binance',  pair: 'ETH/USDT',  txns: 3105, volume: 4_880_000, pnl:  28100, winRate: 58.7, lastActivity: '2026-06-04 09:38' },
  { exchange: 'OKX',      pair: 'BTC/USDT',  txns: 1840, volume: 3_120_000, pnl:  17800, winRate: 56.1, lastActivity: '2026-06-04 08:55' },
  { exchange: 'Bybit',    pair: 'SOL/USDT',  txns: 2210, volume: 1_640_000, pnl:  -4300, winRate: 44.3, lastActivity: '2026-06-04 07:22' },
  { exchange: 'OKX',      pair: 'ETH/USDT',  txns:  980, volume: 1_210_000, pnl:   9100, winRate: 59.4, lastActivity: '2026-06-03 23:11' },
  { exchange: 'Bybit',    pair: 'BNB/USDT',  txns:  760, volume:   880_000, pnl:   3200, winRate: 52.6, lastActivity: '2026-06-03 22:40' },
  { exchange: 'Kraken',   pair: 'BTC/USDT',  txns:  420, volume:   720_000, pnl:  -1100, winRate: 46.8, lastActivity: '2026-06-03 18:05' },
  { exchange: 'Binance',  pair: 'DOGE/USDT', txns: 1580, volume:   540_000, pnl:  -8400, winRate: 41.5, lastActivity: '2026-06-03 16:30' },
];

export const INITIAL_EXCHANGES: Exchange[] = [
  {
    id: 'ex-1',
    name: 'Binance',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=120',
    status: 'ACTIVE',
    guideUrl: 'https://www.binance.com/vi/support/faq/c-3'
  },
  {
    id: 'ex-2',
    name: 'OKX',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&q=80&w=120',
    status: 'ACTIVE',
    guideUrl: 'https://www.okx.com/help-center/section/api'
  },
  {
    id: 'ex-3',
    name: 'Bybit',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=120',
    status: 'ACTIVE',
    guideUrl: 'https://learn.bybit.com/bybit-active/how-to-use-bybit-api/'
  },
  {
    id: 'ex-4',
    name: 'Kraken',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=120',
    status: 'INACTIVE',
    guideUrl: 'https://support.kraken.com/hc/en-us/articles/360001185506-How-to-create-an-API-key'
  }
];
