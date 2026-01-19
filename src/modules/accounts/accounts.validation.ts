import * as z from "zod";

export const accountSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["SAVINGS", "CHECKING", "CREDIT", "CASH"]),
  balance: z.number().min(0),
  currency: z.string().default("COP"),
});

export const updateAccountSchema = accountSchema.partial();

export type CreateAccountInput = z.infer<typeof accountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
