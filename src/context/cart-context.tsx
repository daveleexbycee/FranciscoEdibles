"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { type MenuItem } from '@/lib/mock-data';
import { useToast } from "@/hooks/use-toast";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('francisco_edibles_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('francisco_edibles_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: MenuItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${item.name} is now in your cart.`,
    })
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(i => i.id !== itemId));
     toast({
      title: "Removed from cart",
      variant: "destructive",
      description: `Item has been removed from your cart.`,
    })
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setItems(prevItems =>
        prevItems.map(i => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  };
  
  const clearCart = () => {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
