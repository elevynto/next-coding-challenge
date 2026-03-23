import { render, screen, fireEvent } from '@testing-library/react';
import StorePage from '@/app/components/StorePage';
import type { Product } from '@/app/types';

const mockProducts: Product[] = [
  { id: 1, name: { us: 'Wireless Headphones', uk: 'Wireless Headsets' }, price: { usd: 99.99, gbp: 76.99 }, stock: 45 },
  { id: 2, name: { us: 'Smart Watch', uk: 'Fitness Tracker' }, price: { usd: 199.99, gbp: 154.99 }, stock: 28 },
];

describe('StorePage', () => {
  it('renders an empty basket', () => {
    render(<StorePage products={mockProducts} />);

    expect(screen.getByRole('button', { name: /Basket:/i })).toHaveTextContent('Basket: 0 items');
  });

  it('renders a basket with 1 item after adding one product', () => {
    render(<StorePage products={mockProducts} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Wireless Headsets to basket' }));

    expect(screen.getByRole('button', { name: /Basket:/i })).toHaveTextContent('Basket: 1 item');
  });

  it('renders a basket with 2 items after adding two different products', () => {
    render(<StorePage products={mockProducts} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Wireless Headsets to basket' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Fitness Tracker to basket' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Fitness Tracker to basket' }));

    expect(screen.getByRole('button', { name: /Basket:/i })).toHaveTextContent('Basket: 2 items');
  });
});
