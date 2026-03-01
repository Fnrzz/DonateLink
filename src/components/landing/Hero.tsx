"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Zap, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background pattern - brutalist grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                            repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-6 inline-flex items-center gap-2 border-2 border-border bg-accent px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-text-primary shadow-[2px_2px_0_#000]"
          >
            <Zap className="h-3.5 w-3.5" />
            Powered by Chainlink CRE
          </motion.div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-black uppercase tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
            Support Creators{" "}
            <span className="text-primary underline decoration-4 underline-offset-4 decoration-accent">
              Across Any Chain
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 text-lg font-medium text-text-secondary sm:text-xl">
            Send crypto donations to your favorite streamers from any blockchain.
            Real-time alerts, cross-chain support, and full transparency.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border-2 border-border bg-primary px-8 py-3.5 text-base font-bold uppercase tracking-wide text-white shadow-[4px_4px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              Start Receiving Donations
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 border-2 border-border bg-surface-white px-8 py-3.5 text-base font-bold uppercase tracking-wide text-text-primary shadow-[4px_4px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              View Leaderboard
            </Link>
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: Globe, text: "Cross-Chain via CCIP" },
            { icon: Zap, text: "Real-Time Alerts" },
            { icon: Shield, text: "5% Low Platform Fee" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 border-2 border-border bg-surface-white px-4 py-2 text-sm font-bold text-text-primary shadow-[2px_2px_0_#000]"
            >
              <item.icon className="h-4 w-4 text-primary" />
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
