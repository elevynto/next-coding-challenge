import type { ApiResponse, Product } from '@/types';

export const PRODUCTS_URL = 'https://v0-api-endpoint-request.vercel.app/api/products';

export async function fetchProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch(PRODUCTS_URL, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json() as ApiResponse;
    return data?.success && data.products?.length ? data.products : null;
  } catch {
    return null;
  }
}
