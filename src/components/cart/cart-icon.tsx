"use client";

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './cart-sheet';
import { useState } from 'react';

export default function CartIcon() {
  const { items } = useCart();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)} aria-label={`Open cart with ${totalItems} items`}>
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </div>
      <CartSheet open={isSheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
