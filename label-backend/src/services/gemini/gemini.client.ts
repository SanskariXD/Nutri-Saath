import type { AxiosInstance } from "axios";
import { createHttpClient } from "@config/http";
import { env } from "@config/env";
import { AppError } from "@shared/errors";
import { logger } from "@utils/logger";

interface GeminiContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiContent {
  role: string;
  parts: GeminiContentPart[];
}

interface GeminiResponse {
  candidates?: Array<{
    content?: GeminiContent;
    finishReason?: string;
  }>;
}

// Use v1beta for Gemini 1.5 models per Google API docs
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-1.5-flash";

export class GeminiClient {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = createHttpClient(
      {
        baseURL: GEMINI_BASE_URL,
        params: { key: env.GEMINI_API_KEY },
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 45000,
      },
      { retries: 1, retryDelayMs: 500, name: "gemini" },
    );
  }

  async generateText(prompt: string, options?: { temperature?: number }): Promise<string> {
    try {
      const response = await this.http.post<GeminiResponse>(
        `/models/${DEFAULT_MODEL}:generateContent`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: options?.temperature ?? 0.5,
          },
        },
        { timeout: 30000 },
      );

      return this.extractText(response.data);
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const message = data?.error?.message || err?.message || "Gemini request failed";
      logger.error("Gemini generateText error", { status, data });
      throw new AppError(`[gemini] ${message}`, status && Number.isFinite(status) ? status : 502);
    }
  }

  async generateStructuredVision(prompt: string, imageBase64: string, mimeType: string): Promise<string> {
    try {
      const response = await this.http.post<GeminiResponse>(
        `/models/${DEFAULT_MODEL}:generateContent`,
        {
          contents: [
            {
              role: "user",
              parts: [
                { inlineData: { mimeType, data: imageBase64 } },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
          },
        },
        { timeout: 45000 },
      );

      return this.extractText(response.data);
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const message = data?.error?.message || err?.message || "Gemini request failed";
      logger.error("Gemini generateStructuredVision error", { status, data });
      throw new AppError(`[gemini] ${message}`, status && Number.isFinite(status) ? status : 502);
    }
  }

  private extractText(payload: GeminiResponse): string {
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join(" ").trim();
    if (!text) {
      throw new AppError("Gemini returned an empty response", 502);
    }
    return text;
  }

  // Safety settings intentionally omitted to avoid API 400 schema mismatches across versions
}

export const geminiClient = new GeminiClient();
