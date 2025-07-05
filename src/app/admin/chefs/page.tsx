"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Chef, chefs } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 

export default function AdminChefsPage() {
  const data: Chef[] = chefs

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Chefs</h2>
          <p className="text-muted-foreground">
            Here you can add, update, and remove chefs from your team.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Chef
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
