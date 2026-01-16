// src/modules/auth/auth.test.ts
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import prisma from "../../lib/prisma.js";

describe("Auth Module", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("debería registrar un usuario nuevo", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Marco",
        email: "marco@test.com",
        password: "12345678",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.body.user.email).toBe("marco@test.com");
    });

    it("debería fallar si el email ya existe", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Marco",
        email: "marco@test.com",
        password: "12345678",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Otro",
        email: "marco@test.com",
        password: "87654321",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        name: "Marco",
        email: "marco@test.com",
        password: "12345678",
      });
    });

    it("debería hacer login correctamente", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "marco@test.com",
        password: "12345678",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("debería fallar con credenciales incorrectas", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "marco@test.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("debería renovar el token", async () => {
      const registerRes = await request(app).post("/api/auth/register").send({
        name: "Marco",
        email: "marco@test.com",
        password: "12345678",
      });

      const { refreshToken } = registerRes.body;

      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    });
  });
});
