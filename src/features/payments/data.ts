import { PaymentRecord } from '../../types';

export const MOCK_ALL_PAYMENTS: PaymentRecord[] = [
  { id: 'pay-772', username: '@cryptodan88',    timestamp: '2026-05-28 09:12', amountUsd: 150.00, cuCredited: 15000, method: 'Stripe Credit Card',      status: 'SUCCESS' },
  { id: 'pay-651', username: '@cryptodan88',    timestamp: '2026-04-12 11:45', amountUsd:  50.00, cuCredited:  5000, method: 'Crypto Pay (USDT_TRC20)', status: 'SUCCESS' },
  { id: 'pay-213', username: '@cryptodan88',    timestamp: '2026-03-30 18:22', amountUsd: 100.00, cuCredited: 10000, method: 'GatePay Crypto',          status: 'FAILED'  },
  { id: 'pay-890', username: '@johndoe_quant',  timestamp: '2026-05-20 14:05', amountUsd:  75.00, cuCredited:  7500, method: 'Stripe Credit Card',      status: 'SUCCESS' },
  { id: 'pay-512', username: '@johndoe_quant',  timestamp: '2026-04-08 09:30', amountUsd:  25.00, cuCredited:  2500, method: 'Crypto Pay (USDT_TRC20)', status: 'PENDING' },
  { id: 'pay-301', username: '@moon_scalper',   timestamp: '2026-05-15 17:44', amountUsd: 200.00, cuCredited: 20000, method: 'GatePay Crypto',          status: 'SUCCESS' },
  { id: 'pay-144', username: '@hodl_pro',       timestamp: '2026-05-10 08:20', amountUsd:  50.00, cuCredited:  5000, method: 'Stripe Credit Card',      status: 'SUCCESS' },
  { id: 'pay-088', username: '@btc_enthusiast', timestamp: '2026-04-22 21:15', amountUsd: 300.00, cuCredited: 30000, method: 'Crypto Pay (USDT_TRC20)', status: 'SUCCESS' },
];
