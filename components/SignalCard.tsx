"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Signal } from "@/lib/types";

// Static class used for collapsed state — must be a full string for Tailwind to include it
const COLLAPSED_CLASS = "line-clamp-3";

const directionStyles: Record<Signal["direction"], string> = {
  BUY: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  SELL: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  NEUTRAL: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
};

interface SignalCardProps {
  signal: Signal;
  className?: string;
}

export function SignalCard({ signal, className }: SignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const analysisId = useId();

  const { asset, pair, direction, confidence, price, timestamp, analysis, tags } = signal;

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

  return (
    <Card className={cn("w-full max-w-sm flex flex-col", className)}>
      {/* ── Header ── */}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground font-mono">{pair}</p>
            <h2 className="text-lg font-semibold leading-tight">{asset}</h2>
          </div>

          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
              directionStyles[direction]
            )}
            aria-label={`Direction: ${direction}`}
          >
            {direction}
          </span>
        </div>

        {/* Price + confidence row */}
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm font-mono font-medium">{price}</span>
          <ConfidenceBar value={confidence} />
          <span className="text-xs text-muted-foreground ml-auto">{formattedTime}</span>
        </div>
      </CardHeader>

      {/* ── Analysis copy ── */}
      <CardContent className="flex flex-col gap-3 flex-1">
        <div>
          {/* Accessible region so screen readers announce expansion */}
          <div
            id={analysisId}
            className={cn(
              "text-sm leading-relaxed text-foreground/80 whitespace-pre-line break-words",
              !expanded && COLLAPSED_CLASS
            )}
          >
            {analysis}
          </div>

          <AnimatePresence initial={false}>
            {!expanded && (
              <motion.div
                key="fade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                // Subtle gradient fade at the bottom of collapsed text
                className="h-5 -mt-5 bg-gradient-to-t from-card to-transparent pointer-events-none"
                aria-hidden
              />
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-auto px-0 py-0.5 text-xs text-primary hover:bg-transparent hover:underline"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls={analysisId}
          >
            {expanded ? "Show less" : "Read more"}
          </Button>
        </div>

        {/* ── Tags ── */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Confidence bar sub-component ── */
function ConfidenceBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));

  const color =
    clamped >= 70
      ? "bg-emerald-500"
      : clamped >= 40
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div
      className="flex items-center gap-1.5"
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Confidence ${clamped}%`}
    >
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{clamped}%</span>
    </div>
  );
}
