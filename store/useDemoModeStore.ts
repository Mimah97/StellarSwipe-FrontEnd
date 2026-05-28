import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DemoState {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (enabled: boolean) => void;
}

export const useDemoModeStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
      setDemoMode: (enabled) => set({ isDemoMode: enabled }),
    }),
    { name: "demo-mode-store" }
  )
);