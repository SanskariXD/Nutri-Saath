import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { isAppError, AppError } from "@shared/errors";
import { logger } from "@utils/logger";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Resource not found", 404));
};

export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (isAppError(error)) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = error.issues;
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (statusCode >= 500) {
    logger.error("Unhandled error", { path: req.path, method: req.method, message, details });
  } else {
    logger.warn("Request error", { path: req.path, method: req.method, message, details });
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(details ? { details } : {}),
      requestId: req.headers["x-request-id"],
    },
  });
};

