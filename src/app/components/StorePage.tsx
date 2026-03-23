'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../page.module.css';
import { useCart } from '../context/CartContext';
import type { Product, ApiResponse } from '../types';
import type { LocaleConfig } from '../config/locales';

const SKELETON_COUNT = 3;

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
}: {
  product: Product;
  locale: LocaleConfig;
  onAdd: (name: string, price: number) => void;
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
      <span className={styles.cardDescription}>{formatPrice(price, locale)}</span>
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
  const [moreProducts, setMoreProducts] = useState<Product[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [moreError, setMoreError] = useState(false);

  useEffect(() => {
    fetch('/api/more-products')
      .then(res => {
        if (!res.ok) throw new Error(`API responded with ${res.status}`);
        return res.json() as Promise<ApiResponse>;
      })
      .then(data => {
        if (data.success && data.products?.length) {
          setMoreProducts(data.products);
        } else {
          setMoreError(true);
        }
      })
      .catch(() => setMoreError(true))
      .finally(() => setIsLoadingMore(false));
  }, []);

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
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                onAdd={addToCart}
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
                : moreProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      onAdd={addToCart}
                    />
                  ))
            }
          </div>
        </section>
      </main>
    </>
  );
}
