import type { Request, Response, NextFunction } from "express";
import { productService } from "@services/products/product.service";
import { AppError } from "@shared/errors";

export const lookupBarcode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { barcode } = req.body as { barcode: string };
    
    const { product, source } = await productService.getByBarcode(barcode);
    
    if (source === "notFound") {
      return res.json({ found: false });
    }
    
    res.json({ 
      found: true,
      product: {
        barcode: product.ean,
        name: product.name,
        brand: product.brand,
        ingredients: product.ingredients,
        nutrients: product.nutrients,
        images: product.images,
      },
      source
    });
  } catch (error) {
    next(error);
  }
};
