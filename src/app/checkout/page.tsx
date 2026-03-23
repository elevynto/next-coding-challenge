import CheckoutPage from '../components/CheckoutPage';
import { locales } from '../config/locales';

export default function Page() {
  return <CheckoutPage locale={locales.uk} />;
}
