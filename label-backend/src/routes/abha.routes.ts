import { Router } from "express";
import { z } from "zod";
import { linkAbha, getAbhaStatus } from "@controllers/abha.controller";
import { requireAuth } from "@middleware/auth";
import { validate } from "@middleware/validate";

const router = Router();

const linkSchema = z.object({
  consentId: z.string().optional(),
});

router.use(requireAuth);
router.post("/link", validate(linkSchema), linkAbha);
router.get("/status", getAbhaStatus);

export const abhaRoutes = router;

