"use client";

import { getAddress, isConnected, requestAccess } from "@stellar/freighter-api";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "@/lib/toast";

export function useWallet() {
  const { publicKey, isConnected: connected, setPublicKey, setConnected, disconnect } =
    useWalletStore();

  async function connect() {
    try {
      const connectedResponse = await isConnected();
      if (!connectedResponse?.isConnected) {
        toast.error("Freighter wallet not found. Please install it.");
        return;
      }

      const accessResponse = await requestAccess();
      if (!accessResponse?.address) {
        toast.error("Unable to access Freighter wallet.");
        return;
      }

      const addressResponse = await getAddress();
      if (!addressResponse?.address) {
        toast.error("Could not retrieve wallet address.");
        return;
      }

      setPublicKey(addressResponse.address);
      setConnected(true);
      toast.success("Wallet connected");
    } catch (err) {
      toast.error("Failed to connect wallet");
      console.error(err);
    }
  }

  function disconnectWallet() {
    disconnect();
    toast.info("Wallet disconnected");
  }

  return { publicKey, connected, connect, disconnect: disconnectWallet };
}
