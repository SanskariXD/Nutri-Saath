import { Router } from "express";
import { z } from "zod";
import { sendChatMessage } from "@controllers/chat.controller";
import { requireAuth } from "@middleware/auth";
import { createRateLimiter } from "@middleware/rateLimit";
import { validate } from "@middleware/validate";

const router = Router();

const bodySchema = z.object({
  message: z.string().min(1).max(500),
  sessionId: z.string().uuid().optional(),
});

router.post(
  "/",
  requireAuth,
  createRateLimiter({
    points: 10,
    duration: 60,
    keyPrefix: "chat",
    keyGenerator: (req) => req.auth?.uid ?? req.ip ?? req.socket.remoteAddress ?? "anonymous",
  }),
  validate(bodySchema),
  sendChatMessage,
);

export const chatRoutes = router;
