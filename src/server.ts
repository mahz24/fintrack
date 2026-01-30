import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./lib/prisma.js";

async function main() {
  console.log("Connecting to database...");

  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }

  const port = Number(process.env.PORT) || env.PORT;

  app.listen(port, "0.0.0.0", () => {
    // Agregar "0.0.0.0"
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
