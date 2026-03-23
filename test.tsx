import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders an empty basket', () => {
    render(<Home />);

    expect(screen.getByRole('button', { name: /Basket:/i })).toHaveTextContent('Basket: 0 items');
  });

  it('renders a basket with 1 item after adding one product', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Item 1 to basket' }));

    expect(screen.getByRole('button', { name: /Basket:/i })).toHaveTextContent('Basket: 1 item');
  });

  it('renders a basket with 2 items after adding two different products', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Item 1 to basket' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Item 2 to basket' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Item 2 to basket' }));

    expect(screen.getByRole('button', { name: /Basket:/i })).toHaveTextContent('Basket: 2 items');
  });
});
