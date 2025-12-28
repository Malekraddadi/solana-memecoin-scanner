import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { startStream } from "./stream.js";
import { state } from "./state.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// start websocket
startStream();

// serve dashboard
app.use(express.static(path.join(__dirname, "../public")));

// api endpoint
app.get("/api/tokens", (req, res) => {
  res.json(state.tokens);
});

// health
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Scanner running on port ${PORT}`);
});
