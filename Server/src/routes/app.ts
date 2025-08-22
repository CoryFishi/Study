import express from "express";
import authRouter from "./auth";

export const appRouter = express.Router();

// Auth Router
appRouter.use("/auth", authRouter);

// Health Check
appRouter.get("/health", (_req, res) => res.json({ ok: true }));
