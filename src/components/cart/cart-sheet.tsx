
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import CartItem from "./cart-item";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { Separator } from "../ui/separator";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, clearCart, subtotal, discount } = useCart();
  const total = Math.max(0, subtotal - discount);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart</SheetTitle>
          {items.length === 0 && (
             <SheetDescription>Your cart is empty. Add some delicious food!</SheetDescription>
          )}
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="pr-6">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="flex-col gap-4 p-6 bg-secondary/50">
               <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Discount</span>
                    <span>- ₦{discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>
               <div className="flex justify-between items-center">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button asChild className="w-1/2" onClick={() => onOpenChange(false)}>
                    <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
            <div className="flex flex-1 items-center justify-center">
                <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
                    <Link href="/menu">Browse Menu</Link>
                </Button>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
