import WebSocket from "ws";
import { state } from "./state.js";

const WS_URL = "wss://api.solanastreaming.com/";
const API_KEY = process.env.SOLANASTREAMING_API_KEY;

export function startStream() {
  if (!API_KEY) {
    console.error("❌ SOLANASTREAMING_API_KEY missing");
    return;
  }

  const ws = new WebSocket(WS_URL, {
    headers: {
      "X-API-KEY": API_KEY
    }
  });

  ws.on("open", () => {
    console.log("✅ Connected to SolanaStreaming");

    ws.send(JSON.stringify({
      id: 1,
      method: "newPairSubscribe",
      params: {
        include_pumpfun: true
      }
    }));
  });

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      // ignore non-events
      if (!data.params || !data.params.pair) return;

      const p = data.params.pair;

      const token = {
        timestamp: Date.now(),
        source: p.sourceExchange,
        name: p.baseToken?.info?.name || "Unknown",
        symbol: p.baseToken?.info?.symbol || "???",
        mint: p.baseToken?.account,
        amm: p.ammAccount
      };

      state.tokens.unshift(token);
      state.tokens = state.tokens.slice(0, 200);

      console.log("🆕 New token:", token.symbol);
    } catch (e) {
      // silent fail
    }
  });

  ws.on("close", () => {
    console.log("⚠️ WS closed — reconnecting in 5s");
    setTimeout(startStream, 5000);
  });

  ws.on("error", (err) => {
    console.error("WS error:", err.message);
  });
}
