"use client";

import { useState } from "react";
import {
  isConnected,
  getAddress,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import { useWalletStore } from "@/store/useWalletStore";
import { NETWORK_PASSPHRASE } from "@/lib/stellar";
import { toast } from "@/lib/toast";
import { traceWorker } from "@/src/tracing/worker-tracing.service";

function isUserRejection(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("rejected") ||
    msg.includes("denied") ||
    msg.includes("cancelled") ||
    msg.includes("canceled") ||
    msg.includes("declined") ||
    msg.includes("user rejected")
  );
}

export function useWallet() {
  const {
    publicKey,
    isConnected: connected,
    setPublicKey,
    setConnected,
    disconnect,
  } = useWalletStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  async function connect() {
    try {
      setIsConnecting(true);
      const connectedResponse = await isConnected();
      if (!connectedResponse?.isConnected) {
        toast.error("Freighter wallet not found. Please install it.");
        return;
      }
      await requestAccess();
      const result = await getAddress();
      const key = typeof result === "string" ? result : result.address;
      setPublicKey(key);
      setConnected(true);
      toast.success("Wallet connected");
      window.dispatchEvent(
        new CustomEvent("wallet-connected", { detail: { publicKey: key } })
      );
    } catch (err) {
      if (isUserRejection(err)) {
        toast.info("Connection request declined.");
      } else {
        toast.error("Failed to connect wallet.");
        console.error(err);
      }
    } finally {
      setIsConnecting(false);
    }
  }

  async function sign(transactionXdr: string, networkPassphrase?: string): Promise<string> {
    if (!connected || !publicKey) {
      throw new Error("Wallet not connected");
    }
    setIsSigning(true);
    try {
      const result = await signTransaction(transactionXdr, {
        networkPassphrase: networkPassphrase ?? NETWORK_PASSPHRASE,
        address: publicKey,
      });
      return typeof result === "string" ? result : result.signedTxXdr;
    } catch (err) {
      if (isUserRejection(err)) {
        toast.info("Transaction signing declined.");
        throw err;
      }
      toast.error("Failed to sign transaction.");
      console.error(err);
      throw err;
    } finally {
      setIsSigning(false);
    }
  }

  function disconnectWallet() {
    disconnect();
    toast.info("Wallet disconnected");
    window.dispatchEvent(new CustomEvent("wallet-disconnected"));
  }

  return {
    publicKey,
    connected,
    connect,
    disconnect: disconnectWallet,
    sign,
    isConnecting,
    isSigning,
  };
}
