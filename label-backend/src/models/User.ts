import { Schema, model, type Document } from "mongoose";

export interface UserDocument extends Document {
  googleId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    googleId: { type: String, required: true, index: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    displayName: { type: String, required: true },
    avatarUrl: { type: String },
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = model<UserDocument>("User", userSchema);

