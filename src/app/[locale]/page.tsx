import { notFound } from 'next/navigation';
import StorePage from '../components/StorePage';
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

  if (!products) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Michael&apos;s Amazing Web Store</h1>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>
          Sorry, we couldn&apos;t load our products right now. Please try again later.
        </p>
      </main>
    );
  }

  return <StorePage products={products} locale={locale} />;
}
