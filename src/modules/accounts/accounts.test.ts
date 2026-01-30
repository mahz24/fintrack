import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import prisma from "../../lib/prisma.js";

describe("Accounts Module", () => {
  let accessToken: string;
  let userId: string;

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuario y obtener token
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@test.com",
      password: "12345678",
    });

    accessToken = res.body.accessToken;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/accounts", () => {
    it("debería retornar lista vacía inicialmente", async () => {
      const res = await request(app)
        .get("/api/accounts")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("debería retornar cuentas del usuario", async () => {
      // Crear cuenta primero
      await request(app)
        .post("/api/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Banco Test",
          type: "SAVINGS",
          balance: 1000000,
          currency: "COP",
        });

      const res = await request(app)
        .get("/api/accounts")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("Banco Test");
    });

    it("debería fallar sin token", async () => {
      const res = await request(app).get("/api/accounts");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/accounts", () => {
    it("debería crear una cuenta", async () => {
      const res = await request(app)
        .post("/api/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Banco Davivienda",
          type: "SAVINGS",
          balance: 500000,
          currency: "COP",
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Banco Davivienda");
      expect(res.body.type).toBe("SAVINGS");
      expect(res.body.balance).toBe(500000);
    });

    it("debería fallar con tipo inválido", async () => {
      const res = await request(app)
        .post("/api/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Cuenta Test",
          type: "INVALID_TYPE",
          balance: 1000,
          currency: "COP",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/accounts/:id", () => {
    it("debería obtener una cuenta por ID", async () => {
      const createRes = await request(app)
        .post("/api/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Mi Cuenta",
          type: "CHECKING",
          balance: 100000,
          currency: "COP",
        });

      const accountId = createRes.body.id;

      const res = await request(app)
        .get(`/api/accounts/${accountId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Mi Cuenta");
    });
  });

  describe("PUT /api/accounts/:id", () => {
    it("debería actualizar una cuenta", async () => {
      const createRes = await request(app)
        .post("/api/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Cuenta Original",
          type: "SAVINGS",
          balance: 100000,
          currency: "COP",
        });

      const accountId = createRes.body.id;

      const res = await request(app)
        .put(`/api/accounts/${accountId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Cuenta Actualizada",
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Cuenta Actualizada");
    });
  });

  describe("DELETE /api/accounts/:id", () => {
    it("debería eliminar una cuenta", async () => {
      const createRes = await request(app)
        .post("/api/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Cuenta a Eliminar",
          type: "CASH",
          balance: 50000,
          currency: "COP",
        });

      const accountId = createRes.body.id;

      const res = await request(app)
        .delete(`/api/accounts/${accountId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Account deleted successfully");
    });
  });
});
