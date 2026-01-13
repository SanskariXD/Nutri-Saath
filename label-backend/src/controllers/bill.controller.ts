import type { Request, Response, NextFunction } from "express";
import { receiptService } from "@services/receipts/receipt.service";
import { AppError } from "@shared/errors";

const DATA_URI_PREFIX = /^data:(?<mime>[^;]+);base64,/;

export const parseBill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let mimeType: string | undefined;
    let base64: string | undefined;

    if (req.file) {
      mimeType = req.file.mimetype;
      base64 = req.file.buffer.toString("base64");
    } else if (typeof req.body.imageBase64 === "string") {
      const match = req.body.imageBase64.match(DATA_URI_PREFIX);
      if (match?.groups?.mime) {
        mimeType = match.groups.mime;
        base64 = req.body.imageBase64.replace(DATA_URI_PREFIX, "");
      } else {
        mimeType = req.body.mimeType ?? "image/jpeg";
        base64 = req.body.imageBase64;
      }
    }

    if (!mimeType || !base64) {
      throw new AppError("Image payload is required", 400);
    }

    const result = await receiptService.parseReceipt({
      userId: "anonymous", // For public API, use anonymous user
      mimeType,
      imageBase64: base64,
    });

    res.json({
      success: true,
      bill: {
        merchant: result.summary.merchant,
        date: result.summary.date,
        items: result.summary.lineItems,
        subtotal: result.summary.subtotal,
        tax: result.summary.tax,
        total: result.summary.total,
        rawText: result.summary.rawText,
      },
      receiptId: result.receiptId,
    });
  } catch (error) {
    next(error);
  }
};
