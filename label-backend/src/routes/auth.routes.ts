import { Router } from "express";
import { z } from "zod";
import { googleAuthController } from "@controllers/auth.controller";
import { validate } from "@middleware/validate";

const router = Router();

const googleAuthSchema = z.object({
  idToken: z.string().min(1),
});

router.post("/google", validate(googleAuthSchema), googleAuthController);

export const authRoutes = router;

