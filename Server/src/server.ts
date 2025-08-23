import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectMongo } from "./db/connection";
import authRouter from "./routes/auth";
import { requireAuth } from "./middleware/auth";
import { appRouter } from "./routes/app";
import { apiRouter } from "./routes/api";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

// allow your Vite app to call the API
app.use(cors({ origin: "http://localhost:5173" }));

// Public auth endpoints (register/login + /me guarded inside router)
app.use("/app/auth", authRouter);

// Internal app API (protected)
app.use("/app", requireAuth, appRouter);

// Customer-facing API (unprotected for now)
app.use("/api", apiRouter);

async function start() {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`[node] Listening on http://localhost:${PORT}`);
    console.log(`[node] Customer API running on http://localhost:${PORT}/api/`);
    console.log(`[node] Internal API running on http://localhost:${PORT}/app/`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
