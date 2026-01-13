import { config as loadEnv } from "dotenv";
import { z } from "zod";

// Load .env only for local development; Azure App Service provides env vars
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  loadEnv();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().default(8080),
  // Core infrastructure
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  DB_NAME: z.string().default("nutrisaath"),
  // Auth & security
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  // Observability
  SENTRY_DSN: z.string().optional(),
  RELEASE_SHA: z.string().default("local"),
  // External integrations
  GEMINI_API_KEY: z.string().optional(),
  OFF_APP_NAME: z.string().default("label-backend"),
  OFF_USER_AGENT: z.string().default("label-backend/1.0 (+https://example.com)"),
  ABHA_BASE_URL: z.string().optional(),
  POSHAN_BASE_URL: z.string().optional(),
  // CORS
  CORS_ORIGIN: z.string().optional(), // comma-separated
  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

type Env = z.infer<typeof envSchema> & {
  corsOrigins: string[] | "*";
};

let rawEnv: Env;
try {
  rawEnv = envSchema.parse(process.env) as Env;
} catch (err) {
  // In production, avoid crashing for missing optional integrations; log and continue
  const issues = (err as any)?.issues as Array<{ path: string[]; message: string }> | undefined;
  if (process.env.NODE_ENV === "production" && issues) {
    // Filter out optional keys that we provide defaults for
    const fatalIssues = issues.filter((i) => !["OFF_APP_NAME", "OFF_USER_AGENT"].includes(i.path?.[0] ?? ""));
    if (fatalIssues.length === 0) {
      // Provide defaults and re-parse
      rawEnv = envSchema.parse({
        OFF_APP_NAME: "label-backend",
        OFF_USER_AGENT: "label-backend/1.0",
        ...process.env,
      }) as Env;
    } else {
      throw err;
    }
  } else {
    throw err;
  }
}

const extraDevOrigins = [
  "capacitor://localhost",
  "http://localhost",
  "http://localhost:5173",
];

const corsOrigins = rawEnv.CORS_ORIGIN
  ? rawEnv.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : rawEnv.NODE_ENV === "production"
    ? []
    : ("*" as const);

export const env: Env = {
  ...rawEnv,
  corsOrigins: corsOrigins === "*" ? "*" : Array.from(new Set([...corsOrigins, ...(rawEnv.NODE_ENV !== "production" ? extraDevOrigins : [])])),
};

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
