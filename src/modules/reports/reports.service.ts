import prisma from "../../lib/prisma.js";
import { verifyUserExists } from "../auth/auth.service.js";

interface SummaryResponse {
  totalBalance: number;
  monthIncome: number;
  monthExpenses: number;
  monthSavings: number;
}

interface ExpensesByCategoryResponse {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
}

interface MonthlyTrendResponse {
  month: string;
  income: number;
  expenses: number;
}

export const getSummary = async (userId: string): Promise<SummaryResponse> => {
  await verifyUserExists(userId);

  const currentDate = new Date();

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const [accounts, incomesTransactions, expensesTransactions] =
    await Promise.all([
      prisma.account.aggregate({
        where: { userId },
        _sum: { balance: true },
      }),
      prisma.transaction.aggregate({
        where: {
          account: { userId },
          type: "INCOME",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          account: { userId },
          type: "EXPENSE",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

  const totalBalance = accounts._sum.balance || 0;
  const monthIncome = incomesTransactions._sum.amount || 0;
  const monthExpenses = expensesTransactions._sum.amount || 0;

  return {
    totalBalance,
    monthIncome,
    monthExpenses,
    monthSavings: monthIncome - monthExpenses,
  };
};

export const getByCategory = async (
  userId: string,
  startDate?: string,
  endDate?: string,
): Promise<ExpensesByCategoryResponse[]> => {
  await verifyUserExists(userId);

  const currentDate = new Date();

  const fromDate =
    startDate !== null && startDate !== undefined
      ? new Date(startDate)
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const toDate =
    endDate !== null && endDate !== undefined
      ? new Date(endDate)
      : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const byCategory = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      account: { userId },
      type: "EXPENSE",
      date: { gte: fromDate, lte: toDate },
    },
    _sum: { amount: true },
  });

  const totalExpenses = byCategory.reduce(
    (sum, item) => sum + (item._sum.amount || 0),
    0,
  );

  const response = await Promise.all(
    byCategory.map(async (item) => {
      const category = await prisma.category.findFirst({
        where: { id: item.categoryId },
      });

      const total = item._sum.amount || 0;
      const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;

      return {
        categoryId: item.categoryId,
        categoryName: category?.name ?? "",
        total,
        percentage: Math.round(percentage * 100) / 100,
      };
    }),
  );

  return response;
};

export const getMonthlyTrend = async (
  userId: string,
): Promise<MonthlyTrendResponse[]> => {
  await verifyUserExists(userId);

  let months = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
    });
  }

  const response = await Promise.all(
    months.map(async (item) => {
      const month = `${item.year}-${String(item.month + 1).padStart(2, "0")}`;

      const startDate = new Date(item.year, item.month, 1);
      const endDate = new Date(item.year, item.month + 1, 0);

      const [incomes, expense] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            account: { userId },
            type: "INCOME",
            date: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            account: { userId },
            type: "EXPENSE",
            date: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        }),
      ]);

      const income = incomes._sum.amount || 0;
      const expenses = expense._sum.amount || 0;

      return {
        month,
        income,
        expenses,
      };
    }),
  );

  return response;
};
