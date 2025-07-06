
"use client";

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag, X } from 'lucide-react';

export default function OrderSummary() {
  const { items, subtotal, discount, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const deliveryFee = subtotal > 0 ? 5.00 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = () => {
    if(couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {items.length > 0 ? items.map(item => (
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
          )) : <p className="text-muted-foreground text-sm">Your cart is empty.</p>}
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-sm font-medium">Have a coupon code?</p>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">{appliedCoupon.code}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeCoupon}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
                <Input 
                    placeholder="Enter coupon code" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <Button onClick={handleApplyCoupon} disabled={!couponCode.trim()}>Apply</Button>
            </div>
          )}
        </div>
        <Separator />
        <div className="space-y-1">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p>₦{subtotal.toFixed(2)}</p>
          </div>
          {discount > 0 && (
             <div className="flex justify-between text-primary">
                <p>Discount</p>
                <p>- ₦{discount.toFixed(2)}</p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-muted-foreground">Delivery Fee</p>
            <p>₦{deliveryFee.toFixed(2)}</p>
          </div>
        </div>
        <Separator />
      </CardContent>
      <CardFooter className="flex justify-between font-bold text-lg bg-secondary/50 p-4">
        <p>Total</p>
        <p>₦{total.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
