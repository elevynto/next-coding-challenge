'use client';
import { useState } from 'react';
import styles from './page.module.css';
import ItemCount from './components/ItemCount';

const products = [
  { name: 'Item 1', description: 'Foo' },
  { name: 'Item 2', description: 'Bar' },
  { name: 'Item 3', description: 'Baz' },
  { name: 'Item 4', description: 'Qux' },
];

export default function Home() {
  const [items, setItems] = useState<{ name: string; quantity: number }[]>([]);

  const addToCart = (product: string) => {
    const alreadyInCart = items.find(item => item.name === product);
    if (alreadyInCart) {
      setItems(items.map(item =>
        item.name === product ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setItems([...items, { name: product, quantity: 1 }]);
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
                key={product.name}
                className={styles.card}
                onClick={() => addToCart(product.name)}
                aria-label={`Add ${product.name} to basket`}
              >
                <span className={styles.cardTitle}>{product.name}</span>
                <span className={styles.cardDescription}>{product.description}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
