import express from "express";

export const appRouter = express.Router();

// Health Check
appRouter.get("/health", (_req, res) => res.json({ ok: true }));
