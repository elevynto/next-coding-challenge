import type { LocaleConfig } from '@/lib/locales';

export function formatPrice(amount: number, locale: LocaleConfig): string {
  return new Intl.NumberFormat(locale.localeCode, {
    style: 'currency',
    currency: locale.currency,
  }).format(amount);
}
