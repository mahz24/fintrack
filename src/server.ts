import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./lib/prisma.js";

async function main() {
  await prisma.$connect();

  const port = process.env.PORT || env.PORT; // Railway usa process.env.PORT

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
