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
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Michael&apos;s Amazing Web Store</p>
        <div>
          <button className={styles.basket}>Basket: {items.length} {items.length === 1 ? 'item' : 'items'}</button>
          {products.map(product => (
            <ItemCount
              key={product.name}
              name={product.name}
              count={items.find(item => item.name === product.name)?.quantity || 0}
            />
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {products.map(product => (
          <button
            key={product.name}
            className={styles.card}
            onClick={() => addToCart(product.name)}
            aria-label={`Add ${product.name} to basket`}
          >
            <h2>{product.name} <span>-&gt;</span></h2>
            <p>{product.description}</p>
          </button>
        ))}
      </div>
    </main>
  );
}
