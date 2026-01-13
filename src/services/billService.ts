import { API_BASE_URL } from '@/lib/auth';

export interface BillItem {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface BillData {
  merchant: string;
  date: string;
  items: BillItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  rawText?: string;
}

export interface BillResponse {
  success: boolean;
  bill: BillData;
  receiptId: string;
}

export const billService = {
  async parseBill(imageFile: File): Promise<BillResponse> {
    console.log('🧾 [BILL SERVICE] Starting bill parsing...', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });
    
    const formData = new FormData();
    formData.append('image', imageFile);

    console.log('🧾 [BILL SERVICE] Making API request to parse bill...');
    const response = await fetch(`${API_BASE_URL}/bill/parse`, {
      method: 'POST',
      body: formData,
    });

    console.log('🧾 [BILL SERVICE] API response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('🧾 [BILL SERVICE] ❌ Bill parsing failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: text
      });
      throw new Error(text || `Bill parsing failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('🧾 [BILL SERVICE] Response data:', data);
    
    if (!data.success) {
      console.error('🧾 [BILL SERVICE] ❌ Bill parsing unsuccessful:', data);
      throw new Error('Failed to parse bill');
    }

    console.log('🧾 [BILL SERVICE] ✅ Bill parsed successfully:', {
      receiptId: data.receiptId,
      merchant: data.bill?.merchant,
      itemCount: data.bill?.items?.length || 0
    });

    return data;
  },

  async parseBillFromBase64(imageBase64: string, mimeType: string): Promise<BillResponse> {
    console.log('🧾 [BILL SERVICE] Starting bill parsing from base64...', {
      mimeType,
      base64Length: imageBase64.length
    });
    
    const response = await fetch(`${API_BASE_URL}/api/bill/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
      }),
    });

    console.log('🧾 [BILL SERVICE] Base64 API response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('🧾 [BILL SERVICE] ❌ Base64 bill parsing failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: text
      });
      throw new Error(text || `Bill parsing failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('🧾 [BILL SERVICE] Base64 response data:', data);
    
    if (!data.success) {
      console.error('🧾 [BILL SERVICE] ❌ Base64 bill parsing unsuccessful:', data);
      throw new Error('Failed to parse bill');
    }

    console.log('🧾 [BILL SERVICE] ✅ Base64 bill parsed successfully:', {
      receiptId: data.receiptId,
      merchant: data.bill?.merchant,
      itemCount: data.bill?.items?.length || 0
    });

    return data;
  },
};
