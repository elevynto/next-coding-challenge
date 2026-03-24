import { getLocale, locales } from '@/lib/locales';

describe('getLocale', () => {
  it('returns the US locale config for "us"', () => {
    expect(getLocale('us')).toEqual(locales.us);
  });

  it('returns null for "uk" — UK is served at / not via a locale segment', () => {
    expect(getLocale('uk')).toBeNull();
  });

  it('returns null for an unknown key', () => {
    expect(getLocale('fr')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getLocale('')).toBeNull();
  });

  describe('US locale config shape', () => {
    const us = getLocale('us')!;

    it('has the correct currency', () => {
      expect(us.currency).toBe('USD');
    });

    it('has the correct locale code', () => {
      expect(us.localeCode).toBe('en-US');
    });

    it('has the correct checkout path', () => {
      expect(us.checkoutPath).toBe('/us/checkout');
    });

    it('has the correct home path', () => {
      expect(us.homePath).toBe('/us');
    });

    it('uses "Cart" terminology', () => {
      expect(us.labels.basket).toBe('Cart');
      expect(us.labels.addToLabel).toBe('cart');
      expect(us.labels.basketEmpty).toBe('Your cart is empty.');
      expect(us.labels.yourBasket).toBe('Your cart');
    });
  });
});
