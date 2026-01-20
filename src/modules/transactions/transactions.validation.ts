import * as z from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  description: z.string().max(255).optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  accountId: z.uuid({ message: "Invalid account ID" }),
  categoryId: z.uuid({ message: "Invalid category ID" }),
});

export const updateTransactionSchema = transactionSchema.partial();

export type CreateTransactionInput = z.infer<typeof transactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
