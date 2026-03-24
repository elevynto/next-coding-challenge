import { notFound } from 'next/navigation';
import StorePage from '@/app/components/StorePage';
import ProductsError from '@/app/components/ProductsError';
import { getLocale } from '@/lib/locales';
import { fetchProducts } from '@/lib/api';

export default async function LocaleHome({
  params,
}: {
  params: { locale: string };
}) {
  const locale = getLocale(params.locale);
  if (!locale) notFound();

  const products = await fetchProducts();

  if (!products) return <ProductsError />;

  return <StorePage products={products} locale={locale} />;
}
