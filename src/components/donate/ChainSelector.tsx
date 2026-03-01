"use client";

import { cn } from "@/lib/utils";
import { CHAIN_DISPLAY_NAMES, CHAIN_COLORS, type SupportedChainKey } from "@/lib/chains";

type ChainSelectorProps = {
  selectedChain: SupportedChainKey;
  onChainChange: (chain: SupportedChainKey) => void;
};

const chains: { key: SupportedChainKey; badge?: string }[] = [
  { key: "base", badge: "Direct" },
  { key: "ethereum" },
  { key: "arbitrum" },
  { key: "optimism" },
];

export function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-text-primary">
        Send from
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {chains.map((chain) => (
          <button
            key={chain.key}
            type="button"
            onClick={() => onChainChange(chain.key)}
            className={cn(
              "relative flex flex-col items-center gap-1 border-2 p-3 transition-all cursor-pointer",
              selectedChain === chain.key
                ? "border-primary bg-primary/10 shadow-[2px_2px_0_#2563EB]"
                : "border-border bg-surface-white shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000]"
            )}
          >
            <div
              className="h-3 w-3 border border-border"
              style={{ backgroundColor: CHAIN_COLORS[chain.key] }}
            />
            <span className="text-xs font-bold uppercase text-text-primary">
              {CHAIN_DISPLAY_NAMES[chain.key]}
            </span>
            {chain.badge && (
              <span className="absolute -right-1 -top-1 border-2 border-border bg-success px-1.5 py-0.5 text-[10px] font-black text-white">
                {chain.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {selectedChain !== "base" && (
        <p className="mt-2 text-xs font-bold text-text-muted">
          Cross-chain via Chainlink CCIP. Additional bridge fee applies.
        </p>
      )}
    </div>
  );
}
