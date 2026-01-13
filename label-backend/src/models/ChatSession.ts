import { Schema, model, type Document, Types } from "mongoose";

type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  text: string;
  ts: Date;
}

export interface ChatSessionDocument extends Document {
  userId: Types.ObjectId;
  sessionId: string;
  modelId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<ChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true },
    ts: { type: Date, required: true },
  },
  { _id: false },
);

const chatSessionSchema = new Schema<ChatSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    modelId: { type: String, required: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
);

chatSessionSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

export const ChatSessionModel = model<ChatSessionDocument>("ChatSession", chatSessionSchema);

