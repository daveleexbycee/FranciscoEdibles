
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Utensils, DollarSign, ShoppingBag } from "lucide-react"

interface OverviewCardsProps {
  totalRevenue: number;
  totalOrders: number;
  chefCount: number;
  menuItemCount: number;
}

export default function OverviewCards({ totalRevenue, totalOrders, chefCount, menuItemCount }: OverviewCardsProps) {
  const stats = [
    { title: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign, change: "from delivered orders" },
    { title: "Total Orders", value: `+${totalOrders}`, icon: ShoppingBag, change: "all time" },
    { title: "Chefs", value: `${chefCount}`, icon: Users, change: "Active" },
    { title: "Menu Items", value: `${menuItemCount}`, icon: Utensils, change: "Available" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
