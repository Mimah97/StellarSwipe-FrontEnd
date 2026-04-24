"use client";

import { SignalTimestamp } from "./SignalTimestamp";

interface SignalCardProps {
  asset: string;
  signal: "BUY" | "SELL";
  updatedAt: Date;
  description?: string;
}

export function SignalCard({ asset, signal, updatedAt, description }: SignalCardProps) {
  const isBuy = signal === "BUY";
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg">{asset}</span>
        <span
          aria-label={isBuy ? "Buy signal" : "Sell signal"}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
            isBuy ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {signal}
        </span>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <SignalTimestamp updatedAt={updatedAt} />
    </div>
  );
}
