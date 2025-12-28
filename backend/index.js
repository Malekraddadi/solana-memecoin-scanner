import express from "express";
import { startStreaming } from "./streaming.js";

const app = express();
const PORT = process.env.PORT || 8080;

// in-memory store
const tokens = [];

// expose tokens to streaming module
startStreaming(tokens);

// API
app.get("/api/tokens", (req, res) => {
  res.json(tokens.slice(-50).reverse());
});

// frontend
app.use(express.static("frontend"));
setInterval(() => {
  console.log("🫀 heartbeat");
}, 15000);
app.listen(PORT, () => {
  console.log(`🚀 Scanner running on port ${PORT}`);
});

// KEEP PROCESS ALIVE (important for Railway)
setInterval(() => {}, 1 << 30);
