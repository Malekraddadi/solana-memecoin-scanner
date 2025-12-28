import WebSocket from "ws";

// Singleton WebSocket instance to avoid redeclarations
let ws;

export function initStreaming() {
  if (ws) return; // Already initialized

  const STREAM_URL = "wss://api.mainnet-beta.solana.com"; // Replace with actual Solana streaming URL
  ws = new WebSocket(STREAM_URL);

  ws.on("open", () => {
    console.log("✅ Connected to SolanaStreaming");
    // TODO: subscribe to accounts or memecoin transactions
  });

  ws.on("message", (data) => {
    console.log("📡 Incoming data:", data.toString());
    // TODO: parse and analyze memecoin events
  });

  ws.on("close", (code, reason) => {
    console.log(`⚠️ WS closed (code: ${code}) — reconnecting in 10s`);
    ws = null;
    setTimeout(initStreaming, 10000);
  });

  ws.on("error", (err) => {
    console.error("❌ WebSocket error:", err);
  });

  // Heartbeat to prevent Railway container from being considered idle
  setInterval(() => {
    console.log("🫀 heartbeat");
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 15000);
}
