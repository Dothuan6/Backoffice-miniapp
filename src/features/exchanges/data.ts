import { Exchange } from '../../types';

export const INITIAL_EXCHANGES: Exchange[] = [
  {
    id: 'ex-1',
    name: 'Binance',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=120',
    status: 'ACTIVE',
    guideUrl: 'https://www.binance.com/vi/support/faq/c-3',
  },
  {
    id: 'ex-2',
    name: 'OKX',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&q=80&w=120',
    status: 'ACTIVE',
    guideUrl: 'https://www.okx.com/help-center/section/api',
  },
  {
    id: 'ex-3',
    name: 'Bybit',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=120',
    status: 'ACTIVE',
    guideUrl: 'https://learn.bybit.com/bybit-active/how-to-use-bybit-api/',
  },
  {
    id: 'ex-4',
    name: 'Kraken',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=120',
    status: 'INACTIVE',
    guideUrl: 'https://support.kraken.com/hc/en-us/articles/360001185506-How-to-create-an-API-key',
  },
];
