import { Router } from "express";
import { z } from "zod";
import { lookupBarcode } from "@controllers/barcode.controller";
import { createRateLimiter } from "@middleware/rateLimit";
import { validate } from "@middleware/validate";

const router = Router();

const barcodeSchema = z.object({
  barcode: z.string().min(8).max(14).regex(/^\d+$/, "Barcode must contain only digits"),
});

router.post(
  "/lookup",
  createRateLimiter({
    points: 20,
    duration: 60,
    keyPrefix: "barcode-lookup",
    keyGenerator: (req) => req.ip ?? req.socket.remoteAddress ?? "anonymous",
  }),
  validate(barcodeSchema),
  lookupBarcode,
);

export const barcodeRoutes = router;
