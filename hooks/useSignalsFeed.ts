"use client";

import { useQuery } from "@tanstack/react-query";
import { useDemoModeStore } from "@/store/useDemoModeStore";
import { buildSignalPage, Signal, SignalFeedPage } from "@/lib/signals";

export function useSignalsFeed() {
  const { isDemoMode } = useDemoModeStore();

  const fetchLiveSignals = async (): Promise<Signal[]> => {
    const response = await fetch("/api/signals");
    if (!response.ok) {
      throw new Error("Failed to fetch signals");
    }
    const page: SignalFeedPage = await response.json();
    return page.items;
  };

  const fetchDemoSignals = async (): Promise<Signal[]> => {
    const page = buildSignalPage(1, 5);
    return page.items;
  };

  const { data: signals, isLoading, error, refetch } = useQuery({
    queryKey: ["signals", isDemoMode ? "demo" : "live"],
    queryFn: isDemoMode ? fetchDemoSignals : fetchLiveSignals,
    staleTime: 60000,
  });

  return {
    signals: signals || [],
    isLoading,
    error,
    refetch,
    isDemoMode,
  };
}