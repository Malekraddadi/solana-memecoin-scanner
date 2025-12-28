import express from "express";
import { startStreaming } from "./streaming.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("🧠 Solana Memecoin Scanner");
});

app.listen(PORT, () => {
  console.log(`🚀 Scanner running on port ${PORT}`);
});

startStreaming();
