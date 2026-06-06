import { TradingReportRow } from '../../types';

export const MOCK_TRADING_REPORT: TradingReportRow[] = [
  { exchange: 'Binance', pair: 'BTC/USDT',  txns: 4820, volume: 9_240_000, pnl:  54200, winRate: 61.2, lastActivity: '2026-06-04 09:41' },
  { exchange: 'Binance', pair: 'ETH/USDT',  txns: 3105, volume: 4_880_000, pnl:  28100, winRate: 58.7, lastActivity: '2026-06-04 09:38' },
  { exchange: 'OKX',     pair: 'BTC/USDT',  txns: 1840, volume: 3_120_000, pnl:  17800, winRate: 56.1, lastActivity: '2026-06-04 08:55' },
  { exchange: 'Bybit',   pair: 'SOL/USDT',  txns: 2210, volume: 1_640_000, pnl:  -4300, winRate: 44.3, lastActivity: '2026-06-04 07:22' },
  { exchange: 'OKX',     pair: 'ETH/USDT',  txns:  980, volume: 1_210_000, pnl:   9100, winRate: 59.4, lastActivity: '2026-06-03 23:11' },
  { exchange: 'Bybit',   pair: 'BNB/USDT',  txns:  760, volume:   880_000, pnl:   3200, winRate: 52.6, lastActivity: '2026-06-03 22:40' },
  { exchange: 'Kraken',  pair: 'BTC/USDT',  txns:  420, volume:   720_000, pnl:  -1100, winRate: 46.8, lastActivity: '2026-06-03 18:05' },
  { exchange: 'Binance', pair: 'DOGE/USDT', txns: 1580, volume:   540_000, pnl:  -8400, winRate: 41.5, lastActivity: '2026-06-03 16:30' },
];
