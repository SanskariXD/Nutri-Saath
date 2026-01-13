import type { Request, Response, NextFunction } from "express";
import { productService } from "@services/products/product.service";

export const getProductByBarcode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ean } = req.params as { ean: string };
    const { nocache } = req.query as { nocache?: "0" | "1" };
    const { product, source } = await productService.getByBarcode(ean, { nocache: nocache === "1" });
    res.json({ product, source });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, page, page_size, nocache } = req.query as {
      q: string;
      page?: string;
      page_size?: string;
      nocache?: "0" | "1";
    };
    const results = await productService.search(q, {
      page: page ? Number(page) : undefined,
      pageSize: page_size ? Number(page_size) : undefined,
      nocache: nocache === "1",
    });
    res.json({ products: results });
  } catch (error) {
    next(error);
  }
};
