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
  {
    id: 'S-99201',
    name: 'BTC Trend Follower v2',
    ticker: 'BTC/USDT-GRID',
    userId: '@cryptodan88',
    exchange: 'Binance Spot',
    cycleCount: 14291,
    pauseReason: '—',
    status: 'ACTIVE',
    balance: '0.842 BTC',
    pl24h: 2.45
  },
  {
    id: 'S-88392',
    name: 'ETH/BTC Arbitrage',
    ticker: 'ETH/PERP-ARB',
    userId: '@cryptodan88',
    exchange: 'Kraken',
    cycleCount: 842,
    pauseReason: '—',
    status: 'PAUSED',
    balance: '12.50 ETH',
    pl24h: 0.00
  },
  {
    id: 'S-77212',
    name: 'Solana Volatility Scalp',
    ticker: 'SOL/USDT-GRID',
    userId: '@cryptodan88',
    exchange: 'Binance Spot',
    cycleCount: 1242,
    pauseReason: '—',
    status: 'ACTIVE',
    balance: '450.00 SOL',
    pl24h: -0.12
  },
  {
    id: 'S-11200',
    name: 'AI Market Neutral Alpha',
    ticker: 'BTC/USDT-GRID',
    userId: '@cryptodan88',
    exchange: 'Binance Spot',
    cycleCount: 14291,
    pauseReason: '—',
    status: 'ACTIVE',
    balance: '5,000 USDT',
    pl24h: 0.05
  },

  // Other general layout bots
  {
    id: 'S-14291',
    name: 'Grid Bot Extreme',
    ticker: 'BTC/USDT-GRID',
    userId: 'Quant_Alpha_99',
    exchange: 'Binance',
    cycleCount: 14291,
    pauseReason: '—',
    status: 'ACTIVE',
    balance: '1.25 BTC',
    pl24h: 1.85
  },
  {
    id: 'S-00842',
    name: 'Arbitrage Bot v4',
    ticker: 'ETH/PERP-ARB',
    userId: 'System_Admin_01',
    exchange: 'Kraken',
    cycleCount: 842,
    pauseReason: 'API Latency Spike > 500ms',
    status: 'ANOMALY',
    balance: '45.10 ETH',
    pl24h: -3.42
  },
  {
    id: 'S-14292',
    name: 'BTC Scalper Dual-Rail',
    ticker: 'BTC/USDT-GRID',
    userId: 'System_Admin_01',
    exchange: 'Binance',
    cycleCount: 14292,
    pauseReason: '—',
    status: 'ACTIVE',
    balance: '350.00 USDT',
    pl24h: 0.35
  },
  {
    id: 'S-14293',
    name: 'BTC Grid Fast-Lane',
    ticker: 'BTC/USDT-GRID',
    userId: 'Quant_Alpha_99',
    exchange: 'Binance',
    cycleCount: 14291,
    pauseReason: '—',
    status: 'ACTIVE',
    balance: '0.045 BTC',
    pl24h: 1.12
  },
  {
    id: 'S-00843',
    name: 'Eth Moonshot Grid',
    ticker: 'BTC/USDT-GRID',
    userId: 'System_Admin_01',
    exchange: 'Kraken',
    cycleCount: 842,
    pauseReason: '—',
    status: 'PAUSED',
    balance: '2.50 ETH',
    pl24h: 0.00
  },
  {
    id: 'S-14294',
    name: 'Saber-X SOL Raider',
    ticker: 'BTC/USDT-GRID',
    userId: 'System_Alpha_99',
    exchange: 'Binance',
    cycleCount: 14291,
    pauseReason: '—',
    status: 'ACTIVE',
    balance: '185.00 SOL',
    pl24h: 4.52
  },
  {
    id: 'S-00844',
    name: 'Perp Grid Heuristic',
    ticker: 'ETH/PERP-ARB',
    userId: 'System_Admin_01',
    exchange: 'Kraken',
    cycleCount: 842,
    pauseReason: '—',
    status: 'PAUSED',
    balance: '1,200 USDT',
    pl24h: 0.00
  }
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
  {
    timestamp: '12:15:02',
    message: 'IP Check bypassed for specific Telegram region.',
    admin: '@admin_jack'
  },
  {
    timestamp: '10:04:11',
    message: 'Credit Unit (CU) manual adjustment: +500 (Promo)',
    admin: '@system_bot'
  },
  {
    timestamp: '09:42:00',
    message: 'User account created.',
    admin: 'REG_API_V1'
  }
];

export const MOCK_CU_HISTORY: Record<string, CUHistoryRecord[]> = {
  '@cryptodan88': [
    { id: 'tx-201', timestamp: '2026-06-03 14:22', type: 'ADJUST', amount: 500, description: 'Credit Unit (CU) manual adjustment (Promo)' },
    { id: 'tx-202', timestamp: '2026-06-03 12:10', type: 'SPENT', amount: -15.5, description: 'Bot trade cycle START_BOT (S-99201)' },
    { id: 'tx-203', timestamp: '2026-06-02 18:45', type: 'BONUS', amount: 100, description: 'Affiliate referral bonus from @user_921' },
    { id: 'tx-204', timestamp: '2026-06-02 09:30', type: 'REFUND', amount: 45.0, description: 'API Latency error gas refund on @ETH_ARB' },
    { id: 'tx-205', timestamp: '2026-06-01 22:12', type: 'SPENT', amount: -8.2, description: 'Bot DCA execution cycle DCA_EXECUTED (S-77212)' }
  ],
  '@johndoe_quant': [
    { id: 'tx-301', timestamp: '2026-06-03 15:30', type: 'ADJUST', amount: -200, description: 'CU Deducted - System correction' },
    { id: 'tx-302', timestamp: '2026-06-03 10:15', type: 'BONUS', amount: 500, description: 'Bronze affiliate reward bonus' }
  ]
};

export const MOCK_API_KEYS: Record<string, UserApiKey[]> = {
  '@cryptodan88': [
    { id: 'key-01', name: 'Binance Live Trade API', exchange: 'Binance Spot', keyMask: 'uT4b...89zK', created: 'Oct 14, 2023', status: 'ACTIVE' },
    { id: 'key-02', name: 'Kraken High Latency Hook', exchange: 'Kraken', keyMask: 'p99R...1z2A', created: 'Nov 02, 2023', status: 'ACTIVE' },
    { id: 'key-03', name: 'Bybit Scalp API (Stale)', exchange: 'Bybit', keyMask: '9x8A...aaW0', created: 'Jan 10, 2024', status: 'ERROR' }
  ]
};

export const MOCK_PAYMENTS: Record<string, PaymentRecord[]> = {
  '@cryptodan88': [
    { id: 'pay-772', timestamp: '2026-05-28 09:12', amountUsd: 150.00, cuCredited: 15000, method: 'Stripe Credit Card', status: 'SUCCESS' },
    { id: 'pay-651', timestamp: '2026-04-12 11:45', amountUsd: 50.00, cuCredited: 5000, method: 'Crypto Pay (USDT_TRC20)', status: 'SUCCESS' },
    { id: 'pay-213', timestamp: '2026-03-30 18:22', amountUsd: 100.00, cuCredited: 10000, method: 'GatePay Crypto', status: 'FAILED' }
  ]
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
      { username: '@sub_trader', joined: 'Nov 12, 2023', status: 'ACTIVE', earningsCu: 600 },
      { username: '@zero_risk', joined: 'Nov 19, 2023', status: 'INACTIVE', earningsCu: 100 }
    ]
  }
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
    totalVolume: 482310,
    totalPnl: 12450,
    totalTxns: 1842,
    winRate: 63.4,
    byExchange: [
      { exchange: 'Binance',  volume: 280000, pnl:  8200, txns: 1120 },
      { exchange: 'Bybit',    volume: 120000, pnl:  3100, txns:  520 },
      { exchange: 'Kraken',   volume:  82310, pnl:  1150, txns:  202 },
    ]
  },
  '@johndoe_quant': {
    totalVolume: 134200,
    totalPnl: -1820,
    totalTxns: 440,
    winRate: 48.2,
    byExchange: [
      { exchange: 'Binance',  volume:  90000, pnl: -1200, txns: 280 },
      { exchange: 'OKX',      volume:  44200, pnl:  -620, txns: 160 },
    ]
  }
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
