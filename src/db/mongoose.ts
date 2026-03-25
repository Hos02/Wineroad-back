import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI?.trim();

  if (!uri) {
    throw new Error("MONGO_URI is required (MongoDB). Set it in Wineroad-back/.env");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    const { host, name } = mongoose.connection;
    console.log(`[mongodb] Connected (${host ?? "cluster"}, db: ${name ?? "default"})`);
  } catch (err) {
    console.error("[mongodb] Connection failed:", err);
    throw err;
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  console.log("[mongodb] Disconnected");
}
