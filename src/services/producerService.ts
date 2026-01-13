
export interface ProducerProfile {
    id: string;
    businessName: string;
    fssaiLicenseNo: string;
    businessType: string;
    address: string;
    contactPhone: string;
    contactEmail: string;
    gstin?: string; // optional
    verificationStatus: 'UNVERIFIED' | 'VERIFIED_DEMO';
    trustScore: number;
}

export interface Product {
    id: string;
    producerId: string;
    name: string;
    brand?: string;
    category: string;
    netQty: string;
    vegMark: boolean;
    ingredients: string[];
    allergens: string[];
    nutrients: {
        energy: number;
        protein: number;
        carbs: number;
        sugar: number;
        fat: number;
        satFat: number;
        transFat: number;
        sodium: number;
    };
    claims: {
        organic: boolean;
        fortified: boolean;
        odop: boolean;
        shgFpo: boolean;
    };
    categorySpecifics?: { // For ODOP district etc
        distroct?: string;
        odopType?: string;
    }
}

export interface ProducerBatch {
    id: string;
    productId: string;
    productName: string;
    batchId: string; // The user entered batch number e.g. B-2024-X01
    mfgDate: string;
    expDate: string;
    trustCode: string; // The generated UUID or code string
    status: 'Safe' | 'Recalled' | 'Under Review';
    recallReason?: string;
    createdAt: number;
}

export interface LabelDraft {
    name: string;
    category: string;
    trafficLight: 'Green' | 'Amber' | 'Red';
    complianceScore: number;
    checklist: {
        mandatoryElements: boolean;
        claimsValid: boolean;
        nutrientsComplete: boolean;
    };
    warnings: string[];
}

// In-memory storage for demo
let currentProducer: ProducerProfile = {
    id: 'p1',
    businessName: '',
    fssaiLicenseNo: '',
    businessType: 'Manufacturer',
    address: '',
    contactPhone: '',
    contactEmail: '',
    verificationStatus: 'UNVERIFIED',
    trustScore: 20 // Base score
};

let products: Product[] = [];
let batches: ProducerBatch[] = [];

export const ProducerService = {
    // --- Profile ---
    getProfile: async (): Promise<ProducerProfile> => {
        return new Promise(resolve => setTimeout(() => resolve(currentProducer), 400));
    },

    updateProfile: async (data: Partial<ProducerProfile>): Promise<ProducerProfile> => {
        return new Promise(resolve => {
            setTimeout(() => {
                currentProducer = { ...currentProducer, ...data };

                // Calculate demo trust score
                let score = 20;
                if (currentProducer.businessName) score += 10;
                if (currentProducer.fssaiLicenseNo.length >= 10) score += 40;
                if (currentProducer.address) score += 15;
                if (currentProducer.contactPhone) score += 15;

                if (score > 60 && currentProducer.fssaiLicenseNo) {
                    currentProducer.verificationStatus = 'VERIFIED_DEMO';
                }

                currentProducer.trustScore = score;
                resolve(currentProducer);
            }, 600);
        });
    },

    // --- Products ---
    createProduct: async (data: Omit<Product, 'id' | 'producerId'>): Promise<Product> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newProduct: Product = {
                    ...data,
                    id: `prod-${Date.now()}`,
                    producerId: currentProducer.id
                };
                products.push(newProduct);
                resolve(newProduct);
            }, 500);
        });
    },

    getProducts: async (): Promise<Product[]> => {
        return new Promise(resolve => setTimeout(() => resolve(products), 400));
    },

    // --- Batches ---
    createBatch: async (batchData: {
        productId: string,
        productName: string,
        batchId: string,
        mfgDate: string,
        expDate: string
    }): Promise<ProducerBatch> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newBatch: ProducerBatch = {
                    id: `b-${Date.now()}`,
                    productId: batchData.productId,
                    productName: batchData.productName,
                    batchId: batchData.batchId,
                    mfgDate: batchData.mfgDate,
                    expDate: batchData.expDate,
                    trustCode: `NS-${batchData.batchId.toUpperCase()}-${Math.floor(Math.random() * 9999)}`,
                    status: 'Safe',
                    createdAt: Date.now()
                };
                batches.unshift(newBatch); // Add to top
                resolve(newBatch);
            }, 800);
        });
    },

    getBatches: async (): Promise<ProducerBatch[]> => {
        return new Promise(resolve => setTimeout(() => resolve(batches), 400));
    },

    getBatchByTrustCode: async (code: string): Promise<ProducerBatch | undefined> => {
        return new Promise(resolve => setTimeout(() => resolve(batches.find(b => b.trustCode === code)), 400));
    },

    // --- Recall Actions ---
    updateBatchStatus: async (batchId: string, status: 'Safe' | 'Recalled' | 'Under Review', reason?: string): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const batchIndex = batches.findIndex(b => b.id === batchId);
                if (batchIndex !== -1) {
                    batches[batchIndex].status = status;
                    batches[batchIndex].recallReason = reason;
                    // Add demo delay logic for status propagation if needed
                }
                resolve();
            }, 500);
        });
    },

    // --- Label Logic ---
    createLabelDraft: async (data: any): Promise<LabelDraft> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simple mock logic
                let score = 100;
                const warnings: string[] = [];

                if ((data.nutrients?.sugar || 0) > 22) {
                    score -= 15;
                    warnings.push("High Sugar Content (>22g)");
                }
                if ((data.nutrients?.salt || 0) > 1) {
                    score -= 10;
                    warnings.push("High Sodium Content");
                }
                if (data.claims?.organic && !currentProducer.fssaiLicenseNo) {
                    warnings.push("Organic claim requires verified FSSAI license");
                    score -= 20;
                }

                resolve({
                    name: data.name,
                    category: data.category,
                    trafficLight: score > 85 ? 'Green' : score > 60 ? 'Amber' : 'Red',
                    complianceScore: score,
                    checklist: {
                        mandatoryElements: !!(data.name && data.netQty && data.vegMark !== undefined),
                        claimsValid: warnings.length === 0,
                        nutrientsComplete: !!(data.nutrients?.energy && data.nutrients?.protein)
                    },
                    warnings
                });
            }, 800);
        });
    }
};
