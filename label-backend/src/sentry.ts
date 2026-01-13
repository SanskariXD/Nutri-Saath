import * as Sentry from "@sentry/node";
import { env } from "@config/env";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  release: env.RELEASE_SHA,
  sendDefaultPii: true,
  tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
});

export { Sentry };
export const sentryRequestHandler = Sentry.Handlers.requestHandler();
export const sentryErrorHandler = Sentry.Handlers.errorHandler();

