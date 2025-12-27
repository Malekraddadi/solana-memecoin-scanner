import express from "express";
import { startStreaming } from "./streaming.js";
import { TOKENS } from "./state.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("frontend"));

app.get("/api/tokens", (_, res) => {
  res.json(TOKENS);
});

app.listen(PORT, () => {
  console.log("🚀 Scanner running on port", PORT);
  startStreaming();
});
