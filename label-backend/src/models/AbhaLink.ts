import { Schema, model, type Document, Types } from "mongoose";

export type AbhaStatus = "linked" | "pending" | "revoked";

export interface AbhaLinkDocument extends Document {
  userId: Types.ObjectId;
  status: AbhaStatus;
  consentId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const abhaLinkSchema = new Schema<AbhaLinkDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["linked", "pending", "revoked"], default: "pending" },
    consentId: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false },
);

export const AbhaLinkModel = model<AbhaLinkDocument>("AbhaLink", abhaLinkSchema);

