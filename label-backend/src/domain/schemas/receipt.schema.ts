import { z } from "zod";

// Product enrichment schema
export const productSchema = z.object({
  ean: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  ingredients: z.string().optional(),
  nutrients: z.object({
    energy_kcal_100g: z.number().optional(),
    energy_kj_100g: z.number().optional(),
    sugars_100g: z.number().optional(),
    sugars_serving: z.number().optional(),
    salt_100g: z.number().optional(),
    sodium_100g: z.number().optional(),
    fat_100g: z.number().optional(),
    saturated_fat_100g: z.number().optional(),
    proteins_100g: z.number().optional(),
    fiber_100g: z.number().optional(),
  }).optional(),
  images: z.object({
    front: z.string().optional(),
    ingredients: z.string().optional(),
    nutrition: z.string().optional(),
  }).optional(),
});

export type ProductData = z.infer<typeof productSchema>;

// Suitability analysis schema
export const suitabilitySchema = z.object({
  verdict: z.enum(["suitable", "caution", "not_suitable"]),
  score: z.number().min(0).max(100),
  reasons: z.array(z.string()),
});

export type SuitabilityAnalysis = z.infer<typeof suitabilitySchema>;

// Enhanced line item schema
export const receiptLineItemSchema = z.object({
  name: z.string().min(1),
  spec: z.string().optional(),
  qty: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  barcode: z.string().optional(),
  productSnapshot: productSchema.optional(),
  suitability: suitabilitySchema.optional(),
});

export type ReceiptLineItem = z.infer<typeof receiptLineItemSchema>;

// Receipt summary schema
export const receiptSummarySchema = z.object({
  suitableCount: z.number().min(0),
  cautionCount: z.number().min(0),
  notSuitableCount: z.number().min(0),
  topFlags: z.array(z.string()),
});

export type ReceiptSummary = z.infer<typeof receiptSummarySchema>;

// Main receipt schema
export const receiptSchema = z.object({
  userId: z.string(),
  imageFileId: z.string().optional(),
  merchant: z.string().optional(),
  date: z.string().optional(),
  currency: z.string().optional(),
  lineItems: z.array(receiptLineItemSchema),
  subtotal: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
  rawText: z.string().optional(),
  status: z.enum(["parsed", "analyzed", "failed"]),
  summary: receiptSummarySchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ReceiptData = z.infer<typeof receiptSchema>;

// OCR extraction schema (for Gemini Vision)
export const ocrExtractionSchema = z.object({
  merchant: z.string().optional(),
  date: z.string().optional(),
  currency: z.string().optional(),
  lineItems: z.array(z.object({
    name: z.string(),
    spec: z.string().optional(),
    qty: z.number().optional(),
    unitPrice: z.number().optional(),
    totalPrice: z.number().optional(),
    barcode: z.string().optional(),
  })),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  total: z.number().optional(),
  rawText: z.string().optional(),
});

export type OcrExtraction = z.infer<typeof ocrExtractionSchema>;

// API response schemas
export const receiptResponseSchema = z.object({
  receiptId: z.string(),
  merchant: z.string().optional(),
  date: z.string().optional(),
  currency: z.string().optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  total: z.number().optional(),
  items: z.array(z.object({
    name: z.string(),
    spec: z.string().optional(),
    qty: z.number().optional(),
    unitPrice: z.number().optional(),
    totalPrice: z.number().optional(),
    product: productSchema.optional(),
    suitability: suitabilitySchema.optional(),
  })),
  summary: receiptSummarySchema.optional(),
});

export type ReceiptResponse = z.infer<typeof receiptResponseSchema>;
