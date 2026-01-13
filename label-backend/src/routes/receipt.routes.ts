import { Router, type RequestHandler } from "express";
import multer from "multer";
import { z } from "zod";
import { parseReceipt } from "@controllers/receipt.controller";
import { requireAuth } from "@middleware/auth";
import { createRateLimiter } from "@middleware/rateLimit";
import { validate } from "@middleware/validate";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const maybeUpload: RequestHandler = (req, res, next) => {
  if (req.is("multipart/form-data")) {
    upload.single("image")(req, res, next);
  } else {
    next();
  }
};

const bodySchema = z.object({
  imageBase64: z.string().optional(),
  mimeType: z.string().optional(),
});

router.post(
  "/parse",
  requireAuth,
  createRateLimiter({
    points: 5,
    duration: 60,
    keyPrefix: "receipt-parse",
    keyGenerator: (req) => req.auth?.uid ?? req.ip ?? req.socket.remoteAddress ?? "anonymous",
  }),
  maybeUpload,
  validate(bodySchema),
  parseReceipt,
);

export const receiptRoutes = router;
