
"use client";

import React, { createContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { type MenuItem, type Coupon } from '@/lib/mock-data';
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (couponCode: string) => void;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('francisco_edibles_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
    const storedCoupon = localStorage.getItem('francisco_edibles_coupon');
    if(storedCoupon) {
      setAppliedCoupon(JSON.parse(storedCoupon));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('francisco_edibles_cart', JSON.stringify(items));
    if (appliedCoupon) {
      localStorage.setItem('francisco_edibles_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('francisco_edibles_coupon');
    }
  }, [items, appliedCoupon]);

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
    setAppliedCoupon(null);
  }

  const applyCoupon = async (couponCode: string) => {
    const q = query(
      collection(db, "coupons"), 
      where("code", "==", couponCode.toUpperCase()),
      where("isActive", "==", true)
    );
    
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const couponDoc = querySnapshot.docs[0];
        const couponToApply = { id: couponDoc.id, ...couponDoc.data() } as Coupon;
        setAppliedCoupon(couponToApply);
        toast({
          title: "Coupon Applied!",
          description: `You've successfully applied the "${couponToApply.code}" coupon.`
        });
      } else {
        setAppliedCoupon(null);
        toast({
          variant: "destructive",
          title: "Invalid Coupon",
          description: "The coupon code you entered is invalid or has expired."
        });
      }
    } catch (error) {
      console.error("Error applying coupon: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not validate your coupon. Please try again."
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discountType === 'percentage') {
      return subtotal * (appliedCoupon.discountValue / 100);
    } else if (appliedCoupon.discountType === 'fixed') {
      return subtotal > appliedCoupon.discountValue ? appliedCoupon.discountValue : subtotal;
    }
    return 0;
  }, [subtotal, appliedCoupon]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, discount, appliedCoupon, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  );
};
