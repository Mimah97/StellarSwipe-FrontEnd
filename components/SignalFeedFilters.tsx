"use client";

import { useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FilterDirection,
  useSignalFilterStore,
} from "@/store/useSignalFilterStore";

const DIRECTIONS: { label: string; value: FilterDirection }[] = [
  { label: "All", value: "ALL" },
  { label: "Buy", value: "BUY" },
  { label: "Sell", value: "SELL" },
];

interface SignalFeedFiltersProps {
  /** Unique asset names derived from the current signal list */
  availableAssets?: string[];
  /** Unique provider names derived from the current signal list */
  availableProviders?: string[];
}

export function SignalFeedFilters({
  availableAssets = [],
  availableProviders = [],
}: SignalFeedFiltersProps) {
  const { direction, asset, provider, setDirection, setAsset, setProvider, reset } =
    useSignalFilterStore();
  const assetInputRef = useRef<HTMLInputElement>(null);

  const isActive = direction !== "ALL" || asset !== "" || provider !== "";

  return (
    <section
      aria-label="Signal feed filters"
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4"
    >
      {/* Title row */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
          <SlidersHorizontal size={13} aria-hidden="true" />
          Filters
        </span>
        {isActive && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
            aria-label="Clear all filters"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Direction pills */}
        <fieldset className="flex items-center gap-1" aria-label="Filter by direction">
          {DIRECTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setDirection(value)}
              aria-pressed={direction === value}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                direction === value
                  ? value === "BUY"
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : value === "SELL"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-gray-300"
              )}
            >
              {label}
            </button>
          ))}
        </fieldset>

        {/* Asset filter */}
        <div className="relative flex items-center">
          {availableAssets.length > 0 ? (
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              aria-label="Filter by asset"
              className="appearance-none rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/20 transition-colors pr-6"
            >
              <option value="">All assets</option>
              {availableAssets.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          ) : (
            <div className="relative">
              <input
                ref={assetInputRef}
                type="text"
                value={asset}
                onChange={(e) => setAsset(e.target.value.toUpperCase())}
                placeholder="Asset (e.g. XLM)"
                aria-label="Filter by asset"
                maxLength={10}
                className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/20 transition-colors w-32"
              />
              {asset && (
                <button
                  onClick={() => {
                    setAsset("");
                    assetInputRef.current?.focus();
                  }}
                  aria-label="Clear asset filter"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Provider filter — only shown when provider data is available */}
        {availableProviders.length > 0 && (
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            aria-label="Filter by provider"
            className="appearance-none rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/20 transition-colors"
          >
            <option value="">All providers</option>
            {availableProviders.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Active filter summary */}
      {isActive && (
        <p className="text-[11px] text-gray-500" aria-live="polite">
          Showing:{" "}
          {[
            direction !== "ALL" && `Direction: ${direction}`,
            asset && `Asset: ${asset}`,
            provider && `Provider: ${provider}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </section>
  );
}
