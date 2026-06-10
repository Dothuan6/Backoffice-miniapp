import { BacktestJob, BacktestResult, BacktestTrade } from '../../types';

// Deterministic pseudo-random [0,1)
function pr(s: number, i: number): number {
  const x = Math.sin(s * 127.1 + i * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Equity curve ───────────────────────────────────────────────────────────
function buildCurve(
  startDate: string,
  days: number,
  capital: number,
  targetPnlPct: number,
  seed: number
): { date: string; equity: number }[] {
  const drift = Math.pow(1 + targetPnlPct / 100, 1 / Math.max(days, 1)) - 1;
  const base  = new Date(startDate).getTime();
  const pts: { date: string; equity: number }[] = [];
  let eq = capital;

  for (let i = 0; i < days; i++) {
    const noise = (pr(seed, i) - 0.5) * 0.04 + (pr(seed + 1, i) - 0.5) * 0.015;
    eq = Math.max(capital * 0.25, eq * (1 + drift + noise));
    pts.push({
      date:   new Date(base + i * 86400000).toISOString().slice(0, 10),
      equity: Math.round(eq * 100) / 100,
    });
  }
  return pts;
}

// ── Trades ─────────────────────────────────────────────────────────────────
const BASE_PRICES: Record<string, number> = {
  'BTC/USDT': 43200, 'ETH/USDT': 2780, 'BNB/USDT': 385,
  'SOL/USDT': 112,   'XRP/USDT': 0.62,
};
const REASONS_WIN  = ['Take profit', 'Trailing stop', 'Grid fill', 'Signal exit'];
const REASONS_LOSE = ['Stop loss',   'Forced exit',   'Risk limit', 'Timeout close'];

function buildTrades(
  capital: number,
  count: number,
  winRate: number,
  startDate: string,
  endDate: string,
  symbol: string,
  seed: number
): BacktestTrade[] {
  const trades: BacktestTrade[] = [];
  const start  = new Date(startDate).getTime();
  const end    = new Date(endDate).getTime();
  const step   = (end - start) / Math.max(count, 1);
  const base   = BASE_PRICES[symbol] ?? 100;

  for (let i = 0; i < count; i++) {
    const r      = pr(seed, i);
    const isWin  = r < winRate;
    const eMs    = start + i * step;
    const durMs  = 3600000 * (1 + pr(seed + 2, i) * 5);
    const eP     = Math.round(base * (0.9 + pr(seed + 3, i) * 0.2) * 100) / 100;
    const pPct   = isWin
      ? 0.4  + pr(seed + 4, i) * 3.2
      : -(0.3 + pr(seed + 5, i) * 1.6);
    const xP     = Math.round(eP * (1 + pPct / 100) * 100) / 100;
    const qty    = Math.round((capital * 0.15 / eP) * 10000) / 10000;
    const pnlUsd = Math.round(qty * (xP - eP) * 100) / 100;
    const durH   = Math.floor(durMs / 3600000);
    const durM   = Math.floor((durMs % 3600000) / 60000);

    trades.push({
      id:         `T${String(i + 1).padStart(3, '0')}`,
      side:       pr(seed + 8, i) > 0.5 ? 'BUY' : 'SELL',
      entryPrice: eP,
      exitPrice:  xP,
      qty,
      pnlUsd,
      pnlPct:     Math.round(pPct * 100) / 100,
      entryTime:  new Date(eMs).toISOString().replace('T', ' ').slice(0, 16),
      exitTime:   new Date(eMs + durMs).toISOString().replace('T', ' ').slice(0, 16),
      duration:   `${durH}h ${durM}m`,
      reason:     isWin
        ? REASONS_WIN [Math.floor(pr(seed + 6, i) * REASONS_WIN.length)]
        : REASONS_LOSE[Math.floor(pr(seed + 7, i) * REASONS_LOSE.length)],
    });
  }
  return trades;
}

// ── Full result builder ────────────────────────────────────────────────────
function buildResult(
  job: BacktestJob,
  pnlPct: number,
  sharpe: number,
  maxDD: number,
  winRate: number,
  tradeCount: number,
  seed: number
): BacktestResult {
  const trades  = buildTrades(job.initialCapital, tradeCount, winRate, job.startDate, job.endDate, job.symbol, seed);
  const wins    = trades.filter(t => t.pnlUsd > 0);
  const losses  = trades.filter(t => t.pnlUsd <= 0);
  const grossW  = wins.reduce((s, t) => s + t.pnlUsd, 0);
  const grossL  = Math.abs(losses.reduce((s, t) => s + t.pnlUsd, 0));
  const days    = Math.ceil((new Date(job.endDate).getTime() - new Date(job.startDate).getTime()) / 86400000);

  return {
    jobId:          job.id,
    totalPnlUsd:    Math.round(job.initialCapital * pnlPct / 100 * 100) / 100,
    totalPnlPct:    pnlPct,
    sharpeRatio:    sharpe,
    maxDrawdownPct: maxDD,
    winRate,
    totalTrades:    trades.length,
    winningTrades:  wins.length,
    losingTrades:   losses.length,
    avgWinUsd:      wins.length   ? Math.round(grossW / wins.length   * 100) / 100 : 0,
    avgLossUsd:     losses.length ? Math.round(grossL / losses.length * 100) / 100 : 0,
    profitFactor:   grossL > 0    ? Math.round(grossW / grossL * 100) / 100 : 99,
    equityCurve:    buildCurve(job.startDate, Math.min(days, 180), job.initialCapital, pnlPct, seed),
    trades,
  };
}

// ── Mock jobs ──────────────────────────────────────────────────────────────
export const INITIAL_BACKTEST_JOBS: BacktestJob[] = [
  { id: 'BT-001', strategyId: 'STR-1', strategyName: 'DCA Pro v2',           strategyType: 'DCA',      symbol: 'BTC/USDT', exchange: 'Binance', timeframe: '1h',  startDate: '2024-01-01', endDate: '2024-06-30', initialCapital: 1000,  status: 'SUCCESS',   progress: 100, createdAt: '2026-05-10', completedAt: '2026-05-10', resultId: 'BT-001' },
  { id: 'BT-002', strategyId: 'STR-2', strategyName: 'Grid Master ETH',       strategyType: 'GRID',     symbol: 'ETH/USDT', exchange: 'Binance', timeframe: '4h',  startDate: '2024-02-01', endDate: '2024-07-31', initialCapital: 2000,  status: 'SUCCESS',   progress: 100, createdAt: '2026-05-12', completedAt: '2026-05-12', resultId: 'BT-002' },
  { id: 'BT-003', strategyId: 'STR-3', strategyName: 'Trailing Scalper BNB',  strategyType: 'TRAILING', symbol: 'BNB/USDT', exchange: 'Binance', timeframe: '1h',  startDate: '2024-01-15', endDate: '2024-05-15', initialCapital: 500,   status: 'SUCCESS',   progress: 100, createdAt: '2026-05-15', completedAt: '2026-05-15', resultId: 'BT-003' },
  { id: 'BT-004', strategyId: 'STR-4', strategyName: 'DCA SOL Aggressive',    strategyType: 'DCA',      symbol: 'SOL/USDT', exchange: 'OKX',     timeframe: '15m', startDate: '2024-03-01', endDate: '2024-06-30', initialCapital: 1500,  status: 'SUCCESS',   progress: 100, createdAt: '2026-05-18', completedAt: '2026-05-18', resultId: 'BT-004' },
  { id: 'BT-005', strategyId: 'STR-5', strategyName: 'Grid BTC Long-term',    strategyType: 'GRID',     symbol: 'BTC/USDT', exchange: 'Bybit',   timeframe: '1d',  startDate: '2023-07-01', endDate: '2024-01-01', initialCapital: 5000,  status: 'SUCCESS',   progress: 100, createdAt: '2026-05-20', completedAt: '2026-05-20', resultId: 'BT-005' },
  { id: 'BT-006', strategyId: 'STR-1', strategyName: 'Trailing ETH 4h',       strategyType: 'TRAILING', symbol: 'ETH/USDT', exchange: 'Binance', timeframe: '4h',  startDate: '2024-04-01', endDate: '2024-09-30', initialCapital: 2000,  status: 'RUNNING',   progress: 35,  createdAt: '2026-06-09' },
  { id: 'BT-007', strategyId: 'STR-2', strategyName: 'DCA XRP Conservative',  strategyType: 'DCA',      symbol: 'XRP/USDT', exchange: 'OKX',     timeframe: '1h',  startDate: '2024-05-01', endDate: '2024-10-31', initialCapital: 1000,  status: 'RUNNING',   progress: 72,  createdAt: '2026-06-09' },
  { id: 'BT-008', strategyId: 'STR-3', strategyName: 'Grid SOL Mid-term',     strategyType: 'GRID',     symbol: 'SOL/USDT', exchange: 'Bybit',   timeframe: '4h',  startDate: '2024-06-01', endDate: '2024-11-30', initialCapital: 3000,  status: 'QUEUED',                  createdAt: '2026-06-10' },
  { id: 'BT-009', strategyId: 'STR-4', strategyName: 'Trailing BTC 15m',      strategyType: 'TRAILING', symbol: 'BTC/USDT', exchange: 'Binance', timeframe: '15m', startDate: '2024-06-10', endDate: '2024-09-10', initialCapital: 1000,  status: 'QUEUED',                  createdAt: '2026-06-10' },
  { id: 'BT-010', strategyId: 'STR-5', strategyName: 'DCA BNB Balanced',      strategyType: 'DCA',      symbol: 'BNB/USDT', exchange: 'Binance', timeframe: '1h',  startDate: '2024-01-01', endDate: '2024-03-31', initialCapital: 500,   status: 'FAILED',    errorMessage: 'Insufficient historical data for selected symbol/timeframe pair',       createdAt: '2026-05-08' },
  { id: 'BT-011', strategyId: 'STR-2', strategyName: 'Grid ETH 5m',           strategyType: 'GRID',     symbol: 'ETH/USDT', exchange: 'OKX',     timeframe: '5m',  startDate: '2024-05-01', endDate: '2024-05-31', initialCapital: 800,   status: 'FAILED',    errorMessage: 'Exchange API rate limit exceeded during historical data fetch',          createdAt: '2026-05-25' },
  { id: 'BT-012', strategyId: 'STR-3', strategyName: 'Trailing XRP Daily',    strategyType: 'TRAILING', symbol: 'XRP/USDT', exchange: 'Bybit',   timeframe: '1d',  startDate: '2024-02-01', endDate: '2024-04-30', initialCapital: 1200,  status: 'CANCELLED',               createdAt: '2026-05-28' },
];

// [pnlPct, sharpe, maxDD, winRate, trades, seed]
const RESULT_PARAMS: Record<string, [number, number, number, number, number, number]> = {
  'BT-001': [ 18.4, 1.4, 12.3, 0.58,  62, 1001],
  'BT-002': [ 34.7, 1.9, 18.5, 0.64,  88, 1002],
  'BT-003': [ -5.2, 0.6, 22.1, 0.45,  45, 1003],
  'BT-004': [  8.9, 1.1, 15.8, 0.52, 120, 1004],
  'BT-005': [ 47.3, 2.1, 28.4, 0.61,  76, 1005],
};

export const BACKTEST_RESULTS: Record<string, BacktestResult> = Object.fromEntries(
  INITIAL_BACKTEST_JOBS
    .filter(j => j.status === 'SUCCESS')
    .map(j => {
      const [pnl, sharpe, maxDD, wr, tc, seed] = RESULT_PARAMS[j.id]!;
      return [j.id, buildResult(j, pnl, sharpe, maxDD, wr, tc, seed)];
    })
);

export function generateResult(job: BacktestJob): BacktestResult {
  const seed   = job.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pnlPct = Math.round(((pr(seed, 0) - 0.3) * 60) * 10) / 10;
  const sharpe = Math.round((0.4 + pr(seed, 1) * 1.8) * 10) / 10;
  const maxDD  = Math.round((8   + pr(seed, 2) * 25)  * 10) / 10;
  const wr     = Math.round((0.42 + pr(seed, 3) * 0.26) * 100) / 100;
  const tc     = Math.floor(30 + pr(seed, 4) * 90);
  return buildResult(job, pnlPct, sharpe, maxDD, wr, tc, seed + 100);
}
