export interface ChartPoint {
  time: string;
  price: number;
}

export interface StockDetails {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  peRatio: number;
  marketCap: string;
  high: number;
  low: number;
  chartData: ChartPoint[];
}

export type SignalType = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface AgentDecision {
  id: string;
  name: string;
  role: string;
  signal: SignalType;
  confidence: number;
  rationales: string[];
  metrics: Record<string, string | number>;
  avatarUrl?: string;
}

export interface Consensus {
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  positionSize: number;
  rationale: string;
  confidence: number;
}

export interface BacktestDataPoint {
  date: string;
  portfolio: number;
  sp500: number;
}

export interface AgentWeights {
  valuation: number;
  technicals: number;
  fundamentals: number;
  sentiment: number;
  risk: number;
}
