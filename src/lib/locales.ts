export interface LocaleConfig {
  key: string;
  currency: string;       // e.g. 'GBP', 'USD'
  localeCode: string;     // e.g. 'en-GB', 'en-US'
  priceKey: 'gbp' | 'usd';
  nameKey: 'uk' | 'us';
  labels: {
    basket: string;           // 'Basket' | 'Cart'
    addToLabel: string;       // 'basket' | 'cart' — used in "Add X to {addToLabel}"
    basketEmpty: string;      // 'Your basket is empty.' | 'Your cart is empty.'
    yourBasket: string;       // 'Your basket' | 'Your cart'
    basketItems: string;      // 'Basket items' | 'Cart items' (aria-label)
    continueShopping: string;
  };
  checkoutPath: string;   // '/checkout' | '/us/checkout'
  homePath: string;       // '/' | '/us'
}

export const locales: Record<string, LocaleConfig> = {
  uk: {
    key: 'uk',
    currency: 'GBP',
    localeCode: 'en-GB',
    priceKey: 'gbp',
    nameKey: 'uk',
    labels: {
      basket: 'Basket',
      addToLabel: 'basket',
      basketEmpty: 'Your basket is empty.',
      yourBasket: 'Your basket',
      basketItems: 'Basket items',
      continueShopping: 'Continue shopping',
    },
    checkoutPath: '/checkout',
    homePath: '/',
  },
  us: {
    key: 'us',
    currency: 'USD',
    localeCode: 'en-US',
    priceKey: 'usd',
    nameKey: 'us',
    labels: {
      basket: 'Cart',
      addToLabel: 'cart',
      basketEmpty: 'Your cart is empty.',
      yourBasket: 'Your cart',
      basketItems: 'Cart items',
      continueShopping: 'Continue shopping',
    },
    checkoutPath: '/us/checkout',
    homePath: '/us',
  },
};

// Only locale keys listed here are accessible via the [locale] URL segment.
// 'uk' is intentionally excluded — the UK store is served at / and /checkout.
const ROUTE_LOCALES = ['us'];

export function getLocale(key: string): LocaleConfig | null {
  if (!ROUTE_LOCALES.includes(key)) return null;
  return locales[key] ?? null;
}
