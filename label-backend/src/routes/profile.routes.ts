import { Router } from "express";
import { z } from "zod";
import {
  activateProfile,
  createProfile,
  deleteProfile,
  getProfileById,
  listProfiles,
  updateProfile,
  getMyProfile,
  updateMyProfile,
} from "@controllers/profile.controller";
import { requireAuth } from "@middleware/auth";
import { validate } from "@middleware/validate";

const router = Router();

const ageGroupEnum = z.enum(["adult", "child", "senior"]);
const languageEnum = z.enum(["en", "hi", "kn"]);
const dietEnum = z.enum(["veg", "vegan", "jain", "none"]);
const conditionEnum = z.enum(["diabetes", "hypertension"]);
const allergenEnum = z.enum(["peanut", "milk", "egg", "soy", "gluten", "sesame", "shellfish"]);

const baseSchema = z.object({
  name: z.string().min(1).max(120),
  ageGroup: ageGroupEnum,
  language: languageEnum,
  conditions: z.array(conditionEnum).default([]),
  allergies: z.array(allergenEnum).default([]),
  diet: dietEnum.default("none"),
  childMode: z.boolean().default(false),
  abhaConnected: z.boolean().default(false),
  setActive: z.boolean().optional(),
});

const createSchema = baseSchema;
const updateSchema = baseSchema.partial();

const idParamSchema = z.object({
  profileId: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid profile id" }),
});

router.use(requireAuth);

router.get("/", listProfiles);
router.post("/", validate(createSchema), createProfile);
router.get("/me", getMyProfile);
router.put("/me", validate(updateSchema), updateMyProfile);
router.get("/:profileId", validate(idParamSchema, "params"), getProfileById);
router.put(
  "/:profileId",
  validate(idParamSchema, "params"),
  validate(updateSchema),
  updateProfile,
);
router.delete("/:profileId", validate(idParamSchema, "params"), deleteProfile);
router.post(
  "/:profileId/activate",
  validate(idParamSchema, "params"),
  activateProfile,
);

export const profileRoutes = router;
