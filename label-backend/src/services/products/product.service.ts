import mongoose from "mongoose";
import { ProductModel } from "@models/index";
import { AppError, isAppError } from "@shared/errors";
import { offClient } from "@services/off/off.client";
import { logger } from "@utils/logger";

const STALE_PRODUCT_WINDOW_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export interface NormalizedProduct {
  ean: string;
  name?: string;
  brand?: string;
  ingredients?: string;
  nutrients?: Record<string, unknown>;
  images: Array<{ type: string; url: string }>;
}

class ProductService {
  private isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  async getByBarcode(
    ean: string,
    options?: { nocache?: boolean },
  ): Promise<{ product: NormalizedProduct; source: "cache" | "off" | "notFound" }> {
    const now = Date.now();
    let existing = null;

    if (this.isConnected()) {
      try {
        existing = await ProductModel.findOne({ ean });
      } catch (err) {
        logger.warn("Database error during cache lookup, proceeding without cache", { ean, error: err });
      }
    }

    const existingNormalized = existing ? this.normalize(existing) : undefined;
    const isStale = existing ? now - existing.lastFetchedAt.getTime() > STALE_PRODUCT_WINDOW_MS : true;

    if (existingNormalized && !isStale && !options?.nocache) {
      return { product: existingNormalized, source: "cache" };
    }

    try {
      const offProduct = await offClient.getProductByEan(ean);
      const normalized = this.normalizeFromOff(offProduct);

      if (this.isConnected()) {
        try {
          await ProductModel.findOneAndUpdate(
            { ean },
            {
              ean: normalized.ean,
              name: normalized.name,
              brand: normalized.brand,
              ingredients: normalized.ingredients,
              nutrients: normalized.nutrients,
              images: normalized.images,
              lastFetchedAt: new Date(),
            },
            { upsert: true, setDefaultsOnInsert: true },
          );
        } catch (err) {
          logger.warn("Database error during cache update, skipping update", { ean, error: err });
        }
      }

      return { product: normalized, source: "off" };
    } catch (error: any) {
      const is404 = (isAppError(error) && error.statusCode === 404) ||
        (error.response?.status === 404);

      if (is404) {
        logger.info("Product not found on Open Food Facts", { ean });
        if (existing && this.isConnected()) {
          try {
            await ProductModel.deleteOne({ _id: existing._id });
          } catch (err) {
            logger.warn("Database error during record deletion", { ean, error: err });
          }
        }
        return { product: this.createNotFoundProduct(ean), source: "notFound" };
      }

      if (existingNormalized && !options?.nocache) {
        logger.warn("Falling back to cached product after Open Food Facts failure", {
          ean,
          error: error instanceof Error ? error.message : String(error),
        });
        return { product: existingNormalized, source: "cache" };
      }

      logger.error("Failed to fetch product from Open Food Facts", {
        ean,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError("Failed to fetch product from Open Food Facts", 502);
    }
  }

  async search(query: string, options?: { page?: number; pageSize?: number; nocache?: boolean }) {
    if (!query) {
      throw new AppError("Query is required", 400);
    }
    const products = await offClient.searchProducts(query, {
      page: options?.page,
      pageSize: options?.pageSize,
      nocache: options?.nocache,
    });
    const normalized = (products ?? []).map((product) => this.normalizeFromOff(product));

    // Relevance scoring to prioritize exact and starts-with matches for name/brand
    const normalizedQuery = normalizeText(query);
    const queryTokens = tokenize(normalizedQuery);

    const scored = normalized.map((p) => ({ product: p, score: computeRelevanceScore(normalizedQuery, queryTokens, p) }));

    scored.sort((a, b) => b.score - a.score);

    return scored.map((s) => s.product);
  }

  private normalize(product: {
    ean: string;
    name?: string;
    brand?: string;
    ingredients?: string;
    nutrients?: Record<string, unknown>;
    images?: Array<{ type: string; url: string }>;
  }): NormalizedProduct {
    return {
      ean: product.ean,
      name: product.name,
      brand: product.brand,
      ingredients: product.ingredients,
      nutrients: product.nutrients ?? undefined,
      images: product.images ?? [],
    };
  }

  private normalizeFromOff(product?: {
    code?: string;
    product_name?: string;
    brands?: string;
    ingredients_text?: string;
    nutriments?: Record<string, unknown>;
    selected_images?: Record<string, { display: { en?: string; fr?: string } }>;
  }): NormalizedProduct {
    if (!product?.code) {
      throw new AppError("Open Food Facts product response missing code", 502);
    }

    const images: Array<{ type: string; url: string }> = [];
    if (product.selected_images) {
      for (const [type, variants] of Object.entries(product.selected_images)) {
        const url = variants?.display?.en || variants?.display?.fr;
        if (url) {
          images.push({ type, url });
        }
      }
    }

    return {
      ean: product.code,
      name: product.product_name,
      brand: product.brands,
      ingredients: product.ingredients_text,
      nutrients: product.nutriments ?? undefined,
      images,
    };
  }

  private createNotFoundProduct(ean: string): NormalizedProduct {
    return {
      ean,
      name: undefined,
      brand: undefined,
      ingredients: undefined,
      nutrients: undefined,
      images: [],
    };
  }

}

function normalizeText(value?: string): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function tokenize(value: string): string[] {
  return value
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function computeRelevanceScore(
  normalizedQuery: string,
  queryTokens: string[],
  product: { name?: string; brand?: string; ean: string },
): number {
  const name = normalizeText(product.name);
  const brand = normalizeText(product.brand);

  // Strong boosts for exact and starts-with matches
  let score = 0;

  if (name === normalizedQuery) score += 1000;
  if (brand === normalizedQuery) score += 700;

  if (name.startsWith(normalizedQuery)) score += 500;
  if (brand.startsWith(normalizedQuery)) score += 350;

  // Token-based matching (word boundaries)
  for (const token of queryTokens) {
    if (!token) continue;
    const wordBoundary = new RegExp(`(^|\\s)${escapeRegExp(token)}(\\s|$)`);
    if (wordBoundary.test(name)) score += 120;
    if (wordBoundary.test(brand)) score += 90;

    if (name.includes(token)) score += 60;
    if (brand.includes(token)) score += 45;
  }

  // Small boost if EAN contains query (users sometimes paste partials)
  if (product.ean.includes(normalizedQuery)) score += 10;

  return score;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const productService = new ProductService();

