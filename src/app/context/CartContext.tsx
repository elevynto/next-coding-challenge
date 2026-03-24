'use client';
import { createContext, useContext, useState } from 'react';

export interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (name: string, price: number) => void;
  removeFromCart: (name: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  initialItems = [],
}: {
  children: React.ReactNode;
  initialItems?: CartItem[];
}) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const addToCart = (name: string, price: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.name === name);
      if (existing) {
        return prev.map(item =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { name, quantity: 1, price }];
    });
  };

  const removeFromCart = (name: string) => {
    setItems(prev =>
      prev
        .map(item => item.name === name ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
