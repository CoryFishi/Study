import express from "express";

export const apiRouter = express.Router();

// Shared health
apiRouter.get("/health", (_req, res) => res.json({ ok: true }));

// Example sold endpoint (no auth)
apiRouter.post("/generate", (req, res) => {
  const { text = "", count = 10 } = req.body || {};
  const n = Math.min(Number(count) || 10, 50);
  const cards = Array.from({ length: n }, (_, i) => ({
    type: "qa",
    front: `Q${i + 1}: ${text.slice(0, 60)}?`,
    back: "A: Key takeaway from the passage.",
    tags: [],
  }));
  res.json({ cards });
});

apiRouter.get("/health", (_req, res) => res.json({ ok: true }));
