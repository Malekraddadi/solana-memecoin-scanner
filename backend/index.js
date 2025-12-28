import express from "express";
import { initStreaming } from "./streaming.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Health check endpoint
app.get("/status", (req, res) => {
  res.json({ status: "Scanner running", timestamp: new Date() });
});

// Start WebSocket streaming
initStreaming();

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Scanner running on port ${PORT}`);
});
