import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-3 border-border bg-surface-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
          <div className="flex h-6 w-6 items-center justify-center border-2 border-border bg-primary">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span>DonateLink &mdash; Powered by Chainlink</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-bold text-text-secondary">
          <span>Built for Chainlink Convergence Hackathon</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">Base Network</span>
        </div>
      </div>
    </footer>
  );
}
