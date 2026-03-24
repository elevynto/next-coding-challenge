import { fetchProducts, PRODUCTS_URL } from '@/lib/api';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 1,
  name: { us: 'Wireless Headphones', uk: 'Wireless Headsets' },
  price: { usd: 99.99, gbp: 76.99 },
  stock: 10,
};

function mockFetch(ok: boolean, body: object) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  } as unknown as Response);
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('fetchProducts', () => {
  it('returns products on a successful response', async () => {
    mockFetch(true, { success: true, products: [mockProduct] });
    const result = await fetchProducts();
    expect(result).toEqual([mockProduct]);
  });

  it('fetches from the correct URL', async () => {
    mockFetch(true, { success: true, products: [mockProduct] });
    await fetchProducts();
    expect(global.fetch).toHaveBeenCalledWith(PRODUCTS_URL, expect.any(Object));
  });

  it('returns null when the response is not ok', async () => {
    mockFetch(false, {});
    expect(await fetchProducts()).toBeNull();
  });

  it('returns null when success is false', async () => {
    mockFetch(true, { success: false, products: [mockProduct] });
    expect(await fetchProducts()).toBeNull();
  });

  it('returns null when the products array is empty', async () => {
    mockFetch(true, { success: true, products: [] });
    expect(await fetchProducts()).toBeNull();
  });

  it('returns null when fetch throws a network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    expect(await fetchProducts()).toBeNull();
  });
});
