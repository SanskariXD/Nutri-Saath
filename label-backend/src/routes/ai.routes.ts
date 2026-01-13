import { Router } from "express";
import { z } from "zod";
import { sendAiMessage } from "@controllers/ai.controller";
import { createRateLimiter } from "@middleware/rateLimit";
import { validate } from "@middleware/validate";

const router = Router();

const messageSchema = z.object({
  message: z.string().min(1).max(1000),
});

router.post(
  "/chat",
  createRateLimiter({
    points: 10,
    duration: 60,
    keyPrefix: "ai-chat",
    keyGenerator: (req) => req.ip ?? req.socket.remoteAddress ?? "anonymous",
  }),
  validate(messageSchema),
  sendAiMessage,
);

export const aiRoutes = router;
