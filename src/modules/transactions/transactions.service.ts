import prisma from "../../lib/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { verifyUserExists } from "../auth/auth.service.js";
import type { CreateTransactionInput, UpdateTransactionInput } from "./transactions.validation.js";

type TransactionFilters = {
  type?: "INCOME" | "EXPENSE" | "TRANSFER";
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
};

export const getTransactions = async (
  userId: string,
  filters?: TransactionFilters,
) => {
  await verifyUserExists(userId);
  // Implementation to fetch transactions from the database based on userId and filters
  return prisma.transaction.findMany({
    where: {
      account: { userId },
      ...(filters?.type && { type: filters.type }),
      ...(filters?.accountId && { accountId: filters.accountId }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...((filters?.startDate || filters?.endDate) && {
        date: {
          ...(filters.startDate && { gte: new Date(filters.startDate) }),
          ...(filters.endDate && { lte: new Date(filters.endDate) }),
        },
      }),
    },
    include: { account: true, category: true },
    orderBy: { date: "desc" },
  });
};

export const getTransactionById = async (userId: string, transactionId: string) => {
  await verifyUserExists(userId);
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      account: { userId },
    },
    include: { account: true, category: true },
  });
  return transaction;
}

export const createTransaction = async (
  userId: string,
  data: CreateTransactionInput,
) => {
  await verifyUserExists(userId);

  const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;

  await prisma.account.update({
    where: { id: data.accountId, userId },
    data: { balance: { increment: balanceChange } },
  });

  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      type: data.type,
      date: new Date(data.date),
      description: data.description ?? null,
      account: { connect: { id: data.accountId } },
      category: { connect: { id: data.categoryId } },
    },
    include: { account: true, category: true },
  });
  return transaction;
}

export const updateTransaction = async (
  userId: string,
  transactionId: string,
  data: UpdateTransactionInput,
) => {
  await verifyUserExists(userId);
  const existingTransaction = await getTransactionById(userId, transactionId);
  if (!existingTransaction) {
    throw new AppError("Transaction not found", 404);
  }

  let balanceChange = 0;

  if (data.amount !== undefined || data.type !== undefined) {
    const newAmount = data.amount ?? existingTransaction.amount;
    const newType = data.type ?? existingTransaction.type;

    const oldBalanceChange = existingTransaction.type === "INCOME"
      ? existingTransaction.amount
      : -existingTransaction.amount;

    const newBalanceChange = newType === "INCOME" ? newAmount : -newAmount;

    balanceChange = newBalanceChange - oldBalanceChange;
  }

  if (balanceChange !== 0) {
    await prisma.account.update({
      where: { id: existingTransaction.accountId, userId },
      data: { balance: { increment: balanceChange } },
    });
  }

  let updateData: Record<string, unknown> = {};
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.categoryId !== undefined) {
    updateData.category = { connect: { id: data.categoryId } };
  }

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      ...updateData,
      date: data.date ? new Date(data.date) : existingTransaction.date,
    },
    include: { account: true, category: true },
  });
  return updatedTransaction;
}

export const deleteTransaction = async (userId: string, transactionId: string) => {
  await verifyUserExists(userId);
  const existingTransaction = await getTransactionById(userId, transactionId);
  if (!existingTransaction) {
    throw new AppError("Transaction not found", 404);
  }

  const balanceChange = existingTransaction.type === "INCOME"
    ? -existingTransaction.amount
    : existingTransaction.amount;

  await prisma.account.update({
    where: { id: existingTransaction.accountId, userId },
    data: { balance: { increment: balanceChange } },
  });

  await prisma.transaction.delete({
    where: { id: transactionId },
  });
}
