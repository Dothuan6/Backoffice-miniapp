import { AdminActivity } from '../../types';

export const INITIAL_ADMIN_ACTIVITY: AdminActivity[] = [
  { timestamp: '12:15:02', message: 'IP Check bypassed for specific Telegram region.',                    admin: '@admin_jack'  },
  { timestamp: '10:04:11', message: 'CU manual adjustment +500 for @cryptodan88 (Promo)',                admin: '@system_bot'  },
  { timestamp: '09:42:00', message: 'User account @alice_trades created via REG_API_V1.',                admin: 'REG_API_V1'   },
  { timestamp: '09:10:55', message: 'Bot S-99201 status changed to ACTIVE for @cryptodan88.',            admin: '@admin_jack'  },
  { timestamp: '08:55:30', message: 'CU manual adjustment -200 for @johndoe_quant (System correction)',  admin: '@system_bot'  },
  { timestamp: '08:40:12', message: 'API key key-03 marked ERROR for @cryptodan88.',                     admin: '@system_bot'  },
  { timestamp: '08:20:00', message: 'Referral reward +200 CU credited to @charlie_nodes.',               admin: '@system_bot'  },
  { timestamp: '07:55:44', message: 'Bot S-44103 triggered ANOMALY for @charlie_nodes.',                 admin: '@system_bot'  },
  { timestamp: '07:30:11', message: 'Payment pay-410 SUCCESS verified for @charlie_nodes.',              admin: 'PAYMENT_API'  },
  { timestamp: '07:10:05', message: 'Account @delta_grid upgraded to VIP tier.',                         admin: '@admin_jack'  },
  { timestamp: '06:50:00', message: 'CU purchase pay-610 +20000 CU for @delta_grid.',                    admin: 'PAYMENT_API'  },
  { timestamp: '06:30:22', message: 'Committed strategy changes (pending mutations applied).',            admin: '@admin_jack'  },
  { timestamp: '06:00:00', message: 'User @bob_whale flagged for zero balance — account dormant.',        admin: '@system_bot'  },
  { timestamp: '05:45:10', message: 'Account @omega_bot auto-suspended: zero CU for 30+ days.',          admin: '@system_bot'  },
];
