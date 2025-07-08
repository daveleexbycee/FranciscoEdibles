
"use client"

import { useState } from "react"
import { Order, orders as initialOrders } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 
import { useToast } from "@/hooks/use-toast"

export default function AdminOrdersPage() {
  const [data, setData] = useState<Order[]>(initialOrders)
  const { toast } = useToast()

  const handleUpdateStatus = (orderToUpdate: Order, newStatus: Order['status']) => {
    setData(data.map(order => order.id === orderToUpdate.id ? { ...order, status: newStatus } : order))
    toast({ title: "Order Status Updated", description: `Order #${orderToUpdate.id.slice(-4)} is now ${newStatus}.`})
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Orders</h2>
          <p className="text-muted-foreground">
            View and manage customer orders.
          </p>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={data}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}
