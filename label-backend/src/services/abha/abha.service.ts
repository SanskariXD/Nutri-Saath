import { AbhaLinkModel } from "@models/index";
import { env } from "@config/env";

interface LinkAbhaInput {
  consentId?: string;
}

class AbhaService {
  async beginLink(userId: string, input: LinkAbhaInput = {}) {
    const link = await AbhaLinkModel.findOneAndUpdate(
      { userId },
      {
        userId,
        status: "pending",
        consentId: input.consentId,
        meta: {
          baseUrl: env.ABHA_BASE_URL,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return {
      status: link.status,
      consentId: link.consentId,
      meta: link.meta,
    };
  }

  async getStatus(userId: string) {
    const link = await AbhaLinkModel.findOne({ userId });
    if (!link) {
      return { status: "pending" as const };
    }

    return {
      status: link.status,
      consentId: link.consentId,
      expiresAt: link.expiresAt,
      meta: link.meta,
    };
  }
}

export const abhaService = new AbhaService();

