import StorePage from '@/app/components/StorePage';
import ProductsError from '@/app/components/ProductsError';
import { locales } from '@/lib/locales';
import { fetchProducts } from '@/lib/api';

export default async function Home() {
  const products = await fetchProducts();

  if (!products) return <ProductsError />;

  return <StorePage products={products} locale={locales.uk} />;
}
