import type { NextFunction, Request, Response } from "express";
import { createAccount, deleteAccount, getAccountById, getAccounts, updateAccount } from "./accounts.service.js";


export const getAccountsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const accounts = await getAccounts(userId);
    res.status(200).json(accounts);
  } catch (error) {
    next(error);
  }
};

export const getAccountByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const accountId = req.params.id;
    const account = await getAccountById(accountId!.toString(), userId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

export const createAccountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const accountData = req.body;
    const newAccount = await createAccount(userId, accountData);
    res.status(201).json(newAccount);
  } catch (error) {
    next(error);
  }
};

export const updateAccountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const accountId = req.params.id;
    const accountData = req.body;
    const updatedAccount = await updateAccount(accountId!.toString(), userId, accountData);
    res.status(200).json(updatedAccount);
  } catch (error) {
    next(error);
  }
};

export const deleteAccountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const accountId = req.params.id;
    await deleteAccount(accountId!.toString(), userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};