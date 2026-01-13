import { Router } from "express";
import { z } from "zod";
import { getProductByBarcode, searchProducts } from "@controllers/product.controller";
import { validate } from "@middleware/validate";

const router = Router();

const barcodeSchema = z.object({
  ean: z.string().regex(/^\d{8,14}$/),
});

const searchSchema = z.object({
  q: z.string().min(1),
  page: z.coerce.number().int().min(1).optional(),
  page_size: z.coerce.number().int().min(1).max(100).optional(),
  nocache: z.enum(["0", "1"]).optional(),
});

router.get("/barcode/:ean", validate(barcodeSchema, "params"), getProductByBarcode);
router.get("/search", validate(searchSchema, "query"), searchProducts);

export const productRoutes = router;
