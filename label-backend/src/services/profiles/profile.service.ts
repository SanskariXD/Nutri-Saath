import { Types } from "mongoose";
import { ProfileModel, type ProfileDocument } from "@models/Profile";
import { AppError } from "@shared/errors";

type AgeGroup = "adult" | "child" | "senior";
type Language = "en" | "hi" | "kn";
type Diet = "veg" | "vegan" | "jain" | "none";
type Condition = "diabetes" | "hypertension";
type Allergen = "peanut" | "milk" | "egg" | "soy" | "gluten" | "sesame" | "shellfish";

interface BaseProfileInput {
  name: string;
  ageGroup: AgeGroup;
  language: Language;
  conditions?: Condition[];
  allergies?: Allergen[];
  diet?: Diet;
  childMode?: boolean;
  abhaConnected?: boolean;
}

export interface CreateProfileInput extends BaseProfileInput {
  setActive?: boolean;
}

export interface UpdateProfileInput extends Partial<BaseProfileInput> {
  setActive?: boolean;
}

const serializeProfile = (doc: ProfileDocument) => ({
  id: doc._id.toString(),
  userId: doc.userId.toString(),
  name: doc.name,
  ageGroup: doc.ageGroup,
  language: doc.language,
  conditions: doc.conditions,
  allergies: doc.allergies,
  diet: doc.diet,
  childMode: doc.childMode,
  abhaConnected: doc.abhaConnected,
  isActive: doc.isActive,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const toObjectId = (id: string) => new Types.ObjectId(id);

class ProfileService {
  async list(userId: string) {
    const ownerId = toObjectId(userId);
    const profiles = await ProfileModel.find({ userId: ownerId }).sort({ createdAt: 1 });
    return profiles.map(serializeProfile);
  }

  async get(userId: string, profileId: string) {
    const ownerId = toObjectId(userId);
    const profile = await ProfileModel.findOne({ _id: profileId, userId: ownerId });
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }
    return serializeProfile(profile);
  }

  async create(userId: string, payload: CreateProfileInput) {
    const ownerId = toObjectId(userId);
    const hasProfiles = await ProfileModel.exists({ userId: ownerId });
    const profile = await ProfileModel.create({
      userId: ownerId,
      name: payload.name,
      ageGroup: payload.ageGroup,
      language: payload.language,
      conditions: payload.conditions ?? [],
      allergies: payload.allergies ?? [],
      diet: payload.diet ?? "none",
      childMode: payload.childMode ?? false,
      abhaConnected: payload.abhaConnected ?? false,
      isActive: !hasProfiles,
    });

    if (payload.setActive || !hasProfiles) {
      await ProfileModel.updateMany({ userId: ownerId, _id: { $ne: profile._id } }, { $set: { isActive: false } });
      if (!profile.isActive) {
        profile.isActive = true;
        await profile.save();
      }
    }

    return serializeProfile(profile);
  }

  async update(userId: string, profileId: string, payload: UpdateProfileInput) {
    const ownerId = toObjectId(userId);
    const profile = await ProfileModel.findOne({ _id: profileId, userId: ownerId });

    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    let needsSave = false;

    if (payload.name !== undefined) {
      profile.name = payload.name;
      needsSave = true;
    }
    if (payload.ageGroup !== undefined) {
      profile.ageGroup = payload.ageGroup;
      needsSave = true;
    }
    if (payload.language !== undefined) {
      profile.language = payload.language;
      needsSave = true;
    }
    if (payload.conditions !== undefined) {
      profile.conditions = payload.conditions;
      needsSave = true;
    }
    if (payload.allergies !== undefined) {
      profile.allergies = payload.allergies;
      needsSave = true;
    }
    if (payload.diet !== undefined) {
      profile.diet = payload.diet;
      needsSave = true;
    }
    if (payload.childMode !== undefined) {
      profile.childMode = payload.childMode;
      needsSave = true;
    }
    if (payload.abhaConnected !== undefined) {
      profile.abhaConnected = payload.abhaConnected;
      needsSave = true;
    }

    if (payload.setActive) {
      await ProfileModel.updateMany({ userId: ownerId, _id: { $ne: profile._id } }, { $set: { isActive: false } });
      if (!profile.isActive) {
        profile.isActive = true;
        needsSave = true;
      }
    }

    if (needsSave) {
      await profile.save();
    }

    return serializeProfile(profile);
  }

  async remove(userId: string, profileId: string) {
    const ownerId = toObjectId(userId);
    const profile = await ProfileModel.findOne({ _id: profileId, userId: ownerId });
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    const wasActive = profile.isActive;
    await profile.deleteOne();

    if (wasActive) {
      const replacement = await ProfileModel.findOne({ userId: ownerId }).sort({ updatedAt: -1 });
      if (replacement) {
        await ProfileModel.updateMany({ userId: ownerId, _id: { $ne: replacement._id } }, { $set: { isActive: false } });
        if (!replacement.isActive) {
          replacement.isActive = true;
          await replacement.save();
        }
      }
    }
  }

  async setActive(userId: string, profileId: string) {
    const ownerId = toObjectId(userId);
    const profile = await ProfileModel.findOne({ _id: profileId, userId: ownerId });
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    await ProfileModel.updateMany({ userId: ownerId }, { $set: { isActive: false } });
    if (!profile.isActive) {
      profile.isActive = true;
      await profile.save();
    }

    return serializeProfile(profile);
  }

  async ensureDefaultProfile(userId: string, fallbackName: string) {
    const ownerId = toObjectId(userId);
    const existingActive = await ProfileModel.findOne({ userId: ownerId, isActive: true });
    if (existingActive) {
      return serializeProfile(existingActive);
    }

    const anyProfile = await ProfileModel.findOne({ userId: ownerId });
    if (anyProfile) {
      await ProfileModel.updateMany({ userId: ownerId, _id: { $ne: anyProfile._id } }, { $set: { isActive: false } });
      if (!anyProfile.isActive) {
        anyProfile.isActive = true;
        await anyProfile.save();
      }
      return serializeProfile(anyProfile);
    }

    return this.create(userId, {
      name: fallbackName,
      ageGroup: "adult",
      language: "en",
      conditions: [],
      allergies: [],
      diet: "none",
      childMode: false,
      abhaConnected: false,
      setActive: true,
    });
  }
}

export const profileService = new ProfileService();
