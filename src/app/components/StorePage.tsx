'use client';
import useSWR from 'swr';
import Link from 'next/link';
import styles from '../page.module.css';
import { useCart } from '../context/CartContext';
import type { Product, ApiResponse } from '@/types';
import type { LocaleConfig } from '@/lib/locales';

const PRODUCTS_URL = 'https://v0-api-endpoint-request.vercel.app/api/products';
const MORE_PRODUCTS_URL = '/api/more-products';
const SKELETON_COUNT = 3;
const DEDUPING_INTERVAL = 60_000 * 15; 

async function fetcher(url: string): Promise<Product[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const data = await res.json() as ApiResponse;
  if (!data.success || !data.products?.length) throw new Error('No products returned');
  return data.products;
}

function formatPrice(amount: number, locale: LocaleConfig) {
  return new Intl.NumberFormat(locale.localeCode, {
    style: 'currency',
    currency: locale.currency,
  }).format(amount);
}

function ProductCard({
  product,
  locale,
  onAdd,
  quantity,
}: {
  product: Product;
  locale: LocaleConfig;
  onAdd: (name: string, price: number) => void;
  quantity: number;
}) {
  const name = product.name[locale.nameKey];
  const price = product.price[locale.priceKey];
  return (
    <button
      className={styles.card}
      onClick={() => onAdd(name, price)}
      aria-label={`Add ${name} to ${locale.labels.addToLabel}`}
    >
      <span className={styles.cardTitle}>{name}</span>
      <div className={styles.cardFooter}>
        <span className={styles.cardDescription}>{formatPrice(price, locale)}</span>
        {quantity > 0 && <span className={styles.cardQty}>Qty: {quantity}</span>}
      </div>
    </button>
  );
}

export default function StorePage({
  products,
  locale,
}: {
  products: Product[];
  locale: LocaleConfig;
}) {
  const { items, addToCart } = useCart();

  const { data: displayProducts = products } = useSWR<Product[]>(PRODUCTS_URL, fetcher, {
    fallbackData: products,
    dedupingInterval: DEDUPING_INTERVAL,
  });

  const {
    data: moreProducts,
    isLoading: isLoadingMore,
    error: moreError,
  } = useSWR<Product[]>(MORE_PRODUCTS_URL, fetcher, {
    dedupingInterval: DEDUPING_INTERVAL,
  });

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.storeName}>Michael&apos;s Amazing Web Store</h1>
        <Link href={locale.checkoutPath} className={styles.basketButton}>
          {locale.labels.basket}: {items.length} {items.length === 1 ? 'item' : 'items'}
        </Link>
      </header>
      <main className={styles.main}>
        <section aria-label="Products">
          <div className={styles.grid}>
            {displayProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                onAdd={addToCart}
                quantity={items.find(item => item.name === product.name[locale.nameKey])?.quantity ?? 0}
              />
            ))}
          </div>
        </section>

        <section aria-label="More products" className={styles.moreSection}>
          <h2 className={styles.sectionTitle}>More products</h2>
          <div className={styles.grid}>
            {isLoadingMore
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <div key={i} className={styles.skeleton} aria-hidden="true" />
                ))
              : moreError
                ? <p className={styles.loadError}>More products couldn&apos;t be loaded right now.</p>
                : (moreProducts ?? []).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      onAdd={addToCart}
                      quantity={items.find(item => item.name === product.name[locale.nameKey])?.quantity ?? 0}
                    />
                  ))
            }
          </div>
        </section>
      </main>
    </>
  );
}
