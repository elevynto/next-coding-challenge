import { render, screen, fireEvent, within } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { CartProvider } from '@/app/context/CartContext';
import StorePage from '@/app/components/StorePage';
import type { Product } from '@/types';
import { locales } from '@/lib/locales';

const mockProducts: Product[] = [
  { id: 1, name: { us: 'Wireless Headphones', uk: 'Wireless Headsets' }, price: { usd: 99.99, gbp: 76.99 }, stock: 45 },
  { id: 2, name: { us: 'Smart Watch', uk: 'Fitness Tracker' }, price: { usd: 199.99, gbp: 154.99 }, stock: 28 },
];

const moreProductsMock: Product[] = [
  { id: 3, name: { us: 'Bluetooth Speaker', uk: 'Bluetooth Speaker' }, price: { usd: 49.99, gbp: 39.99 }, stock: 15 },
];

function renderStorePage(locale = locales.uk) {
  return render(
    <CartProvider>
      <StorePage products={mockProducts} locale={locale} />
    </CartProvider>
  );
}

beforeEach(() => {
  // Prevent SWR fetches from resolving during these cart tests
  global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('StorePage', () => {
  it('renders an empty basket', () => {
    renderStorePage();

    expect(screen.getByRole('link', { name: /Basket:/i })).toHaveTextContent('Basket: 0 items');
  });

  it('renders a basket with 1 item after adding one product', () => {
    renderStorePage();

    fireEvent.click(screen.getByRole('button', { name: 'Add Wireless Headsets to basket' }));

    expect(screen.getByRole('link', { name: /Basket:/i })).toHaveTextContent('Basket: 1 item');
  });

  it('renders a basket with 2 items after adding two different products', () => {
    renderStorePage();

    fireEvent.click(screen.getByRole('button', { name: 'Add Wireless Headsets to basket' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Fitness Tracker to basket' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add one more Fitness Tracker to basket' }));

    expect(screen.getByRole('link', { name: /Basket:/i })).toHaveTextContent('Basket: 2 items');
  });
});

describe('StorePage — US locale', () => {
  it('renders an empty cart with US copy', () => {
    renderStorePage(locales.us);

    expect(screen.getByRole('link', { name: /Cart:/i })).toHaveTextContent('Cart: 0 items');
  });

  it('renders US product names', () => {
    renderStorePage(locales.us);

    expect(screen.getByRole('button', { name: 'Add Wireless Headphones to cart' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Smart Watch to cart' })).toBeInTheDocument();
  });

  it('renders a cart with 1 item after adding a product', () => {
    renderStorePage(locales.us);

    fireEvent.click(screen.getByRole('button', { name: 'Add Wireless Headphones to cart' }));

    expect(screen.getByRole('link', { name: /Cart:/i })).toHaveTextContent('Cart: 1 item');
  });
});

describe('StorePage — ProductCard qty controls', () => {
  it('product card switches from button to qty controls after adding', () => {
    renderStorePage();

    fireEvent.click(screen.getByRole('button', { name: 'Add Wireless Headsets to basket' }));

    expect(screen.queryByRole('button', { name: 'Add Wireless Headsets to basket' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove one Wireless Headsets from basket' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add one more Wireless Headsets to basket' })).toBeInTheDocument();
    expect(screen.getByText('Qty: 1')).toBeInTheDocument();
  });

  it('incrementing a product increases its displayed quantity', () => {
    renderStorePage();

    fireEvent.click(screen.getByRole('button', { name: 'Add Wireless Headsets to basket' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add one more Wireless Headsets to basket' }));

    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Basket:/i })).toHaveTextContent('Basket: 1 item');
  });

  it('decrementing a product to zero reverts the card to a button', () => {
    renderStorePage();

    fireEvent.click(screen.getByRole('button', { name: 'Add Wireless Headsets to basket' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove one Wireless Headsets from basket' }));

    expect(screen.getByRole('button', { name: 'Add Wireless Headsets to basket' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove one Wireless Headsets from basket' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Basket:/i })).toHaveTextContent('Basket: 0 items');
  });
});

describe('StorePage — More products section', () => {
  // Each test gets a fresh SWR cache via provider so prior test state doesn't bleed through
  function renderWithFreshCache(locale = locales.uk) {
    return render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <CartProvider>
          <StorePage products={mockProducts} locale={locale} />
        </CartProvider>
      </SWRConfig>
    );
  }

  it('shows loading skeletons while more products are fetching', () => {
    const { container } = renderWithFreshCache();
    const section = screen.getByRole('region', { name: 'More products' });

    expect(within(section).queryByText(/couldn't be loaded/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
  });

  it('shows an error message when more products fail to load', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    renderWithFreshCache();

    expect(await screen.findByText(/couldn't be loaded right now/i)).toBeInTheDocument();
  });

  it('shows more product cards when they load successfully', async () => {
    global.fetch = jest.fn((url: string) =>
      url.includes('more-products')
        ? Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, products: moreProductsMock }) } as Response)
        : new Promise(() => {})
    ) as jest.Mock; 
    renderWithFreshCache();

    expect(await screen.findByRole('button', { name: 'Add Bluetooth Speaker to basket' })).toBeInTheDocument();
    expect(screen.queryByText(/couldn't be loaded/i)).not.toBeInTheDocument();
  });
});
