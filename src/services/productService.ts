import { authService, API_BASE_URL } from '@/lib/auth';

export type ProductSource = 'off' | 'cache';

export interface Product {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  vegMark?: 'veg' | 'non-veg' | 'egg';
  fssaiLicense?: string;
  imageUrl?: string;
  nutrients: {
    energy: number;
    protein: number;
    carbohydrates: number;
    sugar: number;
    fat: number;
    saturatedFat: number;
    transFat: number;
    sodium: number;
    fiber: number;
  };
  ingredientsRaw?: string;
  allergens: string[];
  additives: string[];
  alternatives: string[];
  source: ProductSource;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

interface BackendProduct {
  ean: string;
  name?: string | null;
  brand?: string | null;
  ingredients?: string | null;
  nutrients?: Record<string, unknown> | null;
  images: Array<{ type: string; url: string }>;
}

interface BackendProductResponse {
  found: boolean;
  product?: BackendProduct;
  source?: ProductSource;
}

export class ProductNotFoundError extends Error {
  constructor(public readonly barcode: string) {
    super(`Product not found for barcode ${barcode}`);
    this.name = 'ProductNotFoundError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authService.getToken();
  
  // Use the configured API URL (should be /api for proxy)
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 [API REQUEST] Making request:', {
    url,
    method: options.method || 'GET',
    hasToken: !!token,
    endpoint
  });
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
    
    console.log('🌐 [API REQUEST] Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });
    
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('🌐 [API REQUEST] ❌ Request failed:', {
        status: response.status,
        statusText: response.statusText,
        text,
        url
      });
      throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('🌐 [API REQUEST] ✅ Response data:', data);
    return data;
    
  } catch (error) {
    console.error('🌐 [API REQUEST] ❌ Network error:', {
      name: error.name,
      message: error.message,
      url
    });
    
    // Handle SSL certificate errors
    if (error.message.includes('CERT_AUTHORITY_INVALID') || 
        error.message.includes('Failed to fetch') ||
        error.name === 'TypeError') {
      console.log('🌐 [API REQUEST] SSL/Certificate error detected, this might be due to ngrok SSL issues');
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    
    throw error;
  }
}

const NON_VEG_KEYWORDS = ['chicken', 'meat', 'pork', 'beef', 'fish', 'prawn', 'shrimp', 'mutton', 'gelatin', 'lard', 'bacon'];
const ALLERGEN_KEYWORDS: Record<string, string> = {
  milk: 'milk',
  peanut: 'peanut',
  peanuts: 'peanut',
  soy: 'soy',
  soya: 'soy',
  egg: 'egg',
  eggs: 'egg',
  gluten: 'gluten',
  wheat: 'gluten',
  shellfish: 'shellfish',
  prawn: 'shellfish',
  shrimp: 'shellfish',
  sesame: 'sesame',
};

const nutrientKeys = {
  energy: ['energy-kcal', 'energy-kcal_100g', 'energy', 'energy_100g'],
  protein: ['proteins', 'proteins_100g'],
  carbohydrates: ['carbohydrates', 'carbohydrates_100g'],
  sugar: ['sugars', 'sugars_100g'],
  fat: ['fat', 'fat_100g'],
  saturatedFat: ['saturated-fat', 'saturated-fat_100g'],
  transFat: ['trans-fat', 'trans-fat_100g'],
  sodium: ['sodium', 'sodium_100g', 'salt', 'salt_100g'],
  fiber: ['fiber', 'fiber_100g'],
} as const;

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function extractNutrients(nutrients?: Record<string, unknown> | null) {
  const result: Product['nutrients'] = {
    energy: 0,
    protein: 0,
    carbohydrates: 0,
    sugar: 0,
    fat: 0,
    saturatedFat: 0,
    transFat: 0,
    sodium: 0,
    fiber: 0,
  };

  if (!nutrients) return result;

  (Object.keys(nutrientKeys) as Array<keyof typeof nutrientKeys>).forEach((key) => {
    if (key === 'sodium') {
      const sodiumValue = nutrientKeys.sodium
        .filter((nutrientKey) => nutrientKey.startsWith('sodium'))
        .map((nutrientKey) => toNumber(nutrients[nutrientKey]))
        .find((val): val is number => typeof val === 'number');

      if (typeof sodiumValue === 'number') {
        result.sodium = Math.round(sodiumValue * 1000); // grams -> mg
        return;
      }

      const saltValue = ['salt', 'salt_100g']
        .map((nutrientKey) => toNumber(nutrients[nutrientKey]))
        .find((val): val is number => typeof val === 'number');

      if (typeof saltValue === 'number') {
        result.sodium = Math.round(saltValue * 400); // grams of salt -> mg sodium
      }

      return;
    }

    const value = nutrientKeys[key]
      .map((nutrientKey) => toNumber(nutrients[nutrientKey]))
      .find((val): val is number => typeof val === 'number');

    if (typeof value === 'number') {
      if (key === 'energy') {
        result.energy = Math.round(value);
      } else {
        result[key] = Math.round(value * 100) / 100;
      }
    }
  });

  return result;
}

function determineVegMark(ingredients?: string | null): Product['vegMark'] {
  if (!ingredients) return 'veg';
  const text = ingredients.toLowerCase();
  if (text.includes('egg')) {
    return 'egg';
  }
  if (NON_VEG_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return 'non-veg';
  }
  return 'veg';
}

function extractAllergens(ingredients?: string | null): string[] {
  if (!ingredients) return [];
  const text = ingredients.toLowerCase();
  const found = new Set<string>();
  Object.entries(ALLERGEN_KEYWORDS).forEach(([keyword, mapped]) => {
    if (text.includes(keyword)) {
      found.add(mapped);
    }
  });
  return Array.from(found);
}

function mapBackendProduct(product: BackendProduct, source: ProductSource): Product {
  const ingredients = product.ingredients ?? undefined;
  const nutrients = extractNutrients(product.nutrients ?? {});
  const imageUrl = product.images.length > 0 ? product.images[0].url : undefined;
  const allergens = extractAllergens(ingredients);

  return {
    barcode: product.ean,
    name: product.name?.trim() || 'Unknown product',
    brand: product.brand?.split(',')[0]?.trim(),
    category: 'General',
    vegMark: determineVegMark(ingredients),
    fssaiLicense: undefined,
    imageUrl,
    nutrients,
    ingredientsRaw: ingredients,
    allergens,
    additives: [],
    alternatives: [],
    source,
  };
}

export class ProductService {
  static async checkBackendHealth(): Promise<boolean> {
    try {
      console.log('🏥 [HEALTH CHECK] Checking backend connectivity...');
      
      // Use a timeout for health check
      const healthPromise = request<{status: string, uptime: number, mongo: string}>('/health');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health check timeout')), 5000)
      );
      
      const healthData = await Promise.race([healthPromise, timeoutPromise]) as {status: string, uptime: number, mongo: string};
      console.log('🏥 [HEALTH CHECK] ✅ Backend is healthy:', healthData);
      return true;
    } catch (error) {
      console.error('🏥 [HEALTH CHECK] ❌ Backend health check failed:', error);
      return false;
    }
  }

  static async getProductByBarcode(barcode: string): Promise<Product> {
    console.log('🛍️ [PRODUCT SERVICE] Looking up product by barcode:', barcode);
    
    try {
      const data = await request<BackendProductResponse>(`/barcode/lookup`, {
        method: 'POST',
        body: JSON.stringify({ barcode }),
      });

      console.log('🛍️ [PRODUCT SERVICE] Backend response:', data);

      if (data.found === false) {
        console.log('🛍️ [PRODUCT SERVICE] ❌ Product not found for barcode:', barcode);
        throw new ProductNotFoundError(barcode);
      }

      console.log('🛍️ [PRODUCT SERVICE] ✅ Product found, mapping data...', {
        product: data.product,
        source: data.source
      });

      const mappedProduct = mapBackendProduct(data.product!, data.source!);
      console.log('🛍️ [PRODUCT SERVICE] ✅ Product mapped successfully:', mappedProduct);
      
      return mappedProduct;
    } catch (error) {
      console.error('🛍️ [PRODUCT SERVICE] ❌ Error looking up product:', error);
      throw error;
    }
  }

  static async searchProducts(
    query: string,
    page: number = 1,
    pageSize: number = 20,
    nocache: boolean = false
  ): Promise<ProductSearchResult> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(nocache && { nocache: '1' }),
    });

    const data = await request<{
      products: BackendProduct[];
      total?: number;
      page?: number;
      page_size?: number;
    }>(`/products/search?${params}`);

    const products = (data.products ?? []).map((product) => mapBackendProduct(product, 'off'));

    return {
      products,
      total: data.total ?? products.length,
      page: data.page ?? page,
      pageSize: data.page_size ?? pageSize,
    };
  }
}

