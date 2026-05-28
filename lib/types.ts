export interface Signal {
  id: string;
  asset: string;
  pair: string;
  direction: "BUY" | "SELL" | "NEUTRAL";
  confidence: number; // 0–100
  price: string;
  timestamp: string;
  analysis: string; // technical analysis copy — can be long
  tags?: string[];
  providerId?: string;
}

export interface SignalProvider {
  id: string;
  address: string;
  name?: string;
  overallScore: number; // 0–100
  winRate: number; // 0–100
  totalSignals: number;
  recentPerformance: number; // percentage
  rank: number;
}
