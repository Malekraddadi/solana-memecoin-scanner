import WebSocket from "ws";

const API_KEY = process.env.SOLANASTREAMING_API_KEY;
const WS_URL = "wss://api.solanastreaming.com/";

if (!API_KEY) {
  console.error("❌ SOLANASTREAMING_API_KEY missing");
  process.exit(1);
}

let ws;
let heartbeatInterval;

export function startStreaming() {
  connect();
}

function connect() {
  ws = new WebSocket(WS_URL, {
    headers: {
      "X-API-KEY": API_KEY
    }
  });

  ws.on("open", () => {
    console.log("✅ Connected to SolanaStreaming");

    const payload = {
      id: 1,
      method: "newPairSubscribe",
      params: {
        include_pumpfun: true
      }
    };

    ws.send(JSON.stringify(payload));

    heartbeatInterval = setInterval(() => {
      console.log("🫀 heartbeat");
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ method: "ping" }));
    }, 15_000);
  });

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (!msg?.pair?.baseToken) return;

      const name = msg.pair.baseToken.info?.metadata?.name || "Unknown";
      const symbol = msg.pair.baseToken.info?.metadata?.symbol || "???";

      console.log(`🆕 New token detected: ${name} (${symbol})`);
    } catch (e) {
      console.error("⚠️ Failed to parse message");
    }
  });

  ws.on("close", (code, reason) => {
    console.warn(`⚠️ WS closed (code: ${code}) — reconnecting in 10s`);
    cleanup();
    setTimeout(connect, 10_000); // give more time before reconnect
  });

  ws.on("error", (err) => {
    console.error("❌ WS error:", err.message);
    // Do not exit, just reconnect
  });
}

function cleanup() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (ws) ws.removeAllListeners();
}
