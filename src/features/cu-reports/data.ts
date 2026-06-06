import { SpendEvent, DailyBurn, StrategyActivity } from '../../types';

export const INITIAL_SPEND_EVENTS: SpendEvent[] = [
  { eventName: 'SIGNUP_BONUS',    spent: 5420 },
  { eventName: 'START_BOT',       spent: 5420 },
  { eventName: 'CYCLE_START',     spent: 5420 },
  { eventName: 'DCA_EXECUTED',    spent: 2105 },
  { eventName: 'SELL_EXECUTED',   spent: 3812 },
  { eventName: 'ADD_SUB_BALANCE', spent: 3812 },
];

export const INITIAL_DAILY_BURN: DailyBurn[] = [
  { time: '00:00', spent: 210 },
  { time: '04:40', spent: 150 },
  { time: '08:00', spent: 340 },
  { time: '12:09', spent: 220 },
  { time: '18:59', spent: 480 },
  { time: '20:00', spent: 310 },
  { time: '23:59', spent: 650 },
];

export const INITIAL_STRATEGY_ACTIVITIES: StrategyActivity[] = [
  { strategyName: 'BTC DCA Bot',    pair: 'BTC/USDT',  cuSpent: 4320, cycles: 87, status: 'ACTIVE'  },
  { strategyName: 'ETH Grid',       pair: 'ETH/USDT',  cuSpent: 3105, cycles: 64, status: 'ACTIVE'  },
  { strategyName: 'SOL Martingale', pair: 'SOL/USDT',  cuSpent: 2780, cycles: 42, status: 'PAUSED'  },
  { strategyName: 'BNB Scalper',    pair: 'BNB/USDT',  cuSpent: 1940, cycles: 33, status: 'ACTIVE'  },
  { strategyName: 'DOGE Swing',     pair: 'DOGE/USDT', cuSpent:  890, cycles: 11, status: 'STOPPED' },
];
