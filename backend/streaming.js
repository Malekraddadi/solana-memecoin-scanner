import WebSocket from "ws";

const API_KEY = process.env.SOLANASTREAMING_API_KEY;

if (!API_KEY) {
  console.error("❌ SOLANASTREAMING_API_KEY missing");
  process.exit(1);
}

export function startStreaming(tokens) {
  function connect() {
    const ws = new WebSocket("wss://api.solanastreaming.com/", {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });

    ws.on("open", () => {
      console.log("✅ Connected to SolanaStreaming");

      ws.send(
        JSON.stringify({
          id: 1,
          method: "newPairSubscribe",
          params: { include_pumpfun: true },
        })
      );
    });

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg?.params?.result) {
          const pair = msg.params.result;

          tokens.push({
            name: pair.baseToken?.name || "Unknown",
            symbol: pair.baseToken?.symbol || "",
            address: pair.baseToken?.address,
            source: pair.source,
            ts: Date.now(),
          });

          console.log("🆕 New token:", pair.baseToken?.symbol);
        }
      } catch (e) {}
    });

    ws.on("close", () => {
      console.warn("⚠️ WS closed — reconnecting in 5s");
      setTimeout(connect, 5000);
    });

    ws.on("error", (err) => {
      console.error("WS error:", err.message);
    });
  }

  connect();
}
