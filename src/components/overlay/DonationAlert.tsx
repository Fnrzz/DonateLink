"use client";

import { motion } from "framer-motion";
import { formatUsd } from "@/lib/utils";
import type { Donation } from "@/lib/supabase/types";
import { Coins, MessageSquare } from "lucide-react";

type DonationAlertProps = {
  donation: Donation;
};

export function DonationAlert({ donation }: DonationAlertProps) {
  return (
    <motion.div
      initial={{ scale: 0, y: -50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="mx-auto max-w-md border-3 border-primary bg-surface-white p-6 shadow-[6px_6px_0_#2563EB]"
    >
      {/* Amount */}
      <p className="mb-2 text-center text-4xl font-black text-success">
        {formatUsd(donation.amount_usd)}
      </p>

      {/* Donor name */}
      <p className="mb-3 text-center text-lg font-black uppercase text-primary">
        {donation.donor_name || "Anonymous"}
      </p>

      {/* Message */}
      {donation.message && (
        <div className="mb-4 flex items-start gap-2 border-2 border-border bg-surface-light px-4 py-3">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
          <p className="text-sm font-medium leading-relaxed text-text-primary">
            {donation.message}
          </p>
        </div>
      )}

      {/* Token + Chain info */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 border-2 border-border bg-surface-white px-3 py-1">
          <Coins className="h-3.5 w-3.5 text-text-muted" />
          <span className="text-xs font-bold text-text-secondary">
            {donation.amount_token} {donation.token_symbol}
          </span>
        </div>
        <div className="border-2 border-border bg-surface-white px-3 py-1">
          <span className="text-xs font-bold text-text-secondary">
            {donation.source_chain}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
