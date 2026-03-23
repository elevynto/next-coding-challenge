import StorePage from './components/StorePage';
import type { ApiResponse } from './types';

export default async function Home() {
  let data: ApiResponse | null = null;

  try {
    const res = await fetch('https://v0-api-endpoint-request.vercel.app/api/products', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    data = await res.json() as ApiResponse;
  } catch {
    // Handled below
  }

  if (!data?.success || !data.products?.length) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Michael&apos;s Amazing Web Store</h1>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>
          Sorry, we couldn&apos;t load our products right now. Please try again later.
        </p>
      </main>
    );
  }

  return <StorePage products={data.products} />;
}
