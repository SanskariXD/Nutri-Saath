import type { Request, RequestHandler } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

interface RateLimitOptions {
  points: number;
  duration: number;
  blockDuration?: number;
  keyPrefix?: string;
  keyGenerator?: (req: Request) => string;
}

export const createRateLimiter = (options: RateLimitOptions): RequestHandler => {
  const limiter = new RateLimiterMemory({
    points: options.points,
    duration: options.duration,
    blockDuration: options.blockDuration ?? 0,
    keyPrefix: options.keyPrefix,
  });

  return async (req, res, next) => {
    const key = options.keyGenerator?.(req) ?? req.ip ?? req.socket.remoteAddress ?? "unknown";
    try {
      await limiter.consume(key);
      next();
    } catch {
      res.status(429).json({ error: { message: "Too many requests" } });
    }
  };
};
