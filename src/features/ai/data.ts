import { Agent, AiChatLog, AiSupportModel } from '../../types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-001',
    name: 'Trading Advisor',
    description: 'Tư vấn chiến lược giao dịch, phân tích thị trường và đề xuất entry/exit cho người dùng.',
    model: 'claude-3-5-sonnet',
    systemPrompt: `You are a professional crypto trading advisor for QuantAdmin platform.
Your role is to help users understand market conditions, analyze trading strategies, and provide guidance on DCA, Grid, and Trailing strategies.
Always remind users that trading involves risk and past performance does not guarantee future results.
Be concise, data-driven, and professional in your responses.`,
    status: 'ACTIVE',
    totalCalls: 4820,
    totalCuSpent: 14460,
    lastActive: '2026-06-04 09:10',
  },
  {
    id: 'agent-002',
    name: 'Support Bot',
    description: 'Hỗ trợ người dùng về tính năng, cài đặt bot, API keys và các vấn đề kỹ thuật.',
    model: 'claude-3-haiku',
    systemPrompt: `You are a helpful customer support agent for QuantAdmin, an algorithmic trading platform.
Help users with: bot configuration, API key setup, strategy settings, payment issues, and account management.
Be friendly, clear, and step-by-step in your guidance. Escalate complex technical issues to human support.
Do not provide financial advice.`,
    status: 'ACTIVE',
    totalCalls: 8210,
    totalCuSpent: 12315,
    lastActive: '2026-06-04 09:14',
  },
  {
    id: 'agent-003',
    name: 'Market Analyst',
    description: 'Phân tích kỹ thuật, đọc chart và cung cấp tóm tắt thị trường theo yêu cầu.',
    model: 'claude-3-opus',
    systemPrompt: `You are an expert crypto market analyst.
Provide technical analysis, chart pattern recognition, support/resistance levels, and market summaries.
Use structured responses with clear sections: Summary, Key Levels, Trend Analysis, and Outlook.
Always include appropriate risk warnings and do not make definitive price predictions.`,
    status: 'ACTIVE',
    totalCalls: 2140,
    totalCuSpent: 21400,
    lastActive: '2026-06-04 08:55',
  },
  {
    id: 'agent-004',
    name: 'Onboarding Guide',
    description: 'Hướng dẫn người dùng mới bắt đầu sử dụng nền tảng từ đăng ký đến chạy bot đầu tiên.',
    model: 'gpt-4o-mini',
    systemPrompt: `You are a friendly onboarding guide for new QuantAdmin users.
Walk users through: account setup, connecting exchange API keys, understanding CU (Compute Units), choosing their first strategy, and launching their first bot.
Keep responses short, encouraging, and beginner-friendly. Use numbered steps and simple language.`,
    status: 'INACTIVE',
    totalCalls: 610,
    totalCuSpent: 610,
    lastActive: '2026-06-01 14:20',
  },
];

export const MOCK_AI_CHAT_LOGS: AiChatLog[] = [
  {
    id: 'log-001', username: '@cryptodan88',  agentId: 'agent-001', agentName: 'Trading Advisor',
    timestamp: '2026-06-04 09:08', model: 'claude-3-5-sonnet',
    question: 'BTC đang ở vùng $48,200, tôi có nên bật bot Trailing DCA không?',
    answer: 'Ở vùng $48,200 BTC đang test lại vùng hỗ trợ trước đó. Trailing DCA phù hợp nếu bạn muốn tích lũy dần. Khuyến nghị đặt base order nhỏ (~5% vốn) và trailing deviation 0.5% để tránh entry quá sớm. Theo dõi volume và RSI trước khi kích hoạt.',
    inputTokens: 42, outputTokens: 98, cuCost: 4.2,
  },
  {
    id: 'log-002', username: '@charlie_nodes', agentId: 'agent-003', agentName: 'Market Analyst',
    timestamp: '2026-06-04 08:50', model: 'claude-3-opus',
    question: 'Phân tích kỹ thuật BNB/USDT khung H4?',
    answer: '**Tóm tắt:** BNB/USDT đang trong xu hướng tăng ngắn hạn.\n**Key Levels:** Support $580, Resistance $610.\n**Trend:** MA20 > MA50, MACD dương.\n**Outlook:** Tích cực nếu giữ trên $585. Break $610 sẽ mở mục tiêu $635.',
    inputTokens: 38, outputTokens: 142, cuCost: 18.0,
  },
  {
    id: 'log-003', username: '@johndoe_quant', agentId: 'agent-002', agentName: 'Support Bot',
    timestamp: '2026-06-04 08:30', model: 'claude-3-haiku',
    question: 'Tôi bị lỗi khi kết nối API key Binance, báo Invalid API-key.',
    answer: 'Lỗi "Invalid API-key" thường do: 1) Key chưa được enable quyền Spot trading; 2) IP restriction chưa thêm IP server; 3) Key đã bị xoá hoặc expired. Vào Binance > API Management > kiểm tra permissions và IP whitelist, sau đó thử lại.',
    inputTokens: 35, outputTokens: 88, cuCost: 1.8,
  },
  {
    id: 'log-004', username: '@alice_trades',  agentId: 'agent-001', agentName: 'Trading Advisor',
    timestamp: '2026-06-04 08:15', model: 'claude-3-5-sonnet',
    question: 'Grid bot ETH/USDT với vốn 500 USDT, range $3000-$3500 có hợp lý không?',
    answer: 'Range $3000-$3500 (+16.7%) là khá rộng cho Grid. Với 500 USDT, nên đặt 10-15 grids, mỗi grid ~$30-50. Lợi nhuận mỗi grid ~1.1%. Rủi ro: nếu ETH break dưới $3000, bot sẽ hold toàn bộ ETH lỗ. Đề xuất dùng 60% vốn, giữ 40% làm buffer.',
    inputTokens: 55, outputTokens: 115, cuCost: 5.1,
  },
  {
    id: 'log-005', username: '@delta_grid',    agentId: 'agent-003', agentName: 'Market Analyst',
    timestamp: '2026-06-04 07:55', model: 'claude-3-opus',
    question: 'Tóm tắt thị trường crypto hôm nay?',
    answer: '**Tóm tắt 04/06/2026:** BTC +1.2% tại $48,400; ETH +0.8%; BNB +2.1%.\n**Sentiment:** Tích cực, Fear & Greed Index 64 (Greed).\n**Key Events:** Fed giữ lãi suất, dòng tiền ETF BTC tiếp tục dương.\n**Outlook:** Thị trường sideway-bullish ngắn hạn, watch $49K BTC.',
    inputTokens: 28, outputTokens: 168, cuCost: 19.6,
  },
  {
    id: 'log-006', username: '@cryptodan88',  agentId: 'agent-002', agentName: 'Support Bot',
    timestamp: '2026-06-03 22:40', model: 'claude-3-haiku',
    question: 'Làm sao để nạp thêm CU vào tài khoản?',
    answer: 'Để nạp CU: vào Menu > Payments > chọn gói CU phù hợp. Hỗ trợ thanh toán qua Stripe (thẻ), Crypto Pay (USDT TRC20/ERC20), và GatePay. CU sẽ được credit ngay sau khi thanh toán thành công.',
    inputTokens: 22, outputTokens: 72, cuCost: 1.4,
  },
  {
    id: 'log-007', username: '@charlie_nodes', agentId: 'agent-001', agentName: 'Trading Advisor',
    timestamp: '2026-06-03 21:10', model: 'claude-3-5-sonnet',
    question: 'Martingale bot có rủi ro không? Tôi nên dùng mức nhân lên bao nhiêu?',
    answer: 'Martingale có rủi ro cao trong thị trường trending mạnh một chiều. Multiplier 1.5x an toàn hơn 2x. Với vốn $500: base order $20, multiplier 1.5x, tối đa 6 lệnh = ~$227 invested. Luôn đặt Stop Loss ở 15-20% để bảo vệ vốn. Không phù hợp với volatile coins như DOGE, SHIB.',
    inputTokens: 48, outputTokens: 122, cuCost: 5.4,
  },
  {
    id: 'log-008', username: '@johndoe_quant', agentId: 'agent-003', agentName: 'Market Analyst',
    timestamp: '2026-06-03 19:30', model: 'claude-3-opus',
    question: 'ETH/BTC ratio hiện tại có ý nghĩa gì?',
    answer: '**ETH/BTC Ratio ~0.053:** Ratio đang gần vùng hỗ trợ lịch sử. ETH underperforming BTC trong 30 ngày qua (-3.2% vs BTC).\n**Outlook:** Nếu ratio tăng trở lại 0.056+, ETH có thể outperform. Catalyst: ETH ETF flows và upcoming network upgrades.',
    inputTokens: 32, outputTokens: 155, cuCost: 18.7,
  },
  {
    id: 'log-009', username: '@delta_grid',    agentId: 'agent-002', agentName: 'Support Bot',
    timestamp: '2026-06-03 15:20', model: 'claude-3-haiku',
    question: 'Bot của tôi bị ANOMALY, phải làm gì?',
    answer: 'Trạng thái ANOMALY thường do API latency cao hoặc lỗi kết nối sàn. Các bước xử lý: 1) Kiểm tra status sàn giao dịch; 2) Vào Strategies > bot đó > xem Pause Reason; 3) Nếu do latency, đợi 5-10 phút rồi Resume; 4) Nếu lỗi API, reconnect key. Liên hệ support nếu vẫn lỗi.',
    inputTokens: 28, outputTokens: 95, cuCost: 1.8,
  },
  {
    id: 'log-010', username: '@alice_trades',  agentId: 'agent-003', agentName: 'Market Analyst',
    timestamp: '2026-06-03 11:05', model: 'claude-3-opus',
    question: 'SOL/USDT có đang trong uptrend không?',
    answer: '**SOL/USDT Analysis:** Đang trong uptrend trung hạn sau đáy $142 tháng 5.\n**Key Levels:** Support $168, Resistance $182.\n**Indicators:** RSI 58 (healthy), Volume tăng dần.\n**Outlook:** Bullish nếu hold $168. Break $182 target $198.',
    inputTokens: 30, outputTokens: 138, cuCost: 16.8,
  },
];

export const INITIAL_AI_SUPPORT_MODELS: AiSupportModel[] = [
  {
    id: 'asm-001', name: 'Claude 3.5 Sonnet', provider: 'Anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    apiKey: 'sk-ant-api03-xK9m...T4vQ',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    status: 'ACTIVE', addedDate: '2026-01-10',
  },
  {
    id: 'asm-002', name: 'Claude 3 Haiku', provider: 'Anthropic',
    modelId: 'claude-3-haiku-20240307',
    apiKey: 'sk-ant-api03-xK9m...T4vQ',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    status: 'ACTIVE', addedDate: '2026-01-10',
  },
  {
    id: 'asm-003', name: 'Claude 3 Opus', provider: 'Anthropic',
    modelId: 'claude-3-opus-20240229',
    apiKey: 'sk-ant-api03-xK9m...T4vQ',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    status: 'ACTIVE', addedDate: '2026-01-10',
  },
  {
    id: 'asm-004', name: 'GPT-4o', provider: 'OpenAI',
    modelId: 'gpt-4o',
    apiKey: 'sk-proj-aB3c...9zKp',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    status: 'ACTIVE', addedDate: '2026-02-05',
  },
  {
    id: 'asm-005', name: 'GPT-4o Mini', provider: 'OpenAI',
    modelId: 'gpt-4o-mini',
    apiKey: 'sk-proj-aB3c...9zKp',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    status: 'ACTIVE', addedDate: '2026-02-05',
  },
  {
    id: 'asm-006', name: 'Gemini 1.5 Pro', provider: 'Google',
    modelId: 'gemini-1.5-pro',
    apiKey: 'AIzaSy-mN2q...77bC',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    status: 'INACTIVE', addedDate: '2026-03-18',
  },
];
