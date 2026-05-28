"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export function PortfolioSummaryCards() {
  const { assets, totalValue } = usePortfolioStore();

  const activePositions = assets.filter((a) => a.value > 0).length;
  // Demo P&L: show a simple percent for illustration (in a real app use cost basis)
  const pnlPercent = totalValue > 0 ? 4.2 : 0; // 4.2% demo
  const pnlValue = (totalValue * pnlPercent) / 100;

  const topAssets = assets.slice(0, 3);

  return (
    <div className="w-full max-w-md grid grid-cols-1 gap-3">
      <Card>
        <CardHeader>
          <h3 className="text-sm font-medium text-foreground">Portfolio</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-foreground-muted">Total Value</p>
              <p className="text-xl font-semibold">${totalValue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-foreground-muted">P&L (24h)</p>
              <p className={`text-sm font-medium ${pnlValue >= 0 ? "text-green-400" : "text-red-400"}`}>
                {pnlValue >= 0 ? "+" : "-"}${Math.abs(pnlValue).toFixed(2)} ({pnlPercent}%)
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-foreground-subtle">Positions</p>
              <p className="font-medium mt-0.5">{activePositions}</p>
            </div>
            <div>
              <p className="text-foreground-subtle">Allocation</p>
              <p className="font-medium mt-0.5">{assets.length} assets</p>
            </div>
            <div>
              <p className="text-foreground-subtle">Top Asset</p>
              <p className="font-medium mt-0.5">{topAssets[0]?.symbol ?? "—"}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-foreground-muted mb-2">Exposure</p>
            <ul className="flex gap-2 text-xs">
              {topAssets.map((a) => (
                <li key={a.symbol} className="flex-1 rounded-md bg-foreground/5 px-2 py-1 text-center">
                  <div className="text-foreground font-medium">{a.symbol}</div>
                  <div className="text-foreground-muted">{a.percentage?.toFixed(1) ?? 0}%</div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
