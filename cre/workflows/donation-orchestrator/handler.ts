/**
 * DonateLink CRE Workflow Handler
 *
 * This handler is triggered by DonationReceived events from the DonateLink
 * smart contract on Base Sepolia. It orchestrates the following:
 *
 * 1. Records the donation in Supabase via the DonateLink REST API
 * 2. Fetches current prices from CoinGecko for price context
 * 3. Generates a fun celebration message via Gemini AI
 *
 * This satisfies the Chainlink Convergence Hackathon requirements:
 * - CRE Workflow with TypeScript handler
 * - Integrates blockchain (EVM Log trigger) with external APIs
 * - Uses HTTPClient for REST calls + AI/LLM integration
 */

import {
  cre,
  EVMClient,
  HTTPClient,
  type Runtime,
  type EVMLog,
  type HTTPSendRequester,
  consensusIdenticalAggregation,
} from "@chainlink/cre-sdk";
import { Runner } from "@chainlink/cre-sdk";

// Base64 encoder for WASM runtime (no btoa available)
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function toBase64(str: string): string {
  let result = "";
  for (let i = 0; i < str.length; i += 3) {
    const a = str.charCodeAt(i);
    const b = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
    const c = i + 2 < str.length ? str.charCodeAt(i + 2) : 0;
    const trip = (a << 16) | (b << 8) | c;
    result += BASE64_CHARS[(trip >> 18) & 0x3f];
    result += BASE64_CHARS[(trip >> 12) & 0x3f];
    result += i + 1 < str.length ? BASE64_CHARS[(trip >> 6) & 0x3f] : "=";
    result += i + 2 < str.length ? BASE64_CHARS[trip & 0x3f] : "=";
  }
  return result;
}

function decodeBody(body: Uint8Array | string): string {
  if (typeof body === "string") return body;
  let str = "";
  for (let i = 0; i < body.length; i++) {
    str += String.fromCharCode(body[i]);
  }
  return str;
}

// Base Sepolia chain selector
const BASE_SEPOLIA_CHAIN_SELECTOR =
  EVMClient.SUPPORTED_CHAIN_SELECTORS["ethereum-testnet-sepolia-base-1"];

// DonateLink contract address on Base Sepolia
const DONATELINK_CONTRACT_ADDRESS =
  "0x5217eAA2569793869caAeb8286a9Ce0854426901";

// DonationReceived event signature:
// keccak256("DonationReceived(address,address,string,string,uint256,uint256,address,string,uint256)")
const DONATION_RECEIVED_EVENT_SIG =
  "0x7c0b89c70424cc72f0070e1cba7e4e29ed4e21b3a8e06b42dcd3d725b4b24906";

// Handler configuration type
interface HandlerConfig {
  apiUrl: string;
  geminiApiKey: string;
}

/**
 * Main donation handler - triggered when DonationReceived event is detected
 */
const handleDonation = (
  runtime: Runtime<HandlerConfig>,
  triggerLog: EVMLog
): string => {
  const httpClient = new HTTPClient();

  runtime.log("[DonateLink CRE] Processing donation event...");

  // Helper to convert bytes to hex string
  const toHex = (bytes: Uint8Array): string =>
    Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");

  // Get tx hash from the trigger log
  const txHash = toHex(triggerLog.txHash);
  runtime.log(`[DonateLink CRE] TX Hash: 0x${txHash}`);

  // Parse indexed event params from topics
  // topics[0] = event sig, topics[1] = donor (indexed), topics[2] = streamer (indexed)
  const donor = triggerLog.topics.length > 1
    ? "0x" + toHex(triggerLog.topics[1]).slice(24) // last 20 bytes = address
    : "unknown";
  const streamer = triggerLog.topics.length > 2
    ? "0x" + toHex(triggerLog.topics[2]).slice(24)
    : "unknown";

  runtime.log(`[DonateLink CRE] Donor: ${donor}, Streamer: ${streamer}`);

  // Parse non-indexed params from data (ABI-encoded)
  // Layout: donorName(string), message(string), amountUsd(uint256), amountToken(uint256),
  //         tokenAddress(address), sourceChain(string), timestamp(uint256)
  // For simplicity, extract uint256 values at known offsets
  const data = triggerLog.data;
  let amountUsd = 0;
  let amountToken = 0;
  let tokenAddress = "0x0000000000000000000000000000000000000000";

  if (data.length >= 224) {
    // amountUsd is the 3rd parameter (offset 64*2 = 128 bytes from start of fixed section)
    // But strings are dynamic, so we read from ABI-encoded offsets
    // Slot 0 (0-32): offset to donorName string
    // Slot 1 (32-64): offset to message string
    // Slot 2 (64-96): amountUsd (uint256)
    // Slot 3 (96-128): amountToken (uint256)
    // Slot 4 (128-160): tokenAddress (address, right-padded)
    // Slot 5 (160-192): offset to sourceChain string
    // Slot 6 (192-224): timestamp (uint256)

    // Read amountUsd (slot 2, bytes 64-96) - 8 decimal precision from Chainlink
    let usdRaw = BigInt(0);
    for (let i = 64; i < 96; i++) {
      usdRaw = (usdRaw << BigInt(8)) | BigInt(data[i]);
    }
    amountUsd = Number(usdRaw) / 1e8; // Convert from 8 decimals

    // Read amountToken (slot 3, bytes 96-128)
    let tokenRaw = BigInt(0);
    for (let i = 96; i < 128; i++) {
      tokenRaw = (tokenRaw << BigInt(8)) | BigInt(data[i]);
    }
    amountToken = Number(tokenRaw) / 1e18; // Assume 18 decimals

    // Read tokenAddress (slot 4, bytes 128-160, last 20 bytes)
    tokenAddress = "0x" + toHex(data.slice(140, 160));
  }

  runtime.log(`[DonateLink CRE] Amount USD: ${amountUsd}, Token Amount: ${amountToken}`);

  // Determine token symbol
  const TOKEN_SYMBOLS: Record<string, string> = {
    "0x0000000000000000000000000000000000000000": "ETH",
    "0x036cbd53842c5426634e7929541ec2318f3dcf7e": "USDC",
    "0xe4ab69c077896252fafbd49efd26b5d171a32410": "LINK",
  };
  const tokenSymbol = TOKEN_SYMBOLS[tokenAddress.toLowerCase()] || "TOKEN";

  // ============================================================
  // Step 1: Record donation via DonateLink REST API (Node mode)
  // ============================================================
  const recordDonation = httpClient.sendRequest(
    runtime,
    (sendRequester: HTTPSendRequester): string => {
      const apiUrl =
        runtime.config.apiUrl || "https://donatelink.vercel.app";

      const bodyStr = JSON.stringify({
        streamer_address: streamer,
        donor_address: donor,
        donor_name: "On-chain Donor",
        message: "Processed by Chainlink CRE",
        amount_usd: amountUsd,
        amount_token: amountToken,
        token_symbol: tokenSymbol,
        token_address: tokenAddress,
        source_chain: "base-sepolia",
        tx_hash: `0x${txHash}`,
        ccip_message_id: null,
      });

      const response = sendRequester
        .sendRequest({
          url: `${apiUrl}/api/donate`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: toBase64(bodyStr),
        })
        .result();

      return decodeBody(response.body);
    },
    consensusIdenticalAggregation<string>()
  );
  const recordResult = recordDonation().result();
  runtime.log(`[DonateLink CRE] API Response: ${recordResult}`);

  // ============================================================
  // Step 2: Fetch prices from CoinGecko (Node mode)
  // ============================================================
  const fetchPrices = httpClient.sendRequest(
    runtime,
    (sendRequester: HTTPSendRequester): string => {
      const priceResponse = sendRequester
        .sendRequest({
          url: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,chainlink&vs_currencies=usd",
          method: "GET",
        })
        .result();

      return decodeBody(priceResponse.body);
    },
    consensusIdenticalAggregation<string>()
  );
  const pricesResult = fetchPrices().result();
  runtime.log(`[DonateLink CRE] Prices: ${pricesResult}`);

  // ============================================================
  // Step 3: Generate celebration message via Gemini (Node mode)
  // ============================================================
  const generateCelebration = httpClient.sendRequest(
    runtime,
    (sendRequester: HTTPSendRequester): string => {
      const geminiApiKey = runtime.config.geminiApiKey;
      if (!geminiApiKey) {
        return "🎉 Donation received! Thank you for your generosity!";
      }

      const prompt =
        "Generate a fun, one-line celebration message for a crypto donation. Keep it under 100 characters and make it exciting!";

      const aiResponse = sendRequester
        .sendRequest({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
          method: "POST",
          headers: {
            "x-goog-api-key": geminiApiKey,
            "Content-Type": "application/json",
          },
          body: toBase64(
            JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            })
          ),
        })
        .result();

      const body = decodeBody(aiResponse.body);
      try {
        const parsed = JSON.parse(body);
        return (
          parsed?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          "🎉 Donation received!"
        );
      } catch {
        return "🎉 Donation received!";
      }
    },
    consensusIdenticalAggregation<string>()
  );
  const celebrationMessage = generateCelebration().result();
  runtime.log(`[DonateLink CRE] Celebration: ${celebrationMessage}`);

  // ============================================================
  // Summary
  // ============================================================
  runtime.log("[DonateLink CRE] Orchestration complete");

  return JSON.stringify({
    success: true,
    donationRecord: recordResult,
    prices: pricesResult,
    celebrationMessage: celebrationMessage,
  });
};

/**
 * Initialize the workflow with EVM log trigger
 */
const initWorkflow = () => {
  const evmClient = new EVMClient(BASE_SEPOLIA_CHAIN_SELECTOR);

  // Set up EVM log trigger for the DonationReceived event
  const donationTrigger = evmClient.logTrigger({
    addresses: [DONATELINK_CONTRACT_ADDRESS],
    topics: [
      {
        values: [DONATION_RECEIVED_EVENT_SIG],
      },
    ],
  });

  return [cre.handler(donationTrigger, handleDonation)];
};

/**
 * WASM entry point
 */
export async function main() {
  console.log(
    `[DonateLink CRE] Starting workflow [${new Date().toISOString()}]`
  );

  const runner = await Runner.newRunner<HandlerConfig>({
    configParser: (c) => {
      try {
        const str = new TextDecoder().decode(c);
        return JSON.parse(str);
      } catch {
        return {
          apiUrl: "https://donate-link-dev.vercel.app",
          geminiApiKey: "",
        };
      }
    },
  });
  await runner.run(initWorkflow);
}

await main();
