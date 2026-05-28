import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FilterDirection = "ALL" | "BUY" | "SELL";

interface SignalFilterState {
  direction: FilterDirection;
  asset: string;
  provider: string;
  setDirection: (d: FilterDirection) => void;
  setAsset: (a: string) => void;
  setProvider: (p: string) => void;
  reset: () => void;
}

export const useSignalFilterStore = create<SignalFilterState>()(
  persist(
    (set) => ({
      direction: "ALL",
      asset: "",
      provider: "",
      setDirection: (direction) => set({ direction }),
      setAsset: (asset) => set({ asset }),
      setProvider: (provider) => set({ provider }),
      reset: () => set({ direction: "ALL", asset: "", provider: "" }),
    }),
    { name: "signal-filter-store" }
  )
);
