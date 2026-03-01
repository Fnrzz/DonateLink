"use client";

import { cn } from "@/lib/utils";
import { usePriceFeed } from "@/hooks/usePriceFeed";
import { TOKENS } from "@/lib/contracts";
import { formatUsd } from "@/lib/utils";
import type { Address } from "viem";

type TokenSelectorProps = {
  selectedToken: string;
  onTokenChange: (token: string) => void;
};

function TokenOption({
  token,
  isSelected,
  onClick,
}: {
  token: (typeof TOKENS)[string];
  isSelected: boolean;
  onClick: () => void;
}) {
  const { price, isLoading } = usePriceFeed(token.priceFeedAddress as Address);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 border-2 p-3 transition-all cursor-pointer",
        isSelected
          ? "border-primary bg-primary/10 shadow-[2px_2px_0_#2563EB]"
          : "border-border bg-surface-white shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000]"
      )}
    >
      <span className="text-sm font-black text-text-primary">{token.symbol}</span>
      <span className="text-xs font-bold text-text-muted">
        {token.symbol === "USDC"
          ? "$1.00"
          : isLoading
            ? "..."
            : formatUsd(price ?? 0)}
      </span>
    </button>
  );
}

export function TokenSelector({ selectedToken, onTokenChange }: TokenSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-text-primary">
        Pay with
      </label>
      <div className="flex gap-2">
        {Object.values(TOKENS).map((token) => (
          <TokenOption
            key={token.symbol}
            token={token}
            isSelected={selectedToken === token.symbol}
            onClick={() => onTokenChange(token.symbol)}
          />
        ))}
      </div>
    </div>
  );
}
