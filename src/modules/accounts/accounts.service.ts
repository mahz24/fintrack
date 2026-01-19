import prisma from "../../lib/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { verifyUserExists } from "../auth/auth.service.js";
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from "./accounts.validation.js";

export const verifyAccountExists = async (
  accountId: string,
) => {
  const account = await prisma.account.findFirst({
    where: { id: accountId},
  });

  if (!account) {
    throw new AppError("Account not found", 404);
  }
};

export const getAccounts = async (userId: string) => {
  await verifyUserExists(userId);

  return prisma.account.findMany({
    where: { userId },
    include: { user: true },
  });
};

export const getAccountById = async (accountId: string, userId: string) => {
  await verifyUserExists(userId);
  await verifyAccountExists(accountId);

  return prisma.account.findFirst({
    where: { id: accountId, userId },
    include: { user: true },
  });
};

export const createAccount = async (
  userId: string,
  data: CreateAccountInput,
) => {
  await verifyUserExists(userId);

  return prisma.account.create({
    data: {
      ...data,
      userId,
    },
    include: { user: true },
  });
};

export const updateAccount = async (
  accountId: string,
  userId: string,
  data: UpdateAccountInput,
) => {
  await verifyUserExists(userId);
  await verifyAccountExists(accountId);

  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined),
  );

  return prisma.account.update({
    where: { id: accountId, userId },
    data: cleanedData,
    include: { user: true },
  });
};

export const deleteAccount = async (accountId: string, userId: string) => {
  await verifyUserExists(userId);
  await verifyAccountExists(accountId);

  return prisma.account.delete({
    where: { id: accountId, userId },
  });
};
