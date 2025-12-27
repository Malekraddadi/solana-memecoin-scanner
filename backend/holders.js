import { connection } from "./rpc.js";

export async function getHolderSnapshot(mint) {
  try {
    const accounts = await connection.getParsedProgramAccounts(
      new (await import("@solana/web3.js")).PublicKey(
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      ),
      {
        filters: [
          { dataSize: 165 },
          {
            memcmp: {
              offset: 0,
              bytes: mint
            }
          }
        ]
      }
    );

    const balances = accounts.map(
      a => a.account.data.parsed.info.tokenAmount.uiAmount || 0
    );

    balances.sort((a, b) => b - a);

    return {
      holders: balances.length,
      top10Share:
        balances.slice(0, 10).reduce((a, b) => a + b, 0) /
        balances.reduce((a, b) => a + b, 1)
    };
  } catch {
    return null;
  }
}
