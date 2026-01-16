import prisma from "../src/lib/prisma.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.info("Seeding database...");

  await prisma.category.createMany({
    data: [
      { name: "Salario", type: "INCOME", userId: null },
      { name: "Freelance", type: "INCOME", userId: null },
      { name: "Inversiones", type: "INCOME", userId: null },
      { name: "Otros ingresos", type: "INCOME", userId: null },
      { name: "Alimentación", type: "EXPENSE", userId: null },
      { name: "Transporte", type: "EXPENSE", userId: null },
      { name: "Vivienda", type: "EXPENSE", userId: null },
      { name: "Entretenimiento", type: "EXPENSE", userId: null },
      { name: "Salud", type: "EXPENSE", userId: null },
      { name: "Educación", type: "EXPENSE", userId: null },
      { name: "Otros gastos", type: "EXPENSE", userId: null },
    ],
  });
}

main()
  .then(async () => {
    console.info("Seeding completed.");
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
