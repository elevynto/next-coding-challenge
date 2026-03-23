'use client';
import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import ItemCount from './ItemCount';
import type { Product, ApiResponse } from '../types';

const formatGBP = (amount: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

const SKELETON_COUNT = 3;

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (name: string) => void;
}) {
  return (
    <button
      className={styles.card}
      onClick={() => onAdd(product.name.uk)}
      aria-label={`Add ${product.name.uk} to basket`}
    >
      <span className={styles.cardTitle}>{product.name.uk}</span>
      <span className={styles.cardDescription}>{formatGBP(product.price.gbp)}</span>
    </button>
  );
}

export default function StorePage({ products }: { products: Product[] }) {
  const [items, setItems] = useState<{ name: string; quantity: number }[]>([]);
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

  const addToCart = (productName: string) => {
    setItems(prev => {
      const alreadyInCart = prev.find(item => item.name === productName);
      if (alreadyInCart) {
        return prev.map(item =>
          item.name === productName ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { name: productName, quantity: 1 }];
    });
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.storeName}>Michael&apos;s Amazing Web Store</h1>
        <div className={styles.basketArea}>
          <button className={styles.basketButton}>
            Basket: {items.length} {items.length === 1 ? 'item' : 'items'}
          </button>
          {items.length > 0 && (
            <ul className={styles.basketList}>
              {items.map(item => (
                <li key={item.name}>
                  <ItemCount name={item.name} count={item.quantity} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <main className={styles.main}>
        <section aria-label="Products">
          <div className={styles.grid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
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
                    <ProductCard key={product.id} product={product} onAdd={addToCart} />
                  ))
            }
          </div>
        </section>
      </main>
    </>
  );
}
