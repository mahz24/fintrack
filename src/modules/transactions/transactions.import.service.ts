import { unlink } from "node:fs/promises";
import prisma from "../../lib/prisma.js";
import { verifyUserExists } from "../auth/auth.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import { parseCSV } from "../../shared/utils/csvParser.js";
import type { TYPE_TRANSACTION } from "../../generated/prisma/index.js";

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export const importTransactionsFromCSV = async (
  userId: string,
  accountId: string,
  filePath: string,
): Promise<ImportResult> => {
  await verifyUserExists(userId);

  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) {
    await unlink(filePath);
    throw new AppError("Account not found", 404);
  }

  const rows = await parseCSV(filePath);

  const results: ImportResult = {
    total: rows.length,
    success: 0,
    failed: 0,
    errors: [],
  };

  const batchSize = 100;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);

    for (const row of batch) {
      try {
        const amount = parseFloat(row.amount);
        if (isNaN(amount) || amount <= 0) {
          throw new Error(`Invalid amount: ${row.amount}`);
        }

        if (!["INCOME", "EXPENSE", "TRANSFER"].includes(row.type)) {
          throw new Error(`Invalid type: ${row.type}`);
        }

        const date = new Date(row.date);

        if (isNaN(date.getDate())) {
          throw new Error(`Invalid date: ${row.date}`);
        }

        await prisma.transaction.create({
          data: {
            amount,
            type: row.type as TYPE_TRANSACTION,
            description: row.description || null,
            date,
            accountId,
            categoryId: row.category,
          },
        });

        const balanceChange = row.type === "INCOME" ? amount : -amount;
        await prisma.account.update({
          where: { id: accountId },
          data: { balance: { increment: balanceChange } },
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Row ${i + batch.indexOf(row)}: ${(error as Error).message}`,
        );
      }
    }
  }
  await unlink(filePath);

  return results;
};
