/*
 * API response shape from https://v0-api-endpoint-request.vercel.app/api/products
 *
 * {
 *   "success": true,
 *   "products": [
 *     {
 *       "id": 1,
 *       "name": { "us": "Wireless Headphones", "uk": "Wireless Headsets" },
 *       "price": { "usd": 99.99, "gbp": 76.99 },
 *       "stock": 45
 *     },
 *     ...
 *   ]
 * }
 */

export interface Product {
  id: number;
  name: {
    us: string;
    uk: string;
  };
  price: {
    usd: number;
    gbp: number;
  };
  stock: number;
}

export interface ApiResponse {
  success: boolean;
  products: Product[];
}
