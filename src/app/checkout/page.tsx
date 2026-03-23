'use client';
import Link from 'next/link';
import styles from './checkout.module.css';
import headerStyles from '../page.module.css';
import { useCart } from '../context/CartContext';

const formatGBP = (amount: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

export default function CheckoutPage() {
  const { items } = useCart();

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className={headerStyles.header}>
        <Link href="/" className={headerStyles.storeName} aria-label="Back to Michael's Amazing Web Store">
          Michael&apos;s Amazing Web Store
        </Link>
        <Link
          href="/checkout"
          className={headerStyles.basketButton}
        >
          Basket: {items.length} {items.length === 1 ? 'item' : 'items'}
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.heading}>Your basket</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyMessage}>Your basket is empty.</p>
            <Link href="/" className={styles.shopLink}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.itemList} aria-label="Basket items">
              {items.map(item => (
                <li key={item.name} className={styles.item}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>Qty: {item.quantity}</span>
                  <span className={styles.itemPrice}>{formatGBP(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.total}>
              <span>Total items</span>
              <span>{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</span>
            </div>
            <button className={styles.checkoutButton} aria-label="Proceed to checkout">
              Checkout
            </button>
            <Link href="/" className={styles.continueLink}>
              Continue shopping
            </Link>
          </>
        )}
      </main>
    </>
  );
}
