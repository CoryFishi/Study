import dotenv from "dotenv";
import express from "express";
import { apiRouter } from "./routes/api";
import { appRouter } from "./routes/app";
import { connectMongo } from "./db/connection";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
app.use(cors());
app.use(express.json());

// Customer-facing API
app.use("/api", apiRouter);

// Internal app API
app.use("/app", appRouter);

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
