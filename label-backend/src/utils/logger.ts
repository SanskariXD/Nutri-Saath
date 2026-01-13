import { env } from "@config/env";

type LogLevel = "debug" | "info" | "warn" | "error";

const levelWeights: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const activeLevel: LogLevel = env.LOG_LEVEL;

const format = (level: LogLevel, message: string, meta?: Record<string, unknown>): string => {
  const payload = {
    level,
    time: new Date().toISOString(),
    message,
    ...(meta ? { meta } : {}),
  };

  return JSON.stringify(payload);
};

const shouldLog = (level: LogLevel) => levelWeights[level] >= levelWeights[activeLevel];

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog("debug")) {
      console.debug(format("debug", message, meta));
    }
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog("info")) {
      console.info(format("info", message, meta));
    }
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog("warn")) {
      console.warn(format("warn", message, meta));
    }
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog("error")) {
      console.error(format("error", message, meta));
    }
  },
};
