"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Image
              src="/logo.png"
              alt="DonateLink Logo"
              width={200}
              height={200}
              className=" rounded-lg object-cover"
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/leaderboard"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Leaderboard
            </Link>
            {isConnected && (
              <Link
                href="/dashboard"
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>
    </nav>
  );
}
