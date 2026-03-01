"use client";

import { motion } from "framer-motion";
import { Globe, Bell, Coins, Link2 } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Cross-Chain Donations",
    description:
      "Accept donations from Ethereum, Arbitrum, Optimism, and Base. Powered by Chainlink CCIP for seamless cross-chain transfers.",
    color: "text-primary",
    bg: "bg-primary",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description:
      "Get instant OBS overlay alerts when donations come in. Perfect for live streams with animated notifications.",
    color: "text-success",
    bg: "bg-success",
  },
  {
    icon: Coins,
    title: "Low Platform Fee",
    description:
      "Only 5% platform fee. Receive donations in ETH, USDC, or LINK with real-time price feeds from Chainlink.",
    color: "text-warning",
    bg: "bg-accent",
  },
  {
    icon: Link2,
    title: "On-Chain Transparency",
    description:
      "Every donation is recorded on-chain. Donors and streamers can verify all transactions on the blockchain.",
    color: "text-danger",
    bg: "bg-danger",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function SellingPoints() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-text-primary sm:text-4xl">
            Why DonateLink?
          </h2>
          <p className="mx-auto max-w-2xl font-medium text-text-secondary">
            The easiest way to support content creators with crypto, across any blockchain.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group border-2 border-border bg-surface-white p-6 shadow-[4px_4px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center border-2 border-border ${feature.bg}`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold uppercase text-text-primary">
                {feature.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
