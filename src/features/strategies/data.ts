import { Bot } from '../../types';

export const INITIAL_BOTS: Bot[] = [
  // @cryptodan88
  { id: 'S-99201', botType: 'Trailing DCA', name: 'BTC Trend Follower v2',  ticker: 'BTC/USDT',  userId: '@cryptodan88',    exchange: 'Binance Spot', cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '0.842 BTC',    pl24h:  2.45 },
  { id: 'S-88392', botType: 'Arbitrage',    name: 'ETH/BTC Arbitrage',       ticker: 'ETH/BTC',   userId: '@cryptodan88',    exchange: 'Kraken',       cycleCount:   842, pauseReason: '—', status: 'PAUSED',  balance: '12.50 ETH',    pl24h:  0.00 },
  { id: 'S-77212', botType: 'Scalper',      name: 'Solana Volatility Scalp', ticker: 'SOL/USDT',  userId: '@cryptodan88',    exchange: 'Binance Spot', cycleCount:  1242, pauseReason: '—', status: 'ACTIVE',  balance: '450.00 SOL',   pl24h: -0.12 },
  { id: 'S-11200', botType: 'DCA',          name: 'AI Market Neutral Alpha', ticker: 'BTC/USDT',  userId: '@cryptodan88',    exchange: 'Binance Spot', cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '5,000 USDT',   pl24h:  0.05 },

  // @johndoe_quant
  { id: 'S-55101', botType: 'Trailing DCA', name: 'JD BTC Trailing',         ticker: 'BTC/USDT',  userId: '@johndoe_quant',  exchange: 'Binance',      cycleCount:  4210, pauseReason: '—', status: 'ACTIVE',  balance: '0.22 BTC',     pl24h:  1.10 },
  { id: 'S-55102', botType: 'Grid',         name: 'JD ETH Grid',             ticker: 'ETH/USDT',  userId: '@johndoe_quant',  exchange: 'OKX',          cycleCount:  1840, pauseReason: '—', status: 'PAUSED',  balance: '3.10 ETH',     pl24h:  0.00 },

  // @alice_trades
  { id: 'S-33101', botType: 'DCA',          name: 'Alice BTC DCA',           ticker: 'BTC/USDT',  userId: '@alice_trades',   exchange: 'Binance Spot', cycleCount:   620, pauseReason: '—', status: 'ACTIVE',  balance: '0.05 BTC',     pl24h:  0.80 },
  { id: 'S-33102', botType: 'Grid',         name: 'Alice SOL Grid',          ticker: 'SOL/USDT',  userId: '@alice_trades',   exchange: 'Bybit',        cycleCount:   310, pauseReason: '—', status: 'PAUSED',  balance: '120.00 SOL',   pl24h:  0.00 },

  // @charlie_nodes
  { id: 'S-44101', botType: 'Martingale',   name: 'Charlie BNB Martingale',  ticker: 'BNB/USDT',  userId: '@charlie_nodes',  exchange: 'Binance Spot', cycleCount:  2890, pauseReason: '—', status: 'ACTIVE',  balance: '18.50 BNB',    pl24h:  3.12 },
  { id: 'S-44102', botType: 'Trailing DCA', name: 'Charlie ETH Trailing',    ticker: 'ETH/USDT',  userId: '@charlie_nodes',  exchange: 'OKX',          cycleCount:  1150, pauseReason: '—', status: 'ACTIVE',  balance: '2.80 ETH',     pl24h:  1.55 },
  { id: 'S-44103', botType: 'Scalper',      name: 'Charlie DOGE Scalper',    ticker: 'DOGE/USDT', userId: '@charlie_nodes',  exchange: 'Bybit',        cycleCount:   480, pauseReason: 'API Latency Spike > 500ms', status: 'ANOMALY', balance: '8,200 DOGE', pl24h: -2.10 },

  // @delta_grid
  { id: 'S-66101', botType: 'Grid',         name: 'Delta BTC Grid',          ticker: 'BTC/USDT',  userId: '@delta_grid',     exchange: 'Binance Spot', cycleCount:  5540, pauseReason: '—', status: 'ACTIVE',  balance: '0.38 BTC',     pl24h:  2.10 },
  { id: 'S-66102', botType: 'DCA',          name: 'Delta ETH Accumulator',   ticker: 'ETH/USDT',  userId: '@delta_grid',     exchange: 'Binance Spot', cycleCount:  2210, pauseReason: '—', status: 'ACTIVE',  balance: '4.20 ETH',     pl24h:  0.95 },

  // General layout bots
  { id: 'S-14291', botType: 'Grid',         name: 'Grid Bot Extreme',        ticker: 'BTC/USDT',  userId: 'Quant_Alpha_99',  exchange: 'Binance',      cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '1.25 BTC',     pl24h:  1.85 },
  { id: 'S-00842', botType: 'Arbitrage',    name: 'Arbitrage Bot v4',        ticker: 'ETH/PERP',  userId: 'System_Admin_01', exchange: 'Kraken',       cycleCount:   842, pauseReason: 'API Latency Spike > 500ms', status: 'ANOMALY', balance: '45.10 ETH', pl24h: -3.42 },
  { id: 'S-14292', botType: 'Trailing DCA', name: 'BTC Scalper Dual-Rail',   ticker: 'BTC/USDT',  userId: 'System_Admin_01', exchange: 'Binance',      cycleCount: 14292, pauseReason: '—', status: 'ACTIVE',  balance: '350.00 USDT',  pl24h:  0.35 },
  { id: 'S-14293', botType: 'Grid',         name: 'BTC Grid Fast-Lane',      ticker: 'BTC/USDT',  userId: 'Quant_Alpha_99',  exchange: 'Binance',      cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '0.045 BTC',    pl24h:  1.12 },
  { id: 'S-00843', botType: 'DCA',          name: 'Eth Moonshot Grid',       ticker: 'ETH/USDT',  userId: 'System_Admin_01', exchange: 'Kraken',       cycleCount:   842, pauseReason: '—', status: 'PAUSED',  balance: '2.50 ETH',     pl24h:  0.00 },
  { id: 'S-14294', botType: 'Martingale',   name: 'Saber-X SOL Raider',      ticker: 'SOL/USDT',  userId: 'System_Alpha_99', exchange: 'Binance',      cycleCount: 14291, pauseReason: '—', status: 'ACTIVE',  balance: '185.00 SOL',   pl24h:  4.52 },
  { id: 'S-00844', botType: 'Scalper',      name: 'Perp Grid Heuristic',     ticker: 'ETH/PERP',  userId: 'System_Admin_01', exchange: 'Kraken',       cycleCount:   842, pauseReason: '—', status: 'PAUSED',  balance: '1,200 USDT',   pl24h:  0.00 },
];
