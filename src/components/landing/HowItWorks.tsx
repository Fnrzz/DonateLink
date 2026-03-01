"use client";

import { motion } from "framer-motion";
import { Wallet, Search, Send } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    step: "01",
    title: "Connect Wallet",
    description: "Connect with MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet.",
  },
  {
    icon: Search,
    step: "02",
    title: "Find a Creator",
    description: "Search for your favorite streamer or use their unique donation link.",
  },
  {
    icon: Send,
    step: "03",
    title: "Send Donation",
    description: "Choose your token, enter an amount in USD, add a message, and send!",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y-3 border-border bg-surface-light py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-text-primary sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl font-medium text-text-secondary">
            Three simple steps to support your favorite creator
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {/* Connector line */}
          <div className="absolute left-0 right-0 top-16 hidden h-[3px] bg-border md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center border-2 border-border bg-surface-white shadow-[3px_3px_0_#000]">
                <step.icon className="h-7 w-7 text-primary" />
                <span className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center border-2 border-border bg-primary text-xs font-black text-white shadow-[2px_2px_0_#000]">
                  {step.step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold uppercase text-text-primary">
                {step.title}
              </h3>
              <p className="text-sm font-medium text-text-secondary">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
