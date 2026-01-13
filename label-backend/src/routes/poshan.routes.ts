import { Router } from "express";
import { getPoshanSummary } from "@controllers/poshan.controller";
import { requireAuth } from "@middleware/auth";

const router = Router();

router.get("/summary", requireAuth, getPoshanSummary);

export const poshanRoutes = router;

