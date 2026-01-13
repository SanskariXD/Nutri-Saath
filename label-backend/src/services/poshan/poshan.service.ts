import { env } from "@config/env";

class PoshanService {
  async getSummary(userId: string) {
    return {
      userId,
      status: "ok",
      message: "Sandbox Poshan summary placeholder",
      source: env.POSHAN_BASE_URL ?? null,
      lastSyncedAt: new Date().toISOString(),
    };
  }
}

export const poshanService = new PoshanService();

