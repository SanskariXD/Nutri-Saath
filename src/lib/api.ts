import { Product } from './store';

// Mock Product Database
const mockProducts: Product[] = [
  {
    barcode: '8901030895061',
    name: 'Maggi 2-Minute Noodles Masala',
    brand: 'Nestlé',
    category: 'Instant Noodles',
    vegMark: 'veg',
    fssaiLicense: '10017047000694',
    imageUrl: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Product',
    nutrients: {
      energy: 446,
      protein: 9.9,
      carbohydrates: 60.1,
      sugar: 2.7,
      fat: 17.1,
      saturatedFat: 8.6,
      transFat: 0,
      sodium: 820
    },
    ingredientsRaw: 'Wheat flour, palm oil, salt, minerals, wheat gluten, guar gum, spices & condiments, flavor enhancer (INS 621), acidity regulator (INS 330)',
    allergens: ['gluten', 'soy'],
    additives: ['E621', 'E330'],
    alternatives: ['8901030895078', '8901030895085']
  },
  {
    barcode: '8901030895078', 
    name: 'Maggi Oats Noodles Masala',
    brand: 'Nestlé',
    category: 'Instant Noodles',
    vegMark: 'veg',
    fssaiLicense: '10017047000694',
    imageUrl: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Product',
    nutrients: {
      energy: 419,
      protein: 11.2,
      carbohydrates: 55.8,
      sugar: 2.1,
      fat: 16.8,
      saturatedFat: 7.2,
      transFat: 0,
      sodium: 720
    },
    ingredientsRaw: 'Oats (22%), wheat flour, palm oil, salt, minerals, spices & condiments, flavor enhancer (INS 621)',
    allergens: ['gluten'],
    additives: ['E621'],
    alternatives: ['8901030895061']
  },
  {
    barcode: '8901030871072',
    name: 'Kit Kat 4 Finger Chocolate Bar',
    brand: 'Nestlé',
    category: 'Chocolate',
    vegMark: 'veg',
    fssaiLicense: '10017047000694',
    imageUrl: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Product',
    nutrients: {
      energy: 518,
      protein: 7.3,
      carbohydrates: 59.2,
      sugar: 46.8,
      fat: 26.6,
      saturatedFat: 15.2,
      transFat: 0,
      sodium: 24
    },
    ingredientsRaw: 'Sugar, wheat flour, cocoa butter, cocoa mass, skimmed milk powder, milk fat, lactose, emulsifier (soya lecithin), raising agent (E500ii), salt, natural vanilla flavoring',
    allergens: ['gluten', 'milk', 'soy'],
    additives: ['E322', 'E500'],
    alternatives: ['8901030871089', '8901030871096']
  },
  {
    barcode: '8901058003215',
    name: 'Lays Classic Salted Potato Chips',
    brand: 'PepsiCo',
    category: 'Snacks',
    vegMark: 'veg', 
    fssaiLicense: '10012022000614',
    imageUrl: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Product',
    nutrients: {
      energy: 536,
      protein: 6.7,
      carbohydrates: 50.0,
      sugar: 0.8,
      fat: 33.3,
      saturatedFat: 13.3,
      transFat: 0,
      sodium: 380
    },
    ingredientsRaw: 'Potato, edible vegetable oil (palmolein), salt',
    allergens: [],
    additives: [],
    alternatives: ['8901058003222', '8901058003239']
  },
  {
    barcode: '8901030842997',
    name: 'Coca Cola 250ml',
    brand: 'Coca-Cola',
    category: 'Beverages',
    vegMark: 'veg',
    fssaiLicense: '10012021000028',
    imageUrl: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Product',
    nutrients: {
      energy: 42,
      protein: 0,
      carbohydrates: 10.6,
      sugar: 10.6,
      fat: 0,
      saturatedFat: 0,
      transFat: 0,
      sodium: 8
    },
    ingredientsRaw: 'Carbonated water, sugar, phosphoric acid (INS 338), natural flavoring substances including caffeine, caramel color (INS 150d)',
    allergens: [],
    additives: ['E338', 'E150d'],
    alternatives: ['8901030842980', '8901030843003']
  }
];

// API Functions
export const api = {
  // Get product by barcode
  getProduct: async (barcode: string): Promise<Product | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const product = mockProducts.find(p => p.barcode === barcode);
    return product || null;
  },

  // Search products by name/brand
  searchProducts: async (query: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const lowercaseQuery = query.toLowerCase();
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  },

  // Get alternative products
  getAlternatives: async (barcode: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const product = mockProducts.find(p => p.barcode === barcode);
    if (!product?.alternatives) return [];
    
    return mockProducts.filter(p => 
      product.alternatives!.includes(p.barcode)
    );
  },

  // Submit FSSAI report
  submitReport: async (report: {
    barcode?: string;
    storeLocation: string;
    issueType: string;
    description: string;
    contact: string;
  }): Promise<{ success: boolean; reportId?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Always successful in mock
    return {
      success: true,
      reportId: `RPT${Date.now()}`
    };
  }
};

// React Query keys
export const queryKeys = {
  product: (barcode: string) => ['product', barcode],
  search: (query: string) => ['search', query],
  alternatives: (barcode: string) => ['alternatives', barcode]
};