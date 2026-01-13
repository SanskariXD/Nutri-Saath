import type { Express } from "express";
import { authRoutes } from "@routes/auth.routes";
import { profileRoutes } from "@routes/profile.routes";
import { productRoutes } from "@routes/product.routes";
import { chatRoutes } from "@routes/chat.routes";
import { receiptRoutes } from "@routes/receipt.routes";
import { abhaRoutes } from "@routes/abha.routes";
import { poshanRoutes } from "@routes/poshan.routes";
import { barcodeRoutes } from "@routes/barcode.routes";
import { billRoutes } from "@routes/bill.routes";
import { aiRoutes } from "@routes/ai.routes";
import { healthRoutes } from "@routes/health.routes";


export const registerRoutes = (app: Express) => {
  app.use("/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  // Alias to support existing frontend expectations
  app.use("/api/profiles", profileRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/receipts", receiptRoutes);
  app.use("/api/abha", abhaRoutes);
  app.use("/api/poshan", poshanRoutes);
  
  // New public API routes
  app.use("/api/barcode", barcodeRoutes);
  app.use("/api/bill", billRoutes);
  app.use("/api/ai", aiRoutes);
};

