import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import prisma from "../../lib/prisma.js";

describe("Transactions Module", () => {
  let accessToken: string;
  let accountId: string;
  let categoryId: string;

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuario
    const authRes = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@test.com",
      password: "12345678",
    });

    accessToken = authRes.body.accessToken;

    // Crear cuenta
    const accountRes = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Account",
        type: "SAVINGS",
        balance: 1000000,
        currency: "COP",
      });

    accountId = accountRes.body.id;

    // Crear categoría
    const categoryRes = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Category",
        type: "EXPENSE",
      });

    categoryId = categoryRes.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/transactions", () => {
    it("debería retornar lista vacía inicialmente", async () => {
      const res = await request(app)
        .get("/api/transactions")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("POST /api/transactions", () => {
    it("debería crear una transacción de gasto", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          amount: 50000,
          type: "EXPENSE",
          description: "Almuerzo",
          date: "2026-01-15",
          accountId,
          categoryId,
        });

      expect(res.status).toBe(201);
      expect(res.body.amount).toBe(50000);
      expect(res.body.type).toBe("EXPENSE");
    });

    it("debería actualizar el balance de la cuenta al crear gasto", async () => {
      await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          amount: 100000,
          type: "EXPENSE",
          description: "Compra",
          date: "2026-01-15",
          accountId,
          categoryId,
        });

      const accountRes = await request(app)
        .get(`/api/accounts/${accountId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(accountRes.body.balance).toBe(900000); // 1000000 - 100000
    });

    it("debería actualizar el balance de la cuenta al crear ingreso", async () => {
      // Crear categoría de ingreso
      const incomeCatRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Salario",
          type: "INCOME",
        });

      await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          amount: 500000,
          type: "INCOME",
          description: "Pago",
          date: "2026-01-15",
          accountId,
          categoryId: incomeCatRes.body.id,
        });

      const accountRes = await request(app)
        .get(`/api/accounts/${accountId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(accountRes.body.balance).toBe(1500000); // 1000000 + 500000
    });
  });

  describe("DELETE /api/transactions/:id", () => {
    it("debería eliminar y revertir el balance", async () => {
      // Crear transacción
      const createRes = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          amount: 200000,
          type: "EXPENSE",
          description: "Test",
          date: "2026-01-15",
          accountId,
          categoryId,
        });

      const transactionId = createRes.body.id;

      // Verificar balance después de gasto
      let accountRes = await request(app)
        .get(`/api/accounts/${accountId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(accountRes.body.balance).toBe(800000);

      // Eliminar transacción
      await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      // Verificar balance revertido
      accountRes = await request(app)
        .get(`/api/accounts/${accountId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(accountRes.body.balance).toBe(1000000);
    });
  });
});
