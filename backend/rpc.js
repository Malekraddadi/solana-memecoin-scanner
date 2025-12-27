import { Connection } from "@solana/web3.js";

const RPC_URL = process.env.SOLANA_RPC_URL;

if (!RPC_URL || !RPC_URL.startsWith("http")) {
  throw new Error("❌ SOLANA_RPC_URL must start with http or https");
}

export const connection = new Connection(RPC_URL, {
  commitment: "confirmed"
});
