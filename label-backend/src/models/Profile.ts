import { Schema, model, type Document, Types } from "mongoose";

type AgeGroup = "adult" | "child" | "senior";
type Language = "en" | "hi" | "kn";
type Diet = "veg" | "vegan" | "jain" | "none";
type Condition = "diabetes" | "hypertension";
type Allergen = "peanut" | "milk" | "egg" | "soy" | "gluten" | "sesame" | "shellfish";

export interface ProfileDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  ageGroup: AgeGroup;
  language: Language;
  conditions: Condition[];
  allergies: Allergen[];
  diet: Diet;
  childMode: boolean;
  abhaConnected: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<ProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    ageGroup: { type: String, required: true, enum: ["adult", "child", "senior"], default: "adult" },
    language: { type: String, required: true, enum: ["en", "hi", "kn"], default: "en" },
    conditions: { type: [String], enum: ["diabetes", "hypertension"], default: [] },
    allergies: { type: [String], enum: ["peanut", "milk", "egg", "soy", "gluten", "sesame", "shellfish"], default: [] },
    diet: { type: String, enum: ["veg", "vegan", "jain", "none"], default: "none" },
    childMode: { type: Boolean, default: false },
    abhaConnected: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

profileSchema.index({ userId: 1, isActive: 1 });
profileSchema.index({ userId: 1, name: 1 }, { unique: false });

export const ProfileModel = model<ProfileDocument>("Profile", profileSchema);
