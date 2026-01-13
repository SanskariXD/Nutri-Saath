import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductSource } from '@/services/productService';

// Types
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
  alternatives?: string[];
  source?: ProductSource;
}

export interface UserProfile {
  type: 'adult' | 'child' | 'senior';
  conditions: ('diabetes' | 'hypertension')[];
  allergies: ('peanut' | 'milk' | 'egg' | 'soy' | 'gluten' | 'shellfish' | 'sesame')[];
  diet: 'veg' | 'vegan' | 'jain' | 'none';
}

export interface HealthScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  reasons: string[];
}

// Store State
interface AppState {
  // User & Profile
  currentProfile: UserProfile;
  abhaConnected: boolean;
  
  // Scanning & Products
  recentScans: Product[];
  currentProduct: Product | null;
  
  // Language & Settings
  language: 'en' | 'hi' | 'kn';
  
  // Learning Progress
  completedLessons: number[];
  
  // Offline State
  isOffline: boolean;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  setAbhaConnected: (connected: boolean) => void;
  addRecentScan: (product: Product) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLanguage: (language: 'en' | 'hi' | 'kn') => void;
  completeLesson: (lessonId: number) => void;
  setOfflineStatus: (isOffline: boolean) => void;
  clearRecentScans: () => void;
}

// Default profile
const defaultProfile: UserProfile = {
  type: 'adult',
  conditions: [],
  allergies: [],
  diet: 'none'
};

// Store Implementation
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentProfile: defaultProfile,
      abhaConnected: false,
      recentScans: [],
      currentProduct: null,
      language: 'en',
      completedLessons: [],
      isOffline: false,
      
      // Actions
      setProfile: (profile) => set({ currentProfile: profile }),
      
      setAbhaConnected: (connected) => set({ abhaConnected: connected }),
      
      addRecentScan: (product) => set((state) => {
        const filtered = state.recentScans.filter(p => p.barcode !== product.barcode);
        return {
          recentScans: [product, ...filtered].slice(0, 50) // Keep last 50
        };
      }),
      
      setCurrentProduct: (product) => set({ currentProduct: product }),
      
      setLanguage: (language) => set({ language }),
      
      completeLesson: (lessonId) => set((state) => ({
        completedLessons: [...new Set([...state.completedLessons, lessonId])]
      })),
      
      setOfflineStatus: (isOffline) => set({ isOffline }),
      
      clearRecentScans: () => set({ recentScans: [] })
    }),
    {
      name: 'label-padega-store',
      partialize: (state) => ({
        currentProfile: state.currentProfile,
        abhaConnected: state.abhaConnected,
        recentScans: state.recentScans,
        language: state.language,
        completedLessons: state.completedLessons
      })
    }
  )
);

// Health Scoring Logic
export const calculateHealthScore = (product: Product, profile: UserProfile): HealthScore => {
  let score = 100;
  const reasons: string[] = [];
  
  const { nutrients } = product;
  
  // Sugar penalties
  if (nutrients.sugar > 22.5) {
    score -= 20;
    reasons.push('very_high_sugar');
  } else if (nutrients.sugar > 10) {
    score -= 12;
    reasons.push('high_sugar');
  } else if (nutrients.sugar > 5) {
    score -= 5;
    reasons.push('moderate_sugar');
  }
  
  // Sodium penalties  
  if (nutrients.sodium > 600) {
    score -= 20;
    reasons.push('very_high_sodium');
  } else if (nutrients.sodium > 400) {
    score -= 12;
    reasons.push('high_sodium');
  } else if (nutrients.sodium > 120) {
    score -= 5;
    reasons.push('moderate_sodium');
  }
  
  // Saturated fat penalties
  if (nutrients.saturatedFat > 5) {
    score -= 15;
    reasons.push('high_saturated_fat');
  } else if (nutrients.saturatedFat > 3) {
    score -= 8;
    reasons.push('moderate_saturated_fat');
  }
  
  // Trans fat penalty
  if (nutrients.transFat > 0) {
    score -= 25;
    reasons.push('contains_trans_fat');
  }
  
  // Additive penalties (cap at 3 concerning additives)
  const concerningAdditives = product.additives.filter(additive => 
    ['E621', 'E951', 'E952', 'E954', 'E129', 'E102'].includes(additive)
  );
  const additivePenalty = Math.min(concerningAdditives.length * 4, 12);
  if (additivePenalty > 0) {
    score -= additivePenalty;
    reasons.push('concerning_additives');
  }
  
  // Profile-based multipliers
  if (profile.conditions.includes('diabetes') && nutrients.sugar > 5) {
    score -= nutrients.sugar > 10 ? 15 : 8; // Double sugar penalty
    if (!reasons.includes('diabetes_concern')) reasons.push('diabetes_concern');
  }
  
  if (profile.conditions.includes('hypertension') && nutrients.sodium > 120) {
    score -= nutrients.sodium > 400 ? 15 : 8; // Double sodium penalty  
    if (!reasons.includes('hypertension_concern')) reasons.push('hypertension_concern');
  }
  
  if (profile.type === 'child') {
    // Sweetener penalty for children
    const hasSweeteners = product.additives.some(additive => 
      ['E951', 'E952', 'E954', 'E955'].includes(additive)
    );
    if (hasSweeteners) {
      score -= 6;
      reasons.push('child_sweetener_concern');
    }
    
    // Additional additive penalty for children
    if (product.additives.length > 2) {
      score -= 4;
      if (!reasons.includes('child_additive_concern')) reasons.push('child_additive_concern');
    }
  }
  
  // Clamp score
  score = Math.max(0, Math.min(100, score));
  
  // Determine grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'E';
  if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 40) grade = 'D';
  else grade = 'E';
  
  return {
    score: Math.round(score),
    grade,
    reasons: reasons.slice(0, 5) // Max 5 reasons
  };
};

