"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignalBadge } from "@/components/SignalBadge";
import { SignalTimestamp } from "@/components/SignalTimestamp";
import { TradeSkeleton } from "@/components/TradeSkeleton";
import { cn } from "@/lib/utils";

interface ROIPoint {
  value: number;
}

interface SignalCardProps {
  loading?: boolean;
  pair?: string;
  executionPrice?: number;
  confidence?: number;
  projectedTarget?: number;
  roiHistory?: ROIPoint[];
  analysis?: string;
  signal?: "BUY" | "SELL";
  timestamp?: Date;
  onTrade?: (price: number) => void;
  onPass?: () => void;
}

function MiniROIChart({ data }: { data: ROIPoint[] }) {
  if (!data.length) return null;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 120;
  const h = 40;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d.value - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const isPositive = values[values.length - 1] >= values[0];
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-label="ROI chart"
      role="img"
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DEFAULT_ROI: ROIPoint[] = [
  { value: 0 }, { value: 1.2 }, { value: 0.8 }, { value: 2.1 },
  { value: 1.9 }, { value: 3.4 }, { value: 2.8 }, { value: 4.2 },
];

export function SignalCard({
  loading = false,
  pair = "XLM/USDC",
  executionPrice = 0.4821,
  confidence = 87,
  projectedTarget = 0.5310,
  roiHistory = DEFAULT_ROI,
  analysis = "Momentum building after a strong volume breakout above the 50-day MA. RSI at 62 with room to run.",
  signal = "BUY",
  timestamp = new Date(Date.now() - 5 * 60 * 1000),
  onTrade,
  onPass,
}: SignalCardProps) {
  const [passed, setPassed] = useState(false);

  if (loading) return <TradeSkeleton />;
  if (passed) return null;

  const roi = (((projectedTarget - executionPrice) / executionPrice) * 100).toFixed(2);
  const isPositive = parseFloat(roi) >= 0;
  const DirectionIcon = signal === "BUY" ? TrendingUp : signal === "SELL" ? TrendingDown : Minus;

  function handlePass() {
    setPassed(true);
    onPass?.();
  }

  return (
    <article
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-lg flex flex-col gap-4"
      aria-label={`${signal} signal for ${pair}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DirectionIcon
            size={18}
            className={cn(signal === "BUY" ? "text-green-400" : signal === "SELL" ? "text-red-400" : "text-slate-400")}
            aria-hidden
          />
          <span className="font-bold text-white text-lg tracking-tight">{pair}</span>
        </div>
        <SignalBadge signal={signal === "NEUTRAL" ? "BUY" : signal} />
      </div>

      {/* Price + ROI chart */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-400">Execution price</span>
          <span className="font-mono text-white font-semibold">${executionPrice.toFixed(4)}</span>
          <span className="text-xs text-slate-400 mt-1">Target</span>
          <span className="font-mono text-white font-semibold">${projectedTarget.toFixed(4)}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <MiniROIChart data={roiHistory} />
          <span
            className={cn(
              "text-xs font-semibold",
              isPositive ? "text-green-400" : "text-red-400"
            )}
          >
            {isPositive ? "+" : ""}{roi}% ROI
          </span>
        </div>
      </div>

      {/* Confidence */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Confidence</span>
          <span className="text-white font-semibold">{confidence}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10" role="progressbar" aria-valuenow={confidence} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={cn("h-full rounded-full transition-all", confidence >= 75 ? "bg-green-400" : confidence >= 50 ? "bg-yellow-400" : "bg-red-400")}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Technical analysis */}
      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{analysis}</p>

      {/* Timestamp */}
      <SignalTimestamp updatedAt={timestamp} />

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white min-h-[44px]"
          onClick={handlePass}
          aria-label="Pass this signal"
        >
          <X size={14} aria-hidden />
          Pass
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-sky-500 hover:bg-sky-400 text-white min-h-[44px]"
          onClick={() => onTrade?.(executionPrice)}
          aria-label={`Execute trade for ${pair}`}
        >
          <Zap size={14} aria-hidden />
          Execute Trade
        </Button>
      </div>
    </article>
  );
}
