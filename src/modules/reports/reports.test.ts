import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import prisma from "../../lib/prisma.js";

describe("Reports Module", () => {
  let accessToken: string;
  let accountId: string;
  let categoryId: string;

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // Setup: usuario, cuenta y categoría
    const authRes = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@test.com",
      password: "12345678",
    });

    accessToken = authRes.body.accessToken;

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

  describe("GET /api/reports/summary", () => {
    it("debería retornar resumen financiero", async () => {
      const res = await request(app)
        .get("/api/reports/summary")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalBalance");
      expect(res.body).toHaveProperty("monthIncome");
      expect(res.body).toHaveProperty("monthExpenses");
      expect(res.body).toHaveProperty("monthSavings");
    });

    it("debería calcular correctamente el balance", async () => {
      const res = await request(app)
        .get("/api/reports/summary")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.body.totalBalance).toBe(1000000);
    });
  });

  describe("GET /api/reports/by-category", () => {
    it("debería retornar gastos por categoría", async () => {
      // Crear transacción
      await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          amount: 50000,
          type: "EXPENSE",
          description: "Test",
          date: new Date().toISOString().split("T")[0],
          accountId,
          categoryId,
        });

      const res = await request(app)
        .get("/api/reports/by-category")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("categoryId");
      expect(res.body[0]).toHaveProperty("categoryName");
      expect(res.body[0]).toHaveProperty("total");
      expect(res.body[0]).toHaveProperty("percentage");
    });
  });

  describe("GET /api/reports/monthly-trend", () => {
    it("debería retornar tendencia de 12 meses", async () => {
      const res = await request(app)
        .get("/api/reports/monthly-trend")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(12);
      expect(res.body[0]).toHaveProperty("month");
      expect(res.body[0]).toHaveProperty("income");
      expect(res.body[0]).toHaveProperty("expenses");
    });
  });
});
