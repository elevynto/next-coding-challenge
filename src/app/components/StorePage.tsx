'use client';
import { useState } from 'react';
import styles from '../page.module.css';
import ItemCount from './ItemCount';
import type { Product } from '../types';

const formatGBP = (amount: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

export default function StorePage({ products }: { products: Product[] }) {
  const [items, setItems] = useState<{ name: string; quantity: number }[]>([]);

  const addToCart = (productName: string) => {
    const alreadyInCart = items.find(item => item.name === productName);
    if (alreadyInCart) {
      setItems(items.map(item =>
        item.name === productName ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setItems([...items, { name: productName, quantity: 1 }]);
    }
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
              <button
                key={product.id}
                className={styles.card}
                onClick={() => addToCart(product.name.uk)}
                aria-label={`Add ${product.name.uk} to basket`}
              >
                <span className={styles.cardTitle}>{product.name.uk}</span>
                <span className={styles.cardDescription}>{formatGBP(product.price.gbp)}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
