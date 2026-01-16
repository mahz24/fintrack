import prisma from "../../lib/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../shared/utils/jwt.js";
import { comparePassword, hashPassword } from "../../shared/utils/password.js";
import type { LoginInput, RefreshInput, RegisterInput } from "./auth.validation.js";

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const hashedPassword = await hashPassword(data.password);
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });
  const accessToken = generateAccessToken(newUser.id);
  const refreshToken = generateRefreshToken(newUser.id);

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    accessToken,
    refreshToken,
  };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
}

export const refresh = async (data: RefreshInput) => {
  const verifiedToken = verifyToken(data.refreshToken);

  if (!verifiedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: verifiedToken.id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
  };
}
