'use client';
import Link from 'next/link';
import styles from '../checkout/checkout.module.css';
import headerStyles from '../page.module.css';
import { useCart } from '../context/CartContext';
import type { LocaleConfig } from '@/lib/locales';

function formatPrice(amount: number, locale: LocaleConfig) {
  return new Intl.NumberFormat(locale.localeCode, {
    style: 'currency',
    currency: locale.currency,
  }).format(amount);
}

export default function CheckoutPage({ locale }: { locale: LocaleConfig }) {
  const { items } = useCart();

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className={headerStyles.header}>
        <Link
          href={locale.homePath}
          className={headerStyles.storeName}
          aria-label="Back to Michael's Amazing Web Store"
        >
          Michael&apos;s Amazing Web Store
        </Link>
        <Link href={locale.checkoutPath} className={headerStyles.basketButton}>
          {locale.labels.basket}: {items.length} {items.length === 1 ? 'item' : 'items'}
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.heading}>{locale.labels.yourBasket}</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyMessage}>{locale.labels.basketEmpty}</p>
            <Link href={locale.homePath} className={styles.shopLink}>
              {locale.labels.continueShopping}
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.itemList} aria-label={locale.labels.basketItems}>
              {items.map(item => (
                <li key={item.name} className={styles.item}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>Qty: {item.quantity}</span>
                  <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity, locale)}</span>
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
            <Link href={locale.homePath} className={styles.continueLink}>
              {locale.labels.continueShopping}
            </Link>
          </>
        )}
      </main>
    </>
  );
}
