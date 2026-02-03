import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./lib/prisma.js";

async function main() {
  console.log("Connecting to database...");
  await prisma.$connect();
  console.log("Database connected!");

  const port = Number(process.env.PORT) || env.PORT;

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start:", error);
  process.exit(1);
});
