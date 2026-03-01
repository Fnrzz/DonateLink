"use client";

import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [1, 5, 10, 25, 50, 100];

type AmountSelectorProps = {
  amount: string;
  onAmountChange: (amount: string) => void;
};

export function AmountSelector({ amount, onAmountChange }: AmountSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-text-primary">
        Amount (USD)
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-text-muted">
          $
        </span>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          className="w-full border-2 border-border bg-surface-white py-4 pl-10 pr-4 text-2xl font-black text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((qa) => (
          <button
            key={qa}
            type="button"
            onClick={() => onAmountChange(qa.toString())}
            className={cn(
              "border-2 px-3 py-1.5 text-sm font-bold uppercase transition-all cursor-pointer",
              amount === qa.toString()
                ? "border-primary bg-primary text-white shadow-[2px_2px_0_#000]"
                : "border-border bg-surface-white text-text-primary shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000]"
            )}
          >
            ${qa}
          </button>
        ))}
      </div>
    </div>
  );
}
