import type { NextFunction, Request, Response } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "./transactions.service.js";
import { importTransactionsFromCSV } from "./transactions.import.service.js";

export const getTransactionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const filters = req.query;

    const transactions = await getTransactions(userId, filters);

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

export const getTransactionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const transactionId = req.params.id;

    const transaction = await getTransactionById(
      userId,
      transactionId!.toString(),
    );

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const data = req.body;

    const newTransaction = await createTransaction(userId, data);

    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const transactionId = req.params.id;
    const data = req.body;

    const updatedTransaction = await updateTransaction(
      userId,
      transactionId!.toString(),
      data,
    );

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const transactionId = req.params.id;

    await deleteTransaction(userId, transactionId!.toString());

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const importTransactionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const accountId = req.body.accountId;

    if (!req.file) {
      return res.status(400).json({
        message: "CSV file is required",
      });
    }

    if (!accountId) {
      return res.status(400).json({
        message: "Account id is required",
      });
    }

    const result = await importTransactionsFromCSV(
      userId,
      accountId,
      req.file.path,
    );

    res.status(200).json({
      message: "Import completed",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
