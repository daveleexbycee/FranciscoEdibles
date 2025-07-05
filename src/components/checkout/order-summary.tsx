"use client";

import { useCart } from '@/hooks/use-cart';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function OrderSummary() {
  const { items } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 5.00; // Example fee
  const total = subtotal + deliveryFee;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint="food item" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p>₦{subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Delivery Fee</p>
            <p>₦{deliveryFee.toFixed(2)}</p>
          </div>
        </div>
        <Separator />
      </CardContent>
      <CardFooter className="flex justify-between font-bold text-lg">
        <p>Total</p>
        <p>₦{total.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
