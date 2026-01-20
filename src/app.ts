import express from "express";
import cors from "cors";
import helmet from "helmet";
import { handleError } from "./shared/middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.route.js";
import accountsRoutes from "./modules/accounts/accounts.routes.js";
import categoriesRoutes from "./modules/categories/categories.routes.js";
import transactionsRoutes from "./modules/transactions/transaction.route.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/categories", categoriesRoutes)
app.use("/api/transactions", transactionsRoutes);

app.use(handleError);

export default app;
