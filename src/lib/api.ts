import type { ApiResponse, Product } from '@/types';

export async function fetchProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch('https://v0-api-endpoint-request.vercel.app/api/products', {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json() as ApiResponse;
    return data?.success && data.products?.length ? data.products : null;
  } catch {
    return null;
  }
}
