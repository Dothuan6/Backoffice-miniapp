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
}

export interface Bot {
  id: string; // e.g. S-99201
  name: string; // e.g. BTC Trend Follower v2
  ticker: string; // e.g. BTC/USDT-GRID or BTCUSDT
  userId: string; // e.g. @cryptodan88 or @johndoe_quant
  exchange: string; // e.g. Binance Spot, Kraken, Binance
  cycleCount: number; // e.g. 14291
  pauseReason: string; // e.g. API Latency Spike > 500ms or empty
  status: 'ACTIVE' | 'ANOMALY' | 'PAUSED';
  balance: string; // e.g. "0.842 BTC" or "450.00 SOL"
  pl24h: number; // P&L percentage, e.g. 2.45, -0.12
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
  timestamp: string;
  amountUsd: number;
  cuCredited: number;
  method: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
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
