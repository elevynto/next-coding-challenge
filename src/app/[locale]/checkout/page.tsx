import { notFound } from 'next/navigation';
import CheckoutPage from '../../components/CheckoutPage';
import { getLocale } from '@/lib/locales';

export default function LocaleCheckout({
  params,
}: {
  params: { locale: string };
}) {
  const locale = getLocale(params.locale);
  if (!locale) notFound();

  return <CheckoutPage locale={locale} />;
}
