import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WalletState {
  publicKey: string | null;
  isConnected: boolean;
  network: string;
  setPublicKey: (key: string | null) => void;
  setConnected: (connected: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      publicKey: null,
      isConnected: false,
      network: "TESTNET",
      setPublicKey: (key) => set({ publicKey: key }),
      setConnected: (connected) => set({ isConnected: connected }),
      disconnect: () => set({ publicKey: null, isConnected: false }),
    }),
    { name: "wallet-store" }
  )
);
