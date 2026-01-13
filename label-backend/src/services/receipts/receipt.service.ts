import { z } from "zod";
import { ReceiptModel } from "@models/index";
import { geminiClient } from "@services/gemini/gemini.client";
import { AppError } from "@shared/errors";

const receiptSchema = z.object({
  merchant: z.string().min(1),
  date: z.string().min(1),
  lineItems: z
    .array(
      z.object({
        name: z.string().min(1),
        qty: z.number().min(0),
        unitPrice: z.number().min(0),
      }),
    )
    .default([]),
  subtotal: z.number().min(0).nullable().optional(),
  tax: z.number().min(0).nullable().optional(),
  total: z.number().min(0).nullable().optional(),
  rawText: z.string().min(1).nullable().optional(),
});

type ReceiptSchema = z.infer<typeof receiptSchema>;

interface ParseReceiptInput {
  userId: string;
  mimeType: string;
  imageBase64: string;
}

class ReceiptService {
  async parseReceipt({ userId, mimeType, imageBase64 }: ParseReceiptInput) {
    const prompt = `You are extracting receipt information for the Nutri Saath app. \nReturn ONLY a valid JSON object matching this schema: {"merchant": string, "date": string, "lineItems": [{"name": string, "qty": number, "unitPrice": number}], "subtotal": number | null, "tax": number | null, "total": number | null, "rawText": string | null}. \n- The date must be ISO 8601 or YYYY-MM-DD. \n- Quantities and prices must be numbers. \n- If a field is missing, use null. \nDo not include any explanation or Markdown.`;

    const geminiRaw = await geminiClient.generateStructuredVision(prompt, imageBase64, mimeType);
    const jsonPayload = this.extractJson(geminiRaw);
    const parsed = receiptSchema.parse(jsonPayload);

    const receipt = await ReceiptModel.create({
      userId,
      merchant: parsed.merchant,
      date: parsed.date ? new Date(parsed.date) : undefined,
      lineItems: parsed.lineItems,
      subtotal: this.toNumber(parsed.subtotal),
      tax: this.toNumber(parsed.tax),
      total: this.toNumber(parsed.total),
      rawText: parsed.rawText ?? undefined,
      parsedBy: "gemini",
    });

    return {
      receiptId: receipt._id.toString(),
      summary: parsed,
    };
  }

  private extractJson(raw: string): ReceiptSchema {
    const cleaned = raw
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new AppError("Gemini returned invalid JSON", 502, { raw });
    }
  }

  private toNumber(value?: number | null): number | undefined {
    return typeof value === "number" ? value : undefined;
  }
}

export const receiptService = new ReceiptService();

