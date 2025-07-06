
"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Coupon, coupons } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 

export default function AdminCouponsPage() {
  const data: Coupon[] = coupons

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Coupons</h2>
          <p className="text-muted-foreground">
            Here you can add, update, and remove promotional coupons.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Coupon
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
