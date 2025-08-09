
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
import { MapPin, LocateFixed, CreditCard, Truck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { db, auth } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Link from 'next/link';

const containerStyle = {
  width: '100%',
  height: '256px', // h-64
  borderRadius: '0.375rem', // rounded-md
};

const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792
};

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
  const { items, subtotal, discount, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);
  const [isAlertOpen, setAlertOpen] = React.useState(false);
  const [isSuccessAlertOpen, setSuccessAlertOpen] = React.useState(false);
  const [newOrderId, setNewOrderId] = React.useState('');
  const [mapCenter, setMapCenter] = React.useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = React.useState(defaultCenter);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

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
  
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      // Note: This requires the Geocoding API to be enabled in your Google Cloud project.
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      if (data.results && data.results[0]) {
        const address = data.results[0].formatted_address;
        const addressComponents = data.results[0].address_components;
        
        const cityComponent = addressComponents.find((c: any) => c.types.includes('locality'));
        const stateComponent = addressComponents.find((c: any) => c.types.includes('administrative_area_level_1'));
        
        form.setValue('address', address);
        if (cityComponent) form.setValue('city', cityComponent.long_name);
        if (stateComponent) form.setValue('state', stateComponent.long_name);
      } else {
        form.setValue('address', `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      form.setValue('address', `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    }
  };


  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = { lat: latitude, lng: longitude };
        setMapCenter(newPos);
        setMarkerPosition(newPos);
        getAddressFromCoordinates(latitude, longitude);
        toast({
          title: 'Location Found',
          description: 'Your location has been updated on the map and in the form.',
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
  
  async function onSubmit(data: CheckoutFormValues) {
    if (items.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Empty Cart',
        description: 'You cannot place an order with an empty cart.',
      });
      return;
    }

    if (data.paymentMethod === 'delivery') {
      setAlertOpen(true);
      return; // Stop here and wait for user confirmation from the alert
    }
    
    // For card payments, proceed to payment gateway (not implemented)
    await processOrder(data);
  }

  async function processOrder(data: CheckoutFormValues) {
    setIsSubmitting(true);
    try {
      const deliveryFee = subtotal > 0 ? 5.00 : 0;
      const total = Math.max(0, subtotal - discount + deliveryFee);
      const user = auth.currentUser;

      const orderData = {
        customerName: data.fullName,
        customerEmail: user?.email,
        phone: data.phone,
        address: `${data.address}, ${data.city}, ${data.state}`,
        items: items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        subtotal,
        discount,
        deliveryFee,
        total,
        status: 'Pending' as const,
        date: new Date().toISOString(),
        paymentMethod: data.paymentMethod,
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      setNewOrderId(docRef.id);
      setSuccessAlertOpen(true);
      clearCart();
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setAlertOpen(false);
    }
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPos);
      getAddressFromCoordinates(newPos.lat, newPos.lng);
    }
  };

  const handleSuccessAlertClose = () => {
    setSuccessAlertOpen(false);
    router.push('/');
  }

  const renderMap = () => {
    if (loadError) {
      return (
         <div className="w-full h-64 bg-destructive/10 rounded-md flex items-center justify-center text-destructive flex-col p-4 text-center">
            <MapPin className="h-10 w-10 mb-2" />
            <p className="font-semibold">Error loading map</p>
            <p className="text-sm">Please check your API key and network connection.</p>
        </div>
      )
    }

    if (!isLoaded) {
      return (
        <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center text-muted-foreground flex-col">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Loading Map...</p>
        </div>
      )
    }

    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    );
  }

  return (
    <>
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
                        <Input placeholder="Enter your full name" {...field} disabled={isSubmitting} />
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
                        <Input placeholder="Enter your phone number" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <FormLabel htmlFor="address">Delivery Address</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={handleUseCurrentLocation} disabled={isLocating || isSubmitting || !isLoaded}>
                        {isLocating ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                          <Textarea id="address" placeholder="e.g. 123 Foodie Lane" {...field} disabled={isSubmitting} />
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
                          <Input placeholder="e.g. Lagos" {...field} disabled={isSubmitting} />
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
                          <Input placeholder="e.g. Lagos" {...field} disabled={isSubmitting} />
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
                      Click map to set location
                      </span>
                  </div>
              </div>

              {renderMap()}

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
                        disabled={isSubmitting}
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

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                 {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />}
                {paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Pay on Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              We'll contact you soon. Please make sure the number provided is a WhatsApp number.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
             <Button variant="outline" onClick={() => setAlertOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={() => processOrder(form.getValues())} disabled={isSubmitting}>
               {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />}
              Confirm Order
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSuccessAlertOpen} onOpenChange={setSuccessAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Placed Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
               <p>Thank you for your order! Here is your Order ID:</p>
               <div className="font-mono text-lg bg-muted p-2 rounded-md my-2 text-center text-primary">{newOrderId}</div>
               <p>You can use this ID to check the status of your order on the <Link href="/track-order" className="underline font-semibold">Track Order</Link> page.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleSuccessAlertClose}>Continue Shopping</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
