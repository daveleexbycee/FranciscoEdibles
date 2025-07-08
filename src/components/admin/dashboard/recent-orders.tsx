
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Order } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge";

interface RecentOrdersProps {
  data: Order[];
}

const statusVariant: { [key in Order['status']]: "default" | "secondary" | "outline" | "destructive" } = {
  Pending: "outline",
  Processing: "secondary",
  Delivered: "default",
  Cancelled: "destructive",
};

export default function RecentOrders({ data }: RecentOrdersProps) {
  const recentOrders = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="space-y-4">
      {recentOrders.map(order => (
        <div key={order.id} className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src={`https://avatar.vercel.sh/${order.customerName}.png`} alt="Avatar" />
            <AvatarFallback>{getInitials(order.customerName)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 flex-1">
            <p className="text-sm font-medium leading-none">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
          </div>
          <div className="ml-auto text-right">
             <div className="font-medium">₦{order.total.toLocaleString()}</div>
             <Badge variant={statusVariant[order.status]} className="mt-1">{order.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
