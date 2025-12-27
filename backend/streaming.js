import WebSocket from "ws";
import { TOKENS } from "./state.js";
import { getHolderSnapshot } from "./holders.js";

export function startStreaming() {
  const ws = new WebSocket("wss://api.solanastreaming.com/", {
    headers: {
      "X-API-KEY": process.env.SOLANA_STREAMING_KEY
    }
  });

  ws.on("open", () => {
    ws.send(
      JSON.stringify({
        id: 1,
        method: "newPairSubscribe",
        params: { include_pumpfun: true }
      })
    );
  });

  ws.on("message", async msg => {
    const data = JSON.parse(msg.toString());

    if (!data?.result?.baseMint) return;

    const mint = data.result.baseMint;

    if (TOKENS.find(t => t.mint === mint)) return;

    const holders = await getHolderSnapshot(mint);

    const score =
      (holders?.holders || 0) +
      (holders?.top10Share < 0.4 ? 30 : 0);

    TOKENS.unshift({
      mint,
      name: data.result.baseSymbol,
      dex: data.result.dex,
      holders,
      score,
      time: Date.now()
    });

    TOKENS.splice(50); // keep last 50
  });

  ws.on("error", console.error);
}
