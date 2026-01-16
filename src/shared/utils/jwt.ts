import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

interface TokenPayload {
  id: string;
}

export const generateAccessToken = (userId: string): string => {
  const token = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: "15m",
  });

  return token;
};

export const generateRefreshToken = (userId: string): string => {
  const token = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
}

export const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  return decoded;
}
