"use client";

import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { SignalFeed } from "@/components/signal/SignalFeed";

export default function Home() {
  const { publicKey, connected, connect, disconnect } = useWallet();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <motion.section
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/20"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400/90">
                StellarSwipe
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Browse market signals with infinite scroll.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Seamless signal discovery keeps the feed moving while preserving scroll state and preventing duplicate fetches.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 rounded-3xl border border-slate-700/70 bg-slate-950/80 p-5 text-slate-200 sm:items-end">
              {connected ? (
                <>
                  <p className="font-mono text-sm text-slate-400">
                    Connected wallet:
                  </p>
                  <p className="text-base font-semibold">
                    {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
                  </p>
                  <Button variant="outline" onClick={disconnect}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={connect}>
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </motion.section>

        <SignalFeed />
      </div>
    </main>
  );
}
