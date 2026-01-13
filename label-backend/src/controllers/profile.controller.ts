import type { Request, Response, NextFunction } from "express";
import { profileService, type CreateProfileInput, type UpdateProfileInput } from "@services/profiles/profile.service";

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

const toResponse = (profile: Awaited<ReturnType<typeof profileService.get>>) => ({
  ...profile,
  createdAt: profile.createdAt instanceof Date ? profile.createdAt.toISOString() : profile.createdAt,
  updatedAt: profile.updatedAt instanceof Date ? profile.updatedAt.toISOString() : profile.updatedAt,
});

export const listProfiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profiles = await profileService.list(req.auth!.uid);
    res.json({ profiles: profiles.map(toResponse) });
  } catch (error) {
    next(error);
  }
};

export const getProfileById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.get(req.auth!.uid, req.params.profileId);
    res.json({ profile: toResponse(profile) });
  } catch (error) {
    next(error);
  }
};

export const createProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as CreateProfileInput;
    const profile = await profileService.create(req.auth!.uid, payload);
    res.status(201).json({ profile: toResponse(profile) });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as UpdateProfileInput;
    const profile = await profileService.update(req.auth!.uid, req.params.profileId, payload);
    res.json({ profile: toResponse(profile) });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await profileService.remove(req.auth!.uid, req.params.profileId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const activateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.setActive(req.auth!.uid, req.params.profileId);
    res.json({ profile: toResponse(profile) });
  } catch (error) {
    next(error);
  }
};

// Compatibility endpoints for /api/profile/me
export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await profileService.list(req.auth!.uid);
    const active = list.find((p) => p.isActive) ?? (await profileService.ensureDefaultProfile(req.auth!.uid, "My Profile"));
    // list/ensureDefaultProfile return serialized profiles already
    res.json({ profile: active });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await profileService.list(req.auth!.uid);
    const active = list.find((p) => p.isActive) ?? (await profileService.ensureDefaultProfile(req.auth!.uid, "My Profile"));
    const payload = req.body as UpdateProfileInput;
    const updated = await profileService.update(req.auth!.uid, (active as any).id, payload);
    res.json({ profile: updated });
  } catch (error) {
    next(error);
  }
};
