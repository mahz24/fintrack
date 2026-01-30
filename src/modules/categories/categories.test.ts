import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import prisma from "../../lib/prisma.js";

describe("Categories Module", () => {
  let accessToken: string;

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@test.com",
      password: "12345678",
    });

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/categories", () => {
    it("debería retornar categorías", async () => {
      const res = await request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/categories", () => {
    it("debería crear una categoría", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Gimnasio",
          type: "EXPENSE",
          icon: "🏋️",
          color: "#FF5733",
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Gimnasio");
      expect(res.body.type).toBe("EXPENSE");
    });

    it("debería fallar con tipo inválido", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Test",
          type: "INVALID",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("debería actualizar una categoría", async () => {
      const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Original",
          type: "EXPENSE",
        });

      const categoryId = createRes.body.id;

      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Actualizada",
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Actualizada");
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("debería eliminar una categoría", async () => {
      const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "A Eliminar",
          type: "INCOME",
        });

      const categoryId = createRes.body.id;

      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
    });
  });
});
