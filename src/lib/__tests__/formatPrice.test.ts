import { formatPrice } from '@/lib/formatPrice';
import { locales } from '@/lib/locales';

describe('formatPrice', () => {
  describe('GBP (en-GB)', () => {
    it('formats a decimal price', () => {
      expect(formatPrice(29.99, locales.uk)).toBe('£29.99');
    });

    it('formats zero', () => {
      expect(formatPrice(0, locales.uk)).toBe('£0.00');
    });

    it('formats a whole number with two decimal places', () => {
      expect(formatPrice(100, locales.uk)).toBe('£100.00');
    });

    it('formats a large number with thousands separator', () => {
      expect(formatPrice(1000, locales.uk)).toBe('£1,000.00');
    });
  });

  describe('USD (en-US)', () => {
    it('formats a decimal price', () => {
      expect(formatPrice(29.99, locales.us)).toBe('$29.99');
    });

    it('formats zero', () => {
      expect(formatPrice(0, locales.us)).toBe('$0.00');
    });

    it('formats a whole number with two decimal places', () => {
      expect(formatPrice(100, locales.us)).toBe('$100.00');
    });

    it('formats a large number with thousands separator', () => {
      expect(formatPrice(1000, locales.us)).toBe('$1,000.00');
    });
  });
});
