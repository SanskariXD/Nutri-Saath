import type { AxiosInstance } from "axios";
import { createHttpClient } from "@config/http";
import { env } from "@config/env";
import { AppError } from "@shared/errors";

const OFF_BASE_URL = "https://world.openfoodfacts.org/api/v2";

interface OffProductResponse {
  product?: {
    code?: string;
    product_name?: string;
    brands?: string;
    ingredients_text?: string;
    nutriments?: Record<string, unknown>;
    selected_images?: Record<string, { display: { en?: string; fr?: string } }>;
  };
  status?: number;
  status_verbose?: string;
}

interface OffSearchResponse {
  products?: Array<OffProductResponse["product"]>;
}

const userAgent = `${env.OFF_APP_NAME} ${env.OFF_USER_AGENT}`.trim();

export class OffClient {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = createHttpClient(
      {
        baseURL: OFF_BASE_URL,
        headers: {
          "User-Agent": userAgent,
        },
      },
      { retries: 2, retryDelayMs: 500, name: "open-food-facts" },
    );
  }

  async getProductByEan(ean: string): Promise<OffProductResponse["product"]> {
    const response = await this.http.get<OffProductResponse>(`/product/${ean}.json`, {
      params: {
        fields: "code,product_name,brands,ingredients_text,nutriments,selected_images",
      },
    });

    if (response.data.status !== 1 || !response.data.product) {
      throw new AppError("Product not found on Open Food Facts", 404);
    }

    return response.data.product;
  }

  async searchProducts(
    query: string,
    options?: { page?: number; pageSize?: number; nocache?: boolean },
  ): Promise<OffSearchResponse["products"]> {
    // Normalize query
    const q = query.trim();

    // OFF v2: build a more targeted query that prioritizes brand and product_name matches,
    // within India, English locale, and popularity sorting. We also keep 'search_terms' for
    // broader matching fallback.
    const params = new URLSearchParams({
      // General simple search
      search_terms: q,
      search_simple: "1",
      // Scope and sorting
      countries: "India",
      lc: "en",
      sort_by: "popularity_key",
      // Pagination
      page: String(options?.page ?? 1),
      page_size: String(options?.pageSize ?? 20),
      // Minimal fields
      fields: "code,product_name,brands,ingredients_text,nutriments,selected_images",
    });

    // Also include legacy 'q'
    params.set("q", q);

    // Add advanced tag search for brand and product_name contains
    // tagtype_0=brands&tag_contains_0=contains&tag_0=<q>
    // tagtype_1=product_name&tag_contains_1=contains&tag_1=<q>
    params.set("tagtype_0", "brands");
    params.set("tag_contains_0", "contains");
    params.set("tag_0", q);
    params.set("tagtype_1", "product_name");
    params.set("tag_contains_1", "contains");
    params.set("tag_1", q);

    if (options?.nocache) {
      params.set("nocache", "1");
    }

    const response = await this.http.get<OffSearchResponse>(`/search?${params.toString()}`);
    return response.data.products ?? [];
  }
}

export const offClient = new OffClient();
