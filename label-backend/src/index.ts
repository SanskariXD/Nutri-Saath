
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
    "http://localhost:8100",   // Ionic/Capacitor dev
    "capacitor://localhost",   // Capacitor mobile app
    "ionic://localhost",       // Ionic mobile app
    "https://proreduction-debra-nonmonarchally.ngrok-free.dev", // Your specific ngrok URL
    ...(env.corsOrigins === "*" ? [] : env.corsOrigins)
  ];

  return {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (like mobile apps, curl, health checks)
      if (!origin) return callback(null, true);

      // Allow explicitly configured origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow ngrok URLs (for development)
      if (origin?.includes("ngrok.io") || origin?.includes("ngrok-free.app") || origin?.includes("ngrok-free.dev")) {
        return callback(null, true);
      }

      // Allow local network origins (for development when accessing via IP)
      if (isLocalNetworkOrigin(origin)) {
        return callback(null, true);
      }

      // For production, be more restrictive
      if (env.NODE_ENV === "production") {
        return callback(new Error("Not allowed by CORS"), false);
      }

      // In development, allow localhost variants
      if (origin?.startsWith("http://localhost") || origin?.startsWith("https://localhost")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  };
};

const bootstrap = async () => {
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

  // Short-circuit health checks and common infra probes before any other middleware
  app.all("/health", healthCheck);
  app.get("/robots933456.txt", (_req, res) => {
    res.type("text/plain").status(200).send("User-agent: *\nDisallow: /");
  });
  // Preflight: respond fast to any OPTIONS prior to enabling CORS
  app.options("*", (_req, res) => res.sendStatus(204));

  app.use(sentryRequestHandler);
  app.use(helmet());
  app.use(cors(createCorsOptions()));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(morgan(isDevelopment ? "dev" : "combined"));

  app.get("/", (_req, res) => res.json({ status: "ok", commit: env.RELEASE_SHA }));
  if (isDevelopment) {
    app.get("/debug/ping", debugPing);
  }

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(sentryErrorHandler);
  app.use(errorHandler);

  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`);
  });

  const shutdown = () => {
    logger.info("Received shutdown signal");
    server.close(() => {
      logger.info("Server stopped");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

bootstrap().catch((error) => {
  logger.error("Bootstrap error", { error: (error as Error).message });
  process.exit(1);
});

