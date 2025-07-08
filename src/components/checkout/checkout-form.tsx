
"use client";

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, LocateFixed, CreditCard, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  address: z.string().min(10, { message: 'Please enter a valid delivery address.' }),
  city: z.string().min(2, { message: 'Please enter a city.' }),
  state: z.string().min(2, { message: 'Please enter a state.' }),
  paymentMethod: z.enum(['card', 'delivery'], {
    required_error: 'You must select a payment method.',
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const { toast } = useToast();
  const [isLocating, setIsLocating] = React.useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      paymentMethod: 'card',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, you would use a reverse geocoding service here
        // to convert lat/lng to an address.
        form.setValue('address', `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        toast({
          title: 'Location Found',
          description: 'Your coordinates have been filled in the address field.',
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not get your location. Please check your browser permissions and try again.',
        });
        setIsLocating(false);
      }
    );
  };
  
  function onSubmit(data: CheckoutFormValues) {
    console.log(data);
    toast({
      title: 'Order Placed!',
      description: `Thank you for your order! You've chosen to ${
        data.paymentMethod === 'card' ? 'pay by card' : 'pay on delivery'
      }.`,
    });
    // Here you would typically handle payment and order submission to a backend.
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery & Payment</CardTitle>
        <CardDescription>
          Where should we send your food and how would you like to pay?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <FormLabel htmlFor="address">Delivery Address</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={handleUseCurrentLocation} disabled={isLocating}>
                      {isLocating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                      ) : (
                        <LocateFixed className="mr-2 h-4 w-4" />
                      )}
                       Use Current Location
                    </Button>
                </div>
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea id="address" placeholder="e.g. 123 Foodie Lane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lagos" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lagos" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <div className="relative my-4">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    Or select on map
                    </span>
                </div>
            </div>

            <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center text-muted-foreground relative overflow-hidden">
                <Image src="https://placehold.co/800x400.png" alt="Map placeholder" fill className="object-cover" data-ai-hint="street map" />
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center flex-col text-center p-4">
                    <MapPin className="h-10 w-10 text-white mb-2" />
                    <p className="text-white font-semibold">Google Maps integration coming soon!</p>
                    <p className="text-sm text-white/80">For now, please type your address above.</p>
                </div>
            </div>

            <div className="relative my-6">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Payment Method</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                        >
                          <RadioGroupItem value="card" id="card" className="peer sr-only" />
                          <CreditCard className="mb-3 h-6 w-6" />
                          Pay with Card
                        </Label>
                      </div>
                      <div>
                        <Label
                          htmlFor="delivery"
                          className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                        >
                          <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                          <Truck className="mb-3 h-6 w-6" />
                          Pay on Delivery
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full">
              {paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
