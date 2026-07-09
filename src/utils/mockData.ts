import type { StockDetails, AgentDecision, BacktestDataPoint, AgentWeights, Consensus } from '../types/stock';

// Hash function to get deterministic results for custom tickers
const getHashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Generate chart data helper
const generateChartData = (basePrice: number, changePercent: number, count = 30) => {
  const data = [];
  let currentPrice = basePrice * (1 - changePercent / 100);
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    // Add some random walk noise
    const noise = (Math.random() - 0.48) * (basePrice * 0.015);
    currentPrice += noise;
    
    data.push({
      time: dateStr,
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  
  // Ensure the last element matches exactly the current price
  data[data.length - 1].price = basePrice;
  return data;
};

// Main generator function
export const getStockData = (ticker: string): { details: StockDetails; agents: AgentDecision[]; backtest: BacktestDataPoint[] } => {
  const symbol = ticker.toUpperCase().trim();
  const hash = getHashCode(symbol);
  
  // Default configurations for popular stocks
  let basePrice = 150 + (hash % 450);
  let changePercent = (hash % 1000) / 100 - 4; // between -4% and +6%
  let companyName = `${symbol} Technologies Inc.`;
  let peRatio = 12 + (hash % 60);
  let marketCap = `${((hash % 900) + 100).toFixed(1)}B`;
  
  // High fidelity profiles for main tickers
  if (symbol === 'NVDA') {
    companyName = 'NVIDIA Corporation';
    basePrice = 127.85;
    changePercent = 4.25;
    peRatio = 68.4;
    marketCap = '3.14T';
  } else if (symbol === 'TSLA') {
    companyName = 'Tesla, Inc.';
    basePrice = 245.50;
    changePercent = -2.80;
    peRatio = 54.2;
    marketCap = '785.4B';
  } else if (symbol === 'AAPL') {
    companyName = 'Apple Inc.';
    basePrice = 221.30;
    changePercent = 0.65;
    peRatio = 31.8;
    marketCap = '3.38T';
  } else if (symbol === 'MSFT') {
    companyName = 'Microsoft Corporation';
    basePrice = 418.20;
    changePercent = 1.12;
    peRatio = 35.1;
    marketCap = '3.11T';
  } else if (symbol === 'AMZN') {
    companyName = 'Amazon.com, Inc.';
    basePrice = 193.45;
    changePercent = -0.45;
    peRatio = 40.5;
    marketCap = '2.01T';
  }

  const change = basePrice * (changePercent / 100);
  const high = basePrice * (1 + Math.abs(changePercent) * 0.004 + 0.005);
  const low = basePrice * (1 - Math.abs(changePercent) * 0.004 - 0.005);
  const volume = `${((hash % 40) + 5).toFixed(1)}M`;
  
  const details: StockDetails = {
    ticker: symbol,
    name: companyName,
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume,
    peRatio: parseFloat(peRatio.toFixed(2)),
    marketCap,
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    chartData: generateChartData(basePrice, changePercent)
  };

  // Deterministic agent metrics and signals based on ticker hash or specific profiles
  const agents: AgentDecision[] = [
    // 1. Valuation Agent
    {
      id: 'valuation',
      name: 'Valuation Agent',
      role: 'Intrinsic Value Analyst',
      signal: symbol === 'NVDA' ? 'BEARISH' : symbol === 'AAPL' ? 'NEUTRAL' : hash % 3 === 0 ? 'BULLISH' : hash % 3 === 1 ? 'BEARISH' : 'NEUTRAL',
      confidence: 60 + (hash % 35),
      rationales: symbol === 'NVDA' 
        ? [
            'Trading at an extreme P/E multiple (68.4x) relative to historical tech norms.',
            'DCF intrinsic valuation shows a margin of safety of -22% based on current growth pricing.',
            'Price-to-Sales exceeds 35x, suggesting high vulnerability if hardware shipments decelerate.'
          ]
        : symbol === 'AAPL'
        ? [
            'Fairly valued at 31.8x P/E, matching historical premium levels.',
            'Stable services growth offsets flat hardware growth, supporting cash-flow modeling.',
            'DCF model shows intrinsic value around $215, offering minimal margin of safety.'
          ]
        : hash % 3 === 0 
        ? [
            'Discounted Cash Flow (DCF) intrinsic value indicates a 25% margin of safety.',
            'P/E multiple is significantly lower than the 5-year industry average.',
            'Strong free-cash-flow yield of 6.2% provides a reliable defensive floor.'
          ]
        : [
            'Trading at a significant premium to industry peers.',
            'Enterprise Value to EBITDA is currently at its historical upper decile.',
            'DCF valuation suggests current stock price already factors in aggressive future expansion.'
          ],
      metrics: symbol === 'NVDA' 
        ? { 'DCF Intrinsic': '$99.50', 'Margin of Safety': '-22%', 'P/E vs Sector': '+112%' }
        : symbol === 'AAPL'
        ? { 'DCF Intrinsic': '$215.10', 'Margin of Safety': '-2.8%', 'P/E vs Sector': '+8%' }
        : { 
            'DCF Intrinsic': `$${(basePrice * (hash % 3 === 0 ? 1.25 : 0.85)).toFixed(2)}`,
            'Margin of Safety': hash % 3 === 0 ? '+25%' : '-15%',
            'P/E vs Sector': hash % 3 === 0 ? '-18%' : '+32%'
          }
    },
    // 2. Technicals Agent
    {
      id: 'technicals',
      name: 'Technicals Agent',
      role: 'Momentum & Pattern Recognition',
      signal: changePercent > 1.5 ? 'BULLISH' : changePercent < -1.5 ? 'BEARISH' : 'NEUTRAL',
      confidence: 70 + (hash % 25),
      rationales: changePercent > 1.5
        ? [
            'RSI at 62 indicates strong positive momentum without entering overbought territory (>70).',
            'MACD line recently crossed above the signal line, triggering a bullish continuation signal.',
            'Price remains supported above the 50-day and 200-day Simple Moving Averages (SMA).'
          ]
        : changePercent < -1.5
        ? [
            'RSI under 35 signals high selling pressure, approaching oversold levels.',
            'MACD histogram shows accelerating bearish momentum below the zero line.',
            'Death cross imminent as the short-term EMA rolls over toward the 200-day SMA.'
          ]
        : [
            'RSI is hovering at 49, indicating a balanced supply-demand state in consolidation.',
            'Bollinger Bands are squeezing, suggesting a volatility breakout is building.',
            'Moving averages show parallel alignment with no clear directional trend.'
          ],
      metrics: {
        'RSI (14)': Math.min(Math.max(45 + Math.round(changePercent * 6) + (hash % 5), 25), 85),
        'MACD Histogram': changePercent > 0 ? '+0.45 (Bullish)' : '-0.62 (Bearish)',
        'SMA 50 vs 200': changePercent > 0 ? 'Golden Cross' : 'Consolidating'
      }
    },
    // 3. Fundamentals Agent
    {
      id: 'fundamentals',
      name: 'Fundamentals Agent',
      role: 'Financial Health & Growth Auditor',
      signal: peRatio < 35 || symbol === 'NVDA' ? 'BULLISH' : 'NEUTRAL',
      confidence: 65 + (hash % 30),
      rationales: peRatio < 35 || symbol === 'NVDA'
        ? [
            'Return on Equity (ROE) is exceptionally high at 28.5%, showcasing high capital efficiency.',
            'Debt-to-Equity ratio is a conservative 0.35, representing very low insolvency risk.',
            'Net income margins have expanded for three consecutive quarters due to operational leverage.'
          ]
        : [
            'Top-line revenue growth has decelerated to +2.4% YoY, suggesting market saturation.',
            'Operating margins squeezed by 150bps due to rising labor and logistics costs.',
            'Free cash flow conversion rate dropped below 80% due to capital expenditure expansion.'
          ],
      metrics: {
        'ROE': peRatio < 35 || symbol === 'NVDA' ? '28.5%' : '14.2%',
        'Debt-to-Equity': peRatio < 35 || symbol === 'NVDA' ? '0.35' : '0.88',
        'Revenue YoY': peRatio < 35 || symbol === 'NVDA' ? '+18.4%' : '+2.4%'
      }
    },
    // 4. Sentiment Agent
    {
      id: 'sentiment',
      name: 'Sentiment Agent',
      role: 'Social & Media NLP Sentiment',
      signal: symbol === 'NVDA' ? 'BULLISH' : symbol === 'TSLA' ? 'BEARISH' : hash % 2 === 0 ? 'BULLISH' : 'NEUTRAL',
      confidence: 55 + (hash % 40),
      rationales: symbol === 'NVDA'
        ? [
            'Social sentiment is extremely positive on Reddit/X with highly active retail interest.',
            'Major financial media sentiment analysis yields an 84% bullish score over 200 scanned articles.',
            'Sell-side analysts revised target prices upward 18 times in the last 14 days.'
          ]
        : symbol === 'TSLA'
        ? [
            'Retail sentiment is highly polarized with elevated short interest discussions.',
            'News NLP scans flag regulatory concern and demand deceleration headlines as key drivers.',
            'Insider selling transactions have exceeded buying by 4:1 over the past month.'
          ]
        : hash % 2 === 0
        ? [
            'Social volume spikes are positive, showing strong retail accumulation trends.',
            'General news narrative highlights successful new product lines and strategic partnerships.',
            'Analyst consensus remains firmly at "Strong Buy" with rising price targets.'
          ]
        : [
            'Public chatter is muted with low buzz index ratings on stock forums.',
            'Media coverage has been largely neutral, focusing on macroeconomic themes rather than corporate updates.',
            'Institutional flows remain static with no significant net changes in ownership.'
          ],
      metrics: {
        'Social Sentiment Index': symbol === 'NVDA' ? '92/100' : symbol === 'TSLA' ? '41/100' : hash % 2 === 0 ? '78/100' : '52/100',
        'News NLP Buzz': symbol === 'NVDA' ? 'Extremely Positive' : symbol === 'TSLA' ? 'Bearish Skepticism' : 'Moderate Bullish',
        'Analyst Buy Ratio': symbol === 'NVDA' ? '94%' : symbol === 'TSLA' ? '48%' : '72%'
      }
    },
    // 5. Risk Manager
    {
      id: 'risk',
      name: 'Risk Manager',
      role: 'Volatility & Exposure Controller',
      signal: symbol === 'TSLA' ? 'BEARISH' : changePercent < -3 ? 'BEARISH' : 'BULLISH',
      confidence: 80 + (hash % 18),
      rationales: symbol === 'TSLA'
        ? [
            'Stock beta is high (1.68), representing elevated systemic market volatility.',
            'Implied volatility is in the 88th percentile, suggesting high probability of sharp price moves.',
            'Recommended portfolio sizing cap restricted to maximum 3% to preserve asset safety.'
          ]
        : changePercent < -3
        ? [
            'Downside deviation has exceeded the 95% Value-at-Risk (VaR) threshold.',
            'Market-wide correlations are rising, warning against aggressive long positioning.',
            'Strict stop-loss triggered internally; hedging protocols activated.'
          ]
        : [
            'Beta of 1.10 aligns with benchmark limits, ensuring standard risk profile.',
            'Drawdown risk is structurally mitigated by low intra-day average true range (ATR).',
            'Sizing recommendations expanded up to 10% exposure based on positive portfolio variance.'
          ],
      metrics: {
        'Systemic Beta': symbol === 'TSLA' ? '1.68' : '1.12',
        'Daily VaR (95%)': symbol === 'TSLA' ? '4.8%' : '2.1%',
        'Max Exposure Cap': symbol === 'TSLA' ? '3.0%' : '10.0%'
      }
    }
  ];

  // Generate Backtest performance comparisons
  const backtest: BacktestDataPoint[] = [];
  const basePerfPortfolio = 100;
  const basePerfSP500 = 100;
  
  // Decide if portfolio beats SP500 based on overall signals
  const bullishCount = agents.filter(a => a.signal === 'BULLISH').length;
  const bearishCount = agents.filter(a => a.signal === 'BEARISH').length;
  const performanceGap = bullishCount - bearishCount; // positive means we beat SP500, negative means we lag
  
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    // Simulate progression
    // SP500 runs at ~10% annualized, with small noise
    const spNoise = (Math.random() - 0.45) * 1.5;
    const spVal = basePerfSP500 * (1 + (i === 30 ? 0 : (30 - i) * 0.05 + spNoise) / 100);
    
    // Portfolio behaves according to the stock's profile
    const portPerformanceMultiplier = 1 + performanceGap * 0.08;
    const portNoise = (Math.random() - 0.43) * 1.8;
    const portVal = basePerfPortfolio * (1 + (i === 30 ? 0 : (30 - i) * 0.05 * portPerformanceMultiplier + portNoise) / 100);
    
    backtest.push({
      date: dateStr,
      portfolio: parseFloat(portVal.toFixed(2)),
      sp500: parseFloat(spVal.toFixed(2))
    });
  }

  return { details, agents, backtest };
};

// Calculate final consensus dynamically based on weighted agents
export const calculateConsensus = (agents: AgentDecision[], weights: AgentWeights): Consensus => {
  let score = 0; // scale from -100 (highly bearish) to +100 (highly bullish)
  let totalWeight = 0;
  
  agents.forEach(agent => {
    const weight = weights[agent.id as keyof AgentWeights] || 0;
    totalWeight += weight;
    
    let multiplier = 0;
    if (agent.signal === 'BULLISH') multiplier = 1;
    if (agent.signal === 'BEARISH') multiplier = -1;
    // NEUTRAL is 0
    
    // Multiply by confidence and normalise
    score += (multiplier * agent.confidence * weight);
  });
  
  // Normalise score
  const averageScore = totalWeight > 0 ? score / totalWeight : 0; // ranges from -100 to +100
  
  let recommendation: 'BUY' | 'HOLD' | 'SELL' = 'HOLD';
  let positionSize = 0;
  let confidence = Math.abs(averageScore);
  
  if (averageScore > 15) {
    recommendation = 'BUY';
    // Sizing depends on how positive the score is, maxing at 100% (or capped based on risk agent)
    positionSize = Math.round(5 + (averageScore / 100) * 45); // up to 50%
  } else if (averageScore < -15) {
    recommendation = 'SELL';
    positionSize = 0;
  } else {
    recommendation = 'HOLD';
    positionSize = 0;
  }
  
  // If Risk Manager is bearish, cap sizing
  const riskAgent = agents.find(a => a.id === 'risk');
  if (riskAgent && riskAgent.signal === 'BEARISH' && recommendation === 'BUY') {
    const capStr = riskAgent.metrics['Max Exposure Cap'] as string;
    const capVal = parseFloat(capStr) || 5;
    positionSize = Math.min(positionSize, capVal);
  }

  // Rationale generation based on scores and signals
  const bullishAgents = agents.filter(a => a.signal === 'BULLISH').map(a => a.name);
  const bearishAgents = agents.filter(a => a.signal === 'BEARISH').map(a => a.name);
  
  let rationale = '';
  if (recommendation === 'BUY') {
    rationale = `Strong bullish consensus driven by ${bullishAgents.join(', ')}. Technical momentum is strong and financial health is robust. Risk parameters allow for a ${positionSize}% allocation.`;
    if (riskAgent && riskAgent.signal === 'BEARISH') {
      rationale += ` Sizing is actively capped at ${positionSize}% due to elevated risk parameters flags by the Risk Manager.`;
    }
  } else if (recommendation === 'SELL') {
    rationale = `Bearish consensus determined. Key headwinds identified by ${bearishAgents.join(', ')}. Recommend liquidation or avoidance due to negative risk-adjusted yield profiles.`;
  } else {
    rationale = `Neutral consolidation recommended. Market forces are balanced. Valuation is fair and technical triggers are quiet. Retain current holdings but suspend additional capital allocation.`;
  }

  return {
    recommendation,
    positionSize,
    rationale,
    confidence: Math.round(confidence)
  };
};
