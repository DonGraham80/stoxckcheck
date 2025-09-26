import { 
  Item, 
  Site, 
  Supplier, 
  Recipe, 
  StockMovement, 
  InventoryOnHand,
  CreateReceiptRequest,
  CreateProductionRunRequest,
  CreateWastageRequest,
  CreateTransferRequest,
  CreateCountRequest
} from '../types';

const API_BASE_URL = 'http://localhost:5206/api/v1';

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_tenant');
        window.location.reload();
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getItems(): Promise<Item[]> {
    return this.request<Item[]>('/items');
  }

  async getSites(): Promise<Site[]> {
    return this.request<Site[]>('/sites');
  }

  async getSuppliers(): Promise<Supplier[]> {
    return this.request<Supplier[]>('/suppliers');
  }

  async getRecipes(): Promise<Recipe[]> {
    return this.request<Recipe[]>('/recipes');
  }

  async getInventoryOnHand(siteId?: string): Promise<InventoryOnHand[]> {
    const params = siteId ? `?site_id=${siteId}` : '';
    return this.request<InventoryOnHand[]>(`/on-hand${params}`);
  }

  async getStockMovements(siteId?: string, limit = 100): Promise<StockMovement[]> {
    const params = new URLSearchParams();
    if (siteId) params.append('site_id', siteId);
    params.append('limit', limit.toString());
    return this.request<StockMovement[]>(`/movements?${params}`);
  }

  async createReceipt(data: CreateReceiptRequest): Promise<{ receipt_id: string; status: string }> {
    return this.request('/receipts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createProductionRun(data: CreateProductionRunRequest): Promise<{ production_id: string; status: string }> {
    return this.request('/production-runs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createWastage(data: CreateWastageRequest): Promise<{ wastage_id: string; status: string }> {
    return this.request('/wastage', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createTransfer(data: CreateTransferRequest): Promise<{ transfer_id: string; status: string }> {
    return this.request('/transfers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createCount(data: CreateCountRequest): Promise<{ count_id: string; status: string }> {
    return this.request('/counts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async speechToText(audioFile: File): Promise<{ text: string; confidence: number }> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    const response = await fetch(`${API_BASE_URL}/voice/stt`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`STT request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async textToSpeech(text: string, voiceId?: string): Promise<Blob> {
    const params = new URLSearchParams({ text });
    if (voiceId) params.append('voice_id', voiceId);

    const response = await fetch(`${API_BASE_URL}/voice/tts/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async createAgentPlan(query: string, context: Record<string, any> = {}): Promise<{
    plan_id: string;
    description: string;
    steps: Array<{ action: string; params: Record<string, any> }>;
    requires_confirmation: boolean;
  }> {
    return this.request('/agent/plan', {
      method: 'POST',
      body: JSON.stringify({ query, context }),
    });
  }

  async executeAgentPlan(planId: string, confirmed = false): Promise<{
    plan_id: string;
    status: string;
    message: string;
  }> {
    return this.request('/agent/execute', {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId, confirmed }),
    });
  }

  async createSite(data: {
    name: string;
    address?: string;
    locations: Array<{ name: string; storageType: string }>;
  }): Promise<{ id: string; message: string }> {
    return this.request('/sites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createItem(data: {
    sku: string;
    name: string;
    category: string;
    storageType: string;
    baseUom: string;
    packUom?: string;
    packSize?: number;
    caseUom?: string;
    caseSize?: number;
    standardCost: number;
  }): Promise<{ id: string; message: string }> {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: string, data: {
    sku: string;
    name: string;
    category: string;
    storageType: string;
    baseUom: string;
    packUom?: string;
    packSize?: number;
    caseUom?: string;
    caseSize?: number;
    standardCost: number;
  }): Promise<{ message: string }> {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id: string): Promise<{ message: string }> {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
