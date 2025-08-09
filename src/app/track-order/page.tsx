
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, PackageCheck, Search, Truck, XCircle } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Order } from "@/lib/mock-data"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Script from "next/script"

const statusVariant: { [key in Order['status']]: "default" | "secondary" | "outline" | "destructive" } = {
  Pending: "outline",
  Processing: "secondary",
  Delivered: "default",
  Cancelled: "destructive",
};

const statusIcon: { [key in Order['status']]: React.ElementType } = {
    Pending: Loader2,
    Processing: Truck,
    Delivered: PackageCheck,
    Cancelled: XCircle,
}

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("")
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searched, setSearched] = useState(false)

    const handleTrackOrder = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderId.trim()) return

        setIsLoading(true)
        setError(null)
        setOrder(null)
        setSearched(true)

        try {
            const docRef = doc(db, "orders", orderId.trim())
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() } as Order)
            } else {
                setError("No order found with this ID. Please check the ID and try again.")
            }
        } catch (err) {
            console.error(err)
            setError("An error occurred while fetching your order. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    const OrderStatus = ({order}: {order: Order}) => {
        const Icon = statusIcon[order.status]
        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                        <Icon className={`h-8 w-8 text-primary ${order.status === 'Pending' || order.status === 'Processing' ? 'animate-spin' : ''}`} />
                         <span>Order Status: <Badge variant={statusVariant[order.status]} className="text-lg ml-2">{order.status}</Badge></span>
                    </CardTitle>
                    <CardDescription>Order placed on {format(new Date(order.date), "PPP")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p><strong>Order ID:</strong> #{order.id.slice(-6).toUpperCase()}</p>
                        <p><strong>Customer:</strong> {order.customerName}</p>
                        <p><strong>Total:</strong> ₦{order.total.toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:py-16">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Track Your Order</CardTitle>
                        <CardDescription>
                            Enter your order ID below to check its current status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-2">
                            <Input 
                                placeholder="Enter your Order ID..." 
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="flex-1"
                                required
                            />
                            <Button type="submit" disabled={isLoading} className="sm:w-auto">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="mr-2 h-4 w-4" />
                                )}
                                Track
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {isLoading && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                
                {error && (
                    <div className="mt-6 text-center text-destructive bg-destructive/10 p-4 rounded-md">
                        {error}
                    </div>
                )}

                {order && <OrderStatus order={order} />}

                {!isLoading && !order && !error && searched && (
                    <div className="mt-6 text-center text-muted-foreground bg-muted/50 p-4 rounded-md">
                        <p>No order details to show.</p>
                    </div>
                )}

                <section className="mt-8 flex justify-center">
                    <div className="border p-4 rounded-lg shadow-sm bg-card">
                        <Script id="adsterra-config-track" strategy="lazyOnload">
                            {`
                            atOptions = {
                                'key' : '3896d1f899c8b3a6de8dd59794ad2a90',
                                'format' : 'iframe',
                                'height' : 250,
                                'width' : 300,
                                'params' : {}
                            };
                            `}
                        </Script>
                        <Script
                            id="adsterra-script-track"
                            strategy="lazyOnload"
                            src="//www.highperformanceformat.com/3896d1f899c8b3a6de8dd59794ad2a90/invoke.js"
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}
