export interface User {
  username: string;
  name: string;
  uuid: string;
  telegramId: string;
  cuBalance: number;
  joinedDate: string;
  joinedDateTime: string;
  avatar: string;
  status: 'ONLINE' | 'OFFLINE';
  lastActive: string;
  referralCode: string;
  referredBy?: string;
  locked?: boolean;
}

export type BotType = 'Trailing DCA' | 'Grid' | 'Arbitrage' | 'Scalper' | 'DCA' | 'Martingale';

export interface Bot {
  id: string;
  name: string;
  botType: BotType;
  ticker: string;
  userId: string;
  exchange: string;
  cycleCount: number;
  pauseReason: string;
  status: 'ACTIVE' | 'ANOMALY' | 'PAUSED';
  balance: string;
  pl24h: number;
}

export interface SpendEvent {
  eventName: string;
  spent: number;
}

export interface AdminActivity {
  timestamp: string;
  message: string;
  admin: string;
}

export interface DailyBurn {
  time: string;
  spent: number;
}

export interface CUHistoryRecord {
  id: string;
  timestamp: string;
  type: 'SPENT' | 'ADJUST' | 'REFUND' | 'BONUS';
  amount: number;
  description: string;
  botType?: BotType;
}

export interface UserApiKey {
  id: string;
  name: string;
  exchange: string;
  keyMask: string;
  created: string;
  status: 'ACTIVE' | 'ERROR';
}

export interface PaymentRecord {
  id: string;
  username?: string;
  packageId?: string;
  packageName?: string;
  timestamp: string;
  amountUsd: number;
  cuCredited: number;
  method: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

// ── Subscription module ────────────────────────────────────────────────────

export type CuEventCategory = 'SPEND' | 'BONUS' | 'SYSTEM';

export interface CuEvent {
  id: string;
  eventName: string;
  cuCost: number;
  category: CuEventCategory;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;
}

export interface CuPackage {
  id: string;
  name: string;
  cuAmount: number;
  priceUsd: number;
  discountPercent: number;
  status: 'ACTIVE' | 'INACTIVE';
  badge?: string;
  createdDate: string;
}

export interface ReferralsInfo {
  referralCode: string;
  clicks: number;
  signups: number;
  activeReferrals: number;
  totalEarningsCu: number;
  referredUsers: {
    username: string;
    joined: string;
    status: 'ACTIVE' | 'INACTIVE';
    earningsCu: number;
  }[];
}

export interface Exchange {
  id: string;
  name: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  guideUrl: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdDate: string;
}

export interface StrategyActivity {
  strategyName: string;
  pair: string;
  cuSpent: number;
  cycles: number;
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED';
}

export interface UserTradingStats {
  totalVolume: number;
  totalPnl: number;
  totalTxns: number;
  winRate: number;
  byExchange: {
    exchange: string;
    volume: number;
    pnl: number;
    txns: number;
  }[];
}

export type AiModel = 'claude-3-5-sonnet' | 'claude-3-haiku' | 'claude-3-opus' | 'gpt-4o' | 'gpt-4o-mini' | 'gemini-1.5-pro';

export interface AiSupportModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  apiKey: string;
  apiEndpoint: string;
  status: 'ACTIVE' | 'INACTIVE';
  addedDate: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: AiModel;
  systemPrompt: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalCalls: number;
  totalCuSpent: number;
  lastActive: string;
}

export interface AiChatLog {
  id: string;
  username: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  question: string;
  answer: string;
  inputTokens: number;
  outputTokens: number;
  cuCost: number;
  model: AiModel;
}

export interface TradingReportRow {
  exchange: string;
  pair: string;
  txns: number;
  volume: number;
  pnl: number;
  winRate: number;
  lastActivity: string;
}

// ── Backtest module ─────────────────────────────────────────────────────────

export type BacktestStatus       = 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
export type BacktestTimeframe    = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
export type BacktestStrategyType = 'DCA' | 'GRID' | 'TRAILING';

export interface BacktestStrategyConfig {
  dcaDropPct:    number;   // % price drop that triggers a DCA order
  dcaConfirmPct: number;   // % recovery after drop to confirm the buy
  takeProfitPct: number;   // % profit from avg cost to trigger take-profit
  tpConfirmPct:  number;   // % pullback from peak to confirm the sell
  stopLossPct:   number;   // % loss from avg cost to trigger stop-loss
  multiplier:    number;   // each subsequent DCA order is multiplier× previous
  firstBuyUsd:   number;   // size of the first buy order in USDT
}

export interface BacktestJob {
  id: string;
  strategyId: string;
  strategyName: string;
  strategyType: BacktestStrategyType;
  symbol: string;
  exchange: string;
  timeframe: BacktestTimeframe;
  startDate: string;
  endDate: string;
  initialCapital: number;
  status: BacktestStatus;
  progress?: number;
  createdAt: string;
  completedAt?: string;
  resultId?: string;
  errorMessage?: string;
  config?: BacktestStrategyConfig;
}

export interface BacktestTrade {
  id: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  qty: number;
  pnlUsd: number;
  pnlPct: number;
  entryTime: string;
  exitTime: string;
  duration: string;
  reason: string;
}

export interface BacktestResult {
  jobId: string;
  totalPnlUsd: number;
  totalPnlPct: number;
  sharpeRatio: number;
  maxDrawdownPct: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWinUsd: number;
  avgLossUsd: number;
  profitFactor: number;
  equityCurve: { date: string; equity: number }[];
  trades: BacktestTrade[];
}
