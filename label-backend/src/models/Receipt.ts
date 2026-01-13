import { Schema, model, type Document, Types } from "mongoose";

export interface ReceiptLineItem {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface ReceiptDocument extends Document {
  userId: Types.ObjectId;
  imageFileId?: Types.ObjectId;
  merchant?: string;
  date?: Date;
  lineItems: ReceiptLineItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  rawText?: string;
  parsedBy: string;
  createdAt: Date;
}

const lineItemSchema = new Schema<ReceiptLineItem>(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false },
);

const receiptSchema = new Schema<ReceiptDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageFileId: { type: Schema.Types.ObjectId },
    merchant: { type: String },
    date: { type: Date },
    lineItems: { type: [lineItemSchema], default: [] },
    subtotal: { type: Number },
    tax: { type: Number },
    total: { type: Number },
    rawText: { type: String },
    parsedBy: { type: String, required: true, default: "gemini" },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

receiptSchema.index({ createdAt: -1 });

export const ReceiptModel = model<ReceiptDocument>("Receipt", receiptSchema);

