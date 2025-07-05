"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { type MenuItem } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={400}
          height={300}
          className="object-cover w-full aspect-[4/3]"
          data-ai-hint="food item"
        />
        {item.soldOut && (
          <Badge variant="destructive" className="absolute top-2 right-2">SOLD OUT</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="font-headline text-xl mb-2">{item.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="font-bold text-lg text-primary">₦{item.price.toFixed(2)}</p>
        <Button onClick={() => addToCart(item)} disabled={item.soldOut}>
           <ShoppingCart className="mr-2 h-4 w-4"/>
           Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
