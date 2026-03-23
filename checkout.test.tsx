import { render, screen } from '@testing-library/react';
import { CartProvider } from '@/app/context/CartContext';
import type { CartItem } from '@/app/context/CartContext';
import CheckoutPage from '@/app/components/CheckoutPage';
import { locales } from '@/app/config/locales';

function renderCheckout(initialItems: CartItem[] = []) {
  return render(
    <CartProvider initialItems={initialItems}>
      <CheckoutPage locale={locales.uk} />
    </CartProvider>
  );
}

describe('CheckoutPage', () => {
  it('shows a friendly message when the basket is empty', () => {
    renderCheckout();

    expect(screen.getByText(/your basket is empty/i)).toBeInTheDocument();
  });

  it('shows a link back to the shop from the empty state', () => {
    renderCheckout();

    expect(screen.getByRole('link', { name: /continue shopping/i })).toHaveAttribute('href', '/');
  });

  it('renders each item with its name and quantity', () => {
    renderCheckout([
      { name: 'Wireless Headsets', quantity: 2, price: 76.99 },
      { name: 'Fitness Tracker', quantity: 1, price: 154.99 },
    ]);

    expect(screen.getByText('Wireless Headsets')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.getByText('Fitness Tracker')).toBeInTheDocument();
    expect(screen.getByText('Qty: 1')).toBeInTheDocument();
  });

  it('shows the correct total item count', () => {
    renderCheckout([
      { name: 'Wireless Headsets', quantity: 2, price: 76.99 },
      { name: 'Fitness Tracker', quantity: 1, price: 154.99 },
    ]);

    expect(screen.getByText('3 items')).toBeInTheDocument();
  });
});
