"use client";

import { formatUsd, formatToken } from "@/lib/utils";
import type { SupportedChainKey } from "@/lib/chains";

type FeePreviewProps = {
  amountUsd: number;
  tokenAmount: number;
  tokenSymbol: string;
  sourceChain: SupportedChainKey;
  platformFeeUsd: number;
  ccipFeeUsd?: number;
  isFeeLoading?: boolean;
};

export function FeePreview({
  amountUsd,
  tokenAmount,
  tokenSymbol,
  sourceChain,
  platformFeeUsd,
  ccipFeeUsd,
  isFeeLoading,
}: FeePreviewProps) {
  if (amountUsd <= 0) return null;

  const streamerReceives = amountUsd - platformFeeUsd;

  return (
    <div className="border-2 border-border bg-surface-light p-4">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-bold text-text-secondary">You send</span>
          <span className="font-bold text-text-primary">
            {formatToken(tokenAmount)} {tokenSymbol}
            <span className="ml-1 font-medium text-text-muted">({formatUsd(amountUsd)})</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-text-secondary">Platform fee (5%)</span>
          <span className="font-medium text-text-muted">-{formatUsd(platformFeeUsd)}</span>
        </div>
        {sourceChain !== "base" && (
          <div className="flex justify-between">
            <span className="font-bold text-text-secondary">CCIP bridge fee</span>
            <span className="font-medium text-text-muted">
              {isFeeLoading
                ? "estimating..."
                : ccipFeeUsd
                  ? `~${formatUsd(ccipFeeUsd)}`
                  : "~$2-5 (estimate)"}
            </span>
          </div>
        )}
        <div className="border-t-2 border-border pt-2">
          <div className="flex justify-between">
            <span className="font-black text-text-primary">Creator receives</span>
            <span className="font-black text-success">{formatUsd(streamerReceives)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
