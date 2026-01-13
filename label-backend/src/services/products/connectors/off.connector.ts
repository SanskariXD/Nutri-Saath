import axios, { AxiosInstance } from 'axios';

export interface OFFProduct {
  code: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  ingredients_text?: string;
  nutriscore_grade?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  image_url?: string;
  quantity?: string;
  serving_size?: string;
  nutrition_data_per?: string;
  nutrition_data_prepared_per?: string;
  nutriments?: {
    energy_100g?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    salt_100g?: number;
    sugars_100g?: number;
    saturated_fat_100g?: number;
  };
  ingredients?: Array<{
    id: string;
    text: string;
    rank?: number;
  }>;
  additives?: Array<{
    id: string;
    text: string;
  }>;
  allergens?: string;
  traces?: string;
  labels?: string;
  countries?: string;
  stores?: string;
}

export interface OFFSearchResponse {
  products: OFFProduct[];
  count: number;
  page: number;
  pages: number;
}

export class OFFConnector {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://world.openfoodfacts.org/api/v2",
      headers: {
        "User-Agent": process.env.OFF_USER_AGENT || "NutriSaath/1.0 (contact@example.com)"
      },
      timeout: 8000,
    });
  }

  async searchProducts(query: string, page: number = 1, pageSize: number = 20): Promise<OFFSearchResponse> {
    try {
      const response = await this.client.get('/search', {
        params: {
          q: query,
          page,
          size: pageSize,
          fields: 'code,product_name,brands,categories,ingredients_text,nutriscore_grade,ecoscore_grade,nova_group,image_url,quantity,serving_size,nutrition_data_per,nutrition_data_prepared_per,nutriments,ingredients,additives,allergens,traces,labels,countries,stores'
        }
      });

      if (response.data && response.data.products) {
        return {
          products: response.data.products,
          count: response.data.count || 0,
          page: response.data.page || page,
          pages: response.data.pages || 0
        };
      }

      return {
        products: [],
        count: 0,
        page,
        pages: 0
      };
    } catch (error) {
      console.error('OFF search error:', error);
      throw new Error('Failed to search products');
    }
  }

  async getProductByBarcode(barcode: string): Promise<OFFProduct | null> {
    try {
      const response = await this.client.get(`/product/${barcode}`, {
        params: {
          fields: 'code,product_name,brands,categories,ingredients_text,nutriscore_grade,ecoscore_grade,nova_group,image_url,quantity,serving_size,nutrition_data_per,nutrition_data_prepared_per,nutriments,ingredients,additives,allergens,traces,labels,countries,stores'
        }
      });

      if (response.data && response.data.product) {
        return response.data.product;
      }

      return null;
    } catch (error) {
      console.error('OFF get product error:', error);
      return null;
    }
  }

  async getProductByCode(code: string): Promise<OFFProduct | null> {
    return this.getProductByBarcode(code);
  }
}

export const offConnector = new OFFConnector();
