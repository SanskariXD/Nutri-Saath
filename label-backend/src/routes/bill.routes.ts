import { Router, type RequestHandler } from "express";
import multer from "multer";
import { z } from "zod";
import { parseBill } from "@controllers/bill.controller";
import { createRateLimiter } from "@middleware/rateLimit";
import { validate } from "@middleware/validate";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit
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
  createRateLimiter({
    points: 5,
    duration: 60,
    keyPrefix: "bill-parse",
    keyGenerator: (req) => req.ip ?? req.socket.remoteAddress ?? "anonymous",
  }),
  maybeUpload,
  validate(bodySchema),
  parseBill,
);

export const billRoutes = router;
