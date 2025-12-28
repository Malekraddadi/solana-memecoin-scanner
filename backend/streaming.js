import WebSocket from "ws";

let ws;
let heartbeatInterval;

// Initialize streaming connection
export function initStreaming() {
  connectWS();
}

function connectWS() {
  ws = new WebSocket("wss://solana-streaming.example.com"); // Replace with real Solana WS endpoint

  ws.on("open", () => {
    console.log("✅ Connected to SolanaStreaming");
    startHeartbeat();
  });

  ws.on("message", (data) => {
    handleMessage(JSON.parse(data));
  });

  ws.on("close", (code) => {
    console.warn(`⚠️ WS closed (code: ${code}) — reconnecting in 10s`);
    stopHeartbeat();
    setTimeout(connectWS, 10000);
  });

  ws.on("error", (err) => {
    console.error("❌ WebSocket Error:", err.message);
    ws.close();
  });
}

function handleMessage(message) {
  // Example: handle Solana memecoin events
  console.log("🪙 Event:", message);
}

function startHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "heartbeat", timestamp: new Date() }));
      console.log("🫀 heartbeat");
    }
  }, 15000); // every 15s
}

function stopHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
}
