"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { type CartItem } from "@/context/cart-context";
import { useCart } from "@/hooks/use-cart";
import QuantitySelector from "../shared/quantity-selector";

interface CartItemProps {
  item: CartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const price = (item.price * item.quantity).toFixed(2);

  return (
    <div className="flex items-start gap-4 py-4">
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={80}
        height={80}
        className="rounded-md object-cover"
        data-ai-hint="food item"
      />
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-md">{item.name}</h3>
        <p className="text-muted-foreground text-sm">${item.price.toFixed(2)}</p>
        <QuantitySelector
          quantity={item.quantity}
          onQuantityChange={(newQuantity) => updateQuantity(item.id, newQuantity)}
        />
      </div>
      <div className="text-right">
        <p className="font-semibold">${price}</p>
        <Button variant="ghost" size="icon" className="h-8 w-8 mt-2" onClick={() => removeFromCart(item.id)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  );
}
