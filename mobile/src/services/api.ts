import { EmiQuote, Product, ProductSummary } from '../types';

/**
 * Points at the FastAPI mock backend. When running on a physical device via
 * Expo Go, replace 'localhost' with your machine's LAN IP (see README) since
 * the device can't resolve the dev machine's localhost.
 */
export const API_BASE_URL = 'http://localhost:8000/api';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (err) {
    throw new ApiError(
      'Could not reach the server. Check your connection and try again.'
    );
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new ApiError(detail, response.status);
  }

  return response.json() as Promise<T>;
}

export interface ProductQuery {
  category?: string;
  brand?: string;
  search?: string;
  [key: string]: string | undefined;
}

function toQueryString(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => !!v) as [string, string][];
  if (entries.length === 0) return '';
  const usp = new URLSearchParams(entries);
  return `?${usp.toString()}`;
}

export const api = {
  getProducts: (query: ProductQuery = {}) =>
    request<ProductSummary[]>(`/products${toQueryString(query)}`),

  getCategories: () => request<string[]>('/products/categories'),

  getProduct: (productId: string) =>
    request<Product>(`/products/${productId}`),

  getEmiQuote: (productId: string, variantId: string, planId: string) =>
    request<EmiQuote>(
      `/products/${productId}/emi-quote${toQueryString({
        variant_id: variantId,
        plan_id: planId,
      })}`
    ),
};
