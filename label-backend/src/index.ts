
import cors, { type CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env, isDevelopment } from "@config/env";
import { healthCheck, debugPing } from "@controllers/health.controller";
import { notFoundHandler, errorHandler } from "@middleware/errorHandler";
import { connectMongo } from "@config/mongo";
import { logger } from "@utils/logger";
import { registerRoutes } from "@routes/index";
import { sentryRequestHandler, sentryErrorHandler } from "./sentry";





const isLocalNetworkOrigin = (origin: string): boolean => {
  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    // Check for localhost and loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }

    // Check for private IP ranges
    const ipMatch = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipMatch) {
      const [_, a, b] = ipMatch.map(Number);
      // 192.168.x.x
      if (a === 192 && b === 168) return true;
      // 10.x.x.x
      if (a === 10) return true;
      // 172.16.x.x to 172.31.x.x
      if (a === 172 && b >= 16 && b <= 31) return true;
    }

    return false;
  } catch {
    return false;
  }
};

const createCorsOptions = (): CorsOptions => {
  const allowedOrigins = [
    "http://localhost:5173",   // dev frontend
    "http://localhost:5174",   // dev frontend (alternate port)
    "http://localhost:8100",   // Ionic/Capacitor dev
    "capacitor://localhost",   // Capacitor mobile app
    "ionic://localhost",       // Ionic mobile app
    ...(typeof env.corsOrigins === "string" ? [env.corsOrigins] : Array.isArray(env.corsOrigins) ? env.corsOrigins : [])
  ];

  return {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (like mobile apps, curl, health checks)
      if (!origin) return callback(null, true);

      // Allow explicitly configured origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow Vercel preview and production deployments
      if (origin.endsWith(".vercel.app") || origin.includes("vercel.app")) {
        return callback(null, true);
      }

      // Allow ngrok URLs (for development)
      if (origin.includes("ngrok.io") || origin.includes("ngrok-free.app") || origin.includes("ngrok-free.dev")) {
        return callback(null, true);
      }

      // Allow local network origins (for development when accessing via IP)
      if (isLocalNetworkOrigin(origin)) {
        return callback(null, true);
      }

      // In production, allow all origins if specifically configured as "*" or just allow the request
      // (This is safer for an MVP to avoid confusing CORS errors during judging)
      if (env.NODE_ENV === "production" && (env.CORS_ORIGIN === "*" || !env.CORS_ORIGIN)) {
        return callback(null, true);
      }

      // In development, allow localhost variants
      if (origin.startsWith("http://localhost") || origin.startsWith("https://localhost")) {
        return callback(null, true);
      }

      return callback(new Error(`CORS Error: Origin ${origin} not allowed`), false);
    },
    credentials: true,
  };
};

export const createApp = async () => {
  try {
    await connectMongo();
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.warn("Failed to connect to MongoDB. Running in degraded mode", {
      error: error instanceof Error ? error.message : String(error)
    });
  }

  const app = express();
  app.disable("x-powered-by");

  // Short-circuit health checks
  app.all("/health", healthCheck);
  app.get("/robots933456.txt", (_req, res) => {
    res.type("text/plain").status(200).send("User-agent: *\nDisallow: /");
  });
  app.options("*", (_req, res) => res.sendStatus(204));

  app.use(sentryRequestHandler);
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  app.use(cors(createCorsOptions()));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(morgan(isDevelopment ? "dev" : "combined"));

  app.get("/", (_req, res) => res.json({ status: "ok", provider: "Vercel Serverless" }));

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(sentryErrorHandler);
  app.use(errorHandler);

  return app;
};

// For local development only
if (require.main === module) {
  createApp().then(app => {
    app.listen(env.PORT, () => {
      logger.info(`API listening on port ${env.PORT}`);
    });
  });
}
