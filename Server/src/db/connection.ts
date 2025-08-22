import mongoose from "mongoose";

export async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DBNAME || undefined;
  if (!uri) throw new Error("MONGODB_URI is not set in .env");

  const c = mongoose.connection;

  c.on("connecting", () => console.log("[mongo] connecting…"));
  c.on("connected", () => console.log("[mongo] connected"));
  c.once("open", () => console.log("[mongo] connection open"));
  c.on("disconnected", () => console.log("[mongo] disconnected"));
  c.on("reconnected", () => console.log("[mongo] reconnected"));
  c.on("error", (e) => console.error("[mongo] error:", e));

  mongoose.set("debug", process.env.MONGO_DEBUG === "1");

  try {
    const u = new URL(uri);
    console.log(
      `[mongo] Target ${u.protocol}//${u.host}/${dbName ?? "(default)"}`
    );
  } catch {
    console.log("[mongo] connecting…");
  }

  if (c.readyState !== 1) {
    await mongoose.connect(uri, {
      dbName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  return mongoose;
}
