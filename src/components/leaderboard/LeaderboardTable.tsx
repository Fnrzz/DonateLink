"use client";

import { Trophy } from "lucide-react";
import { formatUsd, truncateAddress } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/supabase/types";

const TROPHY_COLORS: Record<number, string> = {
  1: "#FFD700", // gold
  2: "#C0C0C0", // silver
  3: "#CD7F32", // bronze
};

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="border-2 border-border bg-surface-white px-6 py-16 text-center shadow-[4px_4px_0_#000]">
        <p className="text-lg font-bold text-text-secondary">
          No donations recorded yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-2 border-border bg-surface-white shadow-[4px_4px_0_#000]">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-border bg-primary">
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
              Rank
            </th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
              Donor
            </th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
              Name
            </th>
            <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-white">
              Total Donated
            </th>
            <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-white">
              Donations
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const rank = index + 1;
            const trophyColor = TROPHY_COLORS[rank];

            return (
              <tr
                key={entry.donor_address}
                className="border-b-2 border-border last:border-b-0 transition-colors hover:bg-surface-light"
              >
                {/* Rank */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {trophyColor ? (
                      <Trophy
                        className="h-5 w-5"
                        style={{ color: trophyColor }}
                      />
                    ) : (
                      <span className="text-sm font-black text-text-primary">
                        {rank}
                      </span>
                    )}
                  </div>
                </td>

                {/* Donor address */}
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-bold text-text-secondary">
                    {truncateAddress(entry.donor_address)}
                  </span>
                </td>

                {/* Donor name */}
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-text-primary">
                    {entry.donor_name || "Anonymous"}
                  </span>
                </td>

                {/* Total donated */}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-black text-success">
                    {formatUsd(entry.total_donated_usd)}
                  </span>
                </td>

                {/* Donation count */}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-text-secondary">
                    {entry.donation_count}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
