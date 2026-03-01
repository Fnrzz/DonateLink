"use client";

import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, Copy } from "lucide-react";
import { formatUsd, truncateAddress } from "@/lib/utils";
import { EXPLORER_URLS } from "@/lib/contracts";
import { toast } from "sonner";

type DonationSuccessProps = {
  txHash: string;
  amountUsd: number;
  tokenSymbol: string;
  chainId: number;
  onReset: () => void;
};

export function DonationSuccess({
  txHash,
  amountUsd,
  tokenSymbol,
  chainId,
  onReset,
}: DonationSuccessProps) {
  const explorerUrl = `${EXPLORER_URLS[chainId] || EXPLORER_URLS[84532]}/tx/${txHash}`;

  const copyTxHash = () => {
    navigator.clipboard.writeText(txHash);
    toast.success("Transaction hash copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-3 border-primary bg-surface-white p-8 text-center shadow-[6px_6px_0_#2563EB]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-success" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-black uppercase text-text-primary">
        Donation Sent!
      </h2>
      <p className="mb-6 text-4xl font-black text-primary">
        {formatUsd(amountUsd)}
      </p>
      <p className="mb-6 text-sm font-bold text-text-secondary">
        Paid with {tokenSymbol}
      </p>

      <div className="mb-6 flex items-center justify-center gap-2 border-2 border-border bg-surface-light px-4 py-2">
        <span className="text-xs font-bold text-text-muted">TX:</span>
        <span className="text-xs font-bold text-text-secondary">
          {truncateAddress(txHash, 8)}
        </span>
        <button onClick={copyTxHash} className="text-text-muted hover:text-text-primary cursor-pointer">
          <Copy className="h-3.5 w-3.5" />
        </button>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-dark"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <button
        onClick={onReset}
        className="border-2 border-border bg-surface-white px-6 py-2.5 text-sm font-black uppercase text-text-primary shadow-[4px_4px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
      >
        Send Another Donation
      </button>
    </motion.div>
  );
}
