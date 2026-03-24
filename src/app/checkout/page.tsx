import CheckoutPage from '../components/CheckoutPage';
import { locales } from '@/lib/locales';

export default function Page() {
  return <CheckoutPage locale={locales.uk} />;
}
