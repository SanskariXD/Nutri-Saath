import type { Request, Response, NextFunction } from "express";
import { receiptService } from "@services/receipts/receipt.service";
import { AppError } from "@shared/errors";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      auth?: {
        uid: string;
        email: string;
      };
    }
  }
}

const DATA_URI_PREFIX = /^data:(?<mime>[^;]+);base64,/;

export const parseReceipt = async (req: Request, res: Response, next: NextFunction) => {
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
      userId: req.auth!.uid,
      mimeType,
      imageBase64: base64,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

