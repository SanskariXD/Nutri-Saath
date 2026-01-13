import { Schema, model, type Document } from "mongoose";

export interface ProductImage {
  type: string;
  url: string;
}

export interface ProductDocument extends Document {
  ean: string;
  name?: string;
  brand?: string;
  nutrients?: Record<string, unknown>;
  ingredients?: string;
  images: ProductImage[];
  lastFetchedAt: Date;
}

const productImageSchema = new Schema<ProductImage>(
  {
    type: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new Schema<ProductDocument>(
  {
    ean: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    brand: { type: String },
    nutrients: { type: Schema.Types.Mixed },
    ingredients: { type: String },
    images: { type: [productImageSchema], default: [] },
    lastFetchedAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true, versionKey: false },
);

productSchema.index({ lastFetchedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30, partialFilterExpression: { lastFetchedAt: { $exists: true } } });

export const ProductModel = model<ProductDocument>("Product", productSchema);

