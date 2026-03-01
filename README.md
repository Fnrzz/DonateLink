# DonateLink

> **Cross-chain crypto donation platform for live streamers — powered by Chainlink CCIP, Data Feeds, Automation, and CRE Workflows.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-donatelink.vercel.app-blue?style=for-the-badge)](https://donatelink.vercel.app)
[![Chainlink Hackathon](https://img.shields.io/badge/Chainlink-Convergence%20Hackathon%202025-375BD2?style=for-the-badge&logo=chainlink)](https://chain.link/hackathon)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Tests](https://img.shields.io/badge/Forge%20Tests-16%20passing-brightgreen?style=for-the-badge)](contracts/test/)

---

## What Is DonateLink?

DonateLink is a **permissionless, cross-chain donation protocol** for content creators and live streamers. Fans can donate in ETH, USDC, or LINK — from any supported blockchain — and creators receive everything in one place on Base, with **real-time on-screen alerts** in their OBS stream.

No middlemen. No bank accounts. No borders. Just wallets.

---

## The Problem We Solve

| Problem | DonateLink Solution |
|---|---|
| Donations locked to one chain | CCIP bridges funds from ETH, Arbitrum, Optimism → Base |
| No live USD price display | Chainlink Data Feeds (ETH/USD, LINK/USD) |
| Manual donation tracking | CRE Workflow auto-records every on-chain event |
| No livestream integration | OBS WebSocket overlay with real-time alerts |
| Opaque platform fees | 5% fee hardcoded on-chain, visible to everyone |

---

## Live Demo

| Resource | Link |
|---|---|
| **Web App** | [donatelink.vercel.app](https://donatelink.vercel.app) |
| **GitHub** | [github.com/Fnrzz/DonateLink](https://github.com/Fnrzz/DonateLink) |
| **Demo Video** | [YouTube / Loom link — see submission] |

---

## Chainlink Integration (Hackathon Required Section)

DonateLink uses **4 Chainlink products** in production. Every integration is real, on-chain, and verifiable.

### 1. Chainlink CCIP — Cross-Chain Donations

Files:
- [`contracts/src/DonateLinkCCIPSender.sol`](contracts/src/DonateLinkCCIPSender.sol) — Deployed on Ethereum Sepolia; users call `donateCrossChain()` which sends a CCIP message to Base
- [`contracts/src/DonateLinkCCIPReceiver.sol`](contracts/src/DonateLinkCCIPReceiver.sol) — Deployed on Base Sepolia; receives CCIP message and calls `DonateLink.receiveFromCCIP()`
- [`src/hooks/useDonate.ts`](src/hooks/useDonate.ts) — Frontend hook for `useCrossChainDonate()`
- [`src/hooks/useCCIPFee.ts`](src/hooks/useCCIPFee.ts) — Estimates live CCIP fees from the router contract

How it works: A donor on Ethereum Sepolia calls `donateCrossChain()`. The CCIPSender encodes the donation payload and sends a CCIP cross-chain message to the CCIPReceiver on Base Sepolia. The receiver validates the message and credits the creator's balance — all trustlessly via Chainlink CCIP.

### 2. Chainlink Data Feeds — Live USD Pricing

Files:
- [`contracts/src/DonateLink.sol`](contracts/src/DonateLink.sol) — Reads `AggregatorV3Interface` for ETH/USD and LINK/USD on every donation, stores USD value with 8 decimals
- [`src/hooks/usePriceFeed.ts`](src/hooks/usePriceFeed.ts) — Frontend reads the same price feeds via `useReadContract` to show live token→USD conversion

Price Feed Addresses (Base Sepolia):
- ETH/USD: `0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1`
- LINK/USD: `0xb113F5A928BCfF189C998ab20d753a47F9dE5A61`

How it works: Every time a donation hits the contract, `latestRoundData()` is called to get the current ETH or LINK price in USD. This value is recorded on-chain in the `DonationReceived` event, ensuring the historical USD value is permanently verifiable — not relying on an off-chain price after the fact.

### 3. Chainlink Automation — Periodic Tasks

Files:
- [`contracts/src/DonateLinkAutomation.sol`](contracts/src/DonateLinkAutomation.sol) — Implements `AutomationCompatibleInterface`; `checkUpkeep()` evaluates if milestone thresholds are crossed, `performUpkeep()` emits milestone events used by the frontend

How it works: Chainlink Automation calls `checkUpkeep()` every block. When a creator crosses a donation milestone (e.g. $100, $1,000), `performUpkeep()` emits a `MilestoneReached` event, which the CRE workflow picks up to trigger a special celebration alert in the OBS overlay.

### 4. Chainlink CRE Workflows — Off-Chain Orchestration

Files:
- [`cre/workflows/donation-orchestrator/workflow.yaml`](cre/workflows/donation-orchestrator/workflow.yaml) — Declares the workflow: EVM log trigger on `DonationReceived` events
- [`cre/workflows/donation-orchestrator/handler.ts`](cre/workflows/donation-orchestrator/handler.ts) — Handler logic: records to Supabase → enriches with CoinGecko → generates AI celebration message via OpenAI

How it works: The CRE Workflow subscribes to `DonationReceived` events on Base Sepolia. On each event:
1. **Records** the donation in Supabase via REST API (with deduplication by `tx_hash`)
2. **Enriches** with current token prices from CoinGecko for historical accuracy
3. **Generates** a personalized AI celebration message via OpenAI GPT-4o
4. **Triggers** the OBS overlay alert with the enriched data

This is exactly the Chainlink Convergence vision: on-chain events seamlessly triggering verifiable off-chain computation.

---

## Architecture

```
  Donor Wallets (Any Chain)
  ┌─────────┐  ┌─────────┐  ┌─────────┐
  │Ethereum │  │Arbitrum │  │Optimism │
  │Sepolia  │  │Sepolia  │  │Sepolia  │
  │CCIPSend │  │CCIPSend │  │CCIPSend │
  └────┬────┘  └────┬────┘  └────┬────┘
       └────────────┴────────────┘
                    │
            Chainlink CCIP
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │           Base Sepolia              │
  │                                     │
  │  CCIPReceiver ──────► DonateLink   │
  │                           │         │
  │    Chainlink Data Feeds ──┤         │
  │    (ETH/USD, LINK/USD)    │         │
  │                           │         │
  │    Chainlink Automation ──┤         │
  │    (Milestones)           │         │
  └───────────────────────────┼─────────┘
                              │ DonationReceived event
                              ▼
  ┌───────────────────────────────────────┐
  │       Chainlink CRE Workflow          │
  │                                       │
  │  EVM Log Trigger                      │
  │    → Supabase (record donation)       │
  │    → CoinGecko (enrich price)         │
  │    → OpenAI (celebration message)     │
  └───────────────────────────────────────┘
                              │
                              ▼
  ┌───────────────────────────────────────┐
  │         Next.js Frontend              │
  │                                       │
  │  Dashboard  │  Donate  │  Leaderboard │
  │  Overlay (OBS WebSocket alerts)       │
  └───────────────────────────────────────┘
```

---

## Key Features

- **Cross-chain donations** — ETH, USDC, LINK from Ethereum / Arbitrum / Optimism, received on Base
- **Live OBS overlay** — WebSocket-powered animated donation alerts shown in-stream
- **On-chain USD tracking** — Dollar value permanently recorded at donation time via Chainlink Data Feeds
- **Creator dashboard** — View stats, donation history, and withdraw funds at any time
- **Global leaderboard** — Top donors ranked by total USD donated (fetched from Supabase)
- **CRE orchestration** — Every on-chain donation auto-triggers enrichment + AI celebration message
- **5% platform fee** — Fully transparent, set in basis points on-chain, configurable by owner

---

## Smart Contract Addresses

| Contract | Network | Address |
|---|---|---|
| **DonateLink** | Base Sepolia | [`0x5217eAA2569793869caAeb8286a9Ce0854426901`](https://sepolia.basescan.org/address/0x5217eAA2569793869caAeb8286a9Ce0854426901) |
| **CCIPReceiver** | Base Sepolia | [`0x48e06ef78ff54Be337a604b02d75852ab0c6FC45`](https://sepolia.basescan.org/address/0x48e06ef78ff54Be337a604b02d75852ab0c6FC45) |
| **Automation** | Base Sepolia | [`0x0C4C4F264D250Ce93A387B54FB22EFF49935e3A3`](https://sepolia.basescan.org/address/0x0C4C4F264D250Ce93A387B54FB22EFF49935e3A3) |
| **CCIPSender** | Ethereum Sepolia | [`0x5217eAA2569793869caAeb8286a9Ce0854426901`](https://sepolia.etherscan.io/address/0x5217eAA2569793869caAeb8286a9Ce0854426901) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Framer Motion |
| **Web3** | Wagmi 2, Viem, RainbowKit 2 |
| **Smart Contracts** | Solidity 0.8.24, Foundry |
| **Database** | Supabase (PostgreSQL + real-time subscriptions) |
| **Chainlink** | CCIP, Data Feeds, Automation, CRE Workflows |
| **Deployment** | Vercel (frontend), Base Sepolia (contracts) |

---

## Project Structure

```
donatelink/
├── contracts/                          # Solidity smart contracts (Foundry)
│   ├── src/
│   │   ├── DonateLink.sol              # Core: donations, withdrawals, Data Feeds
│   │   ├── DonateLinkCCIPSender.sol    # CCIP: cross-chain sender (source chains)
│   │   ├── DonateLinkCCIPReceiver.sol  # CCIP: cross-chain receiver (Base)
│   │   └── DonateLinkAutomation.sol    # Automation: milestone upkeep
│   ├── script/                         # Foundry deployment scripts
│   └── test/                           # Forge tests (16 tests, all passing)
├── cre/
│   └── workflows/donation-orchestrator/
│       ├── workflow.yaml               # CRE: EVM log trigger definition
│       └── handler.ts                  # CRE: off-chain orchestration logic
├── src/
│   ├── app/
│   │   ├── [username]/                 # Public donation page
│   │   ├── dashboard/                  # Creator dashboard
│   │   ├── leaderboard/                # Global donor leaderboard
│   │   ├── overlay/                    # OBS real-time alert overlay
│   │   └── api/                        # API routes (donate, profile, withdraw)
│   ├── hooks/
│   │   ├── useDonate.ts                # ETH / token / cross-chain donate hooks
│   │   ├── usePriceFeed.ts             # Chainlink Data Feed reads
│   │   ├── useCCIPFee.ts               # CCIP fee estimation
│   │   └── useProfile.ts               # Creator profile management
│   └── lib/
│       ├── contracts.ts                # Contract addresses & token config
│       ├── chains.ts                   # Supported chain config
│       └── abi/                        # Contract ABIs
└── supabase/
    └── migrations/                     # Database schema migrations
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Supabase](https://supabase.com) account
- [WalletConnect](https://cloud.walletconnect.com) project ID
- Testnet ETH on Base Sepolia (and optionally Ethereum Sepolia / Arbitrum Sepolia / Optimism Sepolia for cross-chain testing)

### 1. Clone & Install

```bash
git clone https://github.com/Fnrzz/DonateLink.git
cd DonateLink
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in the required values — see [`.env.example`](.env.example) for all descriptions.

### 3. Setup Supabase

1. Create a new Supabase project
2. Open the SQL Editor and run the contents of [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)
3. Copy the project URL and anon key to `.env.local`

### 4. Deploy Smart Contracts

```bash
cd contracts

# Install Foundry dependencies
forge install

# Deploy DonateLink + CCIPReceiver + Automation to Base Sepolia
forge script script/DeployDonateLink.s.sol --rpc-url base_sepolia --broadcast --verify

# Deploy CCIPSender to Ethereum Sepolia
CCIP_ROUTER=0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59 \
DEST_CHAIN_SELECTOR=10344971235874465080 \
DEST_CCIP_RECEIVER=<your_receiver_address> \
forge script script/DeployCCIPSender.s.sol --rpc-url eth_sepolia --broadcast --verify

# Repeat for Arbitrum Sepolia and Optimism Sepolia
```

After deployment, paste the contract addresses into `.env.local`.

### 5. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Run Tests

```bash
# Smart contract tests (16 tests)
cd contracts && forge test -vvv

# Frontend build check
npm run build
```

---

## Supported Networks

| Network | Chain ID | Role |
|---|---|---|
| Base Sepolia | 84532 | Main contract — receives all donations |
| Ethereum Sepolia | 11155111 | CCIP sender |
| Arbitrum Sepolia | 421614 | CCIP sender |
| Optimism Sepolia | 11155420 | CCIP sender |

## Supported Tokens

| Token | Pricing Source |
|---|---|
| ETH | Chainlink ETH/USD Data Feed |
| LINK | Chainlink LINK/USD Data Feed |
| USDC | 1:1 stablecoin (no feed needed) |

---

## Team

Built at the Chainlink Convergence Hackathon 2025 by a team passionate about creator monetization in Web3.

---

## License

[MIT](LICENSE)
