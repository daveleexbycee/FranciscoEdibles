"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export default function QuantitySelector({ quantity, onQuantityChange }: QuantitySelectorProps) {
  const handleDecrement = () => {
    onQuantityChange(Math.max(0, quantity - 1));
  };

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onQuantityChange(newQuantity);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrement}>
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <Input
        type="number"
        className="h-8 w-12 text-center"
        value={quantity}
        onChange={handleInputChange}
        min="0"
      />
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrement}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
