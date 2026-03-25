import "./config/loadEnv";
import { createApp } from "./app";
import { connectDB } from "./db/mongoose";
import { seedToursIfEmpty } from "./seed/seedTours";

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  await connectDB();
  await seedToursIfEmpty();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Wineroad API listening on http://localhost:${PORT}`);
    console.log(`Tours: GET http://localhost:${PORT}/tours`);
    console.log(`Admin ping: GET http://localhost:${PORT}/admin/ping (should return {"ok":true,...})`);
    console.log(`Admin login: POST http://localhost:${PORT}/admin/login`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
