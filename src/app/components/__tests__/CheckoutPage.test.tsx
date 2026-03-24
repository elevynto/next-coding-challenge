import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '@/app/context/CartContext';
import type { CartItem } from '@/app/context/CartContext';
import CheckoutPage from '@/app/components/CheckoutPage';
import { locales } from '@/lib/locales';

function renderCheckout(initialItems: CartItem[] = [], locale = locales.uk) {
  return render(
    <CartProvider initialItems={initialItems}>
      <CheckoutPage locale={locale} />
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

describe('CheckoutPage — US locale', () => {
  it('shows US empty cart copy', () => {
    renderCheckout([], locales.us);

    expect(screen.getByRole('heading', { name: 'Your cart' })).toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('Continue Shopping link in US empty state goes to /us', () => {
    renderCheckout([], locales.us);

    expect(screen.getByRole('link', { name: /continue shopping/i })).toHaveAttribute('href', '/us');
  });

  it('shows Cart items list label in US locale', () => {
    renderCheckout([{ name: 'Wireless Headphones', quantity: 1, price: 99.99 }], locales.us);

    expect(screen.getByRole('list', { name: 'Cart items' })).toBeInTheDocument();
  });
});

describe('CheckoutPage — total price', () => {
  it('shows the correct total price in GBP', () => {
    // Two items so the total (£231.98) differs from any individual item price
    renderCheckout([
      { name: 'Wireless Headsets', quantity: 1, price: 76.99 },
      { name: 'Fitness Tracker', quantity: 1, price: 154.99 },
    ]);

    expect(screen.getByText(/£231\.98/)).toBeInTheDocument();
  });

  it('shows the correct total price in USD', () => {
    // Two items so the total ($299.98) differs from any individual item price
    renderCheckout([
      { name: 'Wireless Headphones', quantity: 1, price: 99.99 },
      { name: 'Smart Watch', quantity: 1, price: 199.99 },
    ], locales.us);

    expect(screen.getByText(/\$299\.98/)).toBeInTheDocument();
  });

  it('shows the correct total price when multiple items are present', () => {
    renderCheckout([
      { name: 'Wireless Headsets', quantity: 1, price: 76.99 },
      { name: 'Fitness Tracker', quantity: 2, price: 154.99 },
    ]);

    expect(screen.getByText(/£386\.97/)).toBeInTheDocument();
    expect(screen.getByText('3 items')).toBeInTheDocument();
  });
});

describe('CheckoutPage — qty controls', () => {
  it('incrementing an item updates its quantity display', () => {
    renderCheckout([{ name: 'Wireless Headsets', quantity: 1, price: 76.99 }]);

    fireEvent.click(screen.getByRole('button', { name: 'Add one more Wireless Headsets to basket' }));

    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
  });

  it('decrementing an item to zero removes it from the list', () => {
    renderCheckout([
      { name: 'Wireless Headsets', quantity: 1, price: 76.99 },
      { name: 'Fitness Tracker', quantity: 1, price: 154.99 },
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Remove one Wireless Headsets from basket' }));

    expect(screen.queryByText('Wireless Headsets')).not.toBeInTheDocument();
    expect(screen.getByText('Fitness Tracker')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Basket:/i })).toHaveTextContent('Basket: 1 item');
  });

  it('removing the last item shows the empty state', () => {
    renderCheckout([{ name: 'Wireless Headsets', quantity: 1, price: 76.99 }]);

    fireEvent.click(screen.getByRole('button', { name: 'Remove one Wireless Headsets from basket' }));

    expect(screen.getByText(/your basket is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toHaveAttribute('href', '/');
  });
});

describe('CheckoutPage — Continue Shopping link', () => {
  it('is present and correct in a non-empty UK cart', () => {
    renderCheckout([{ name: 'Wireless Headsets', quantity: 1, price: 76.99 }]);

    expect(screen.getByRole('link', { name: /continue shopping/i })).toHaveAttribute('href', '/');
  });

  it('goes to /us in a non-empty US cart', () => {
    renderCheckout([{ name: 'Wireless Headphones', quantity: 1, price: 99.99 }], locales.us);

    expect(screen.getByRole('link', { name: /continue shopping/i })).toHaveAttribute('href', '/us');
  });
});
