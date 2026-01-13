import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "@config/env";
import { AppError } from "@shared/errors";

export interface AuthPayload {
  uid: string;
  email: string;
}

const parseToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = parseToken(req.headers.authorization);
  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    if (!payload?.uid || !payload?.email) {
      return next(new AppError("Invalid token payload", 401));
    }

    req.auth = payload;
    return next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401, { cause: (error as Error).message }));
  }
};

