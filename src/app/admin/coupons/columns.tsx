
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Coupon } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
        return <Badge variant="outline">{row.getValue("code")}</Badge>
    }
  },
  {
    accessorKey: "discountValue",
    header: "Discount",
    cell: ({ row }) => {
        const type = row.original.discountType
        const value = row.original.discountValue
        return type === 'percentage' ? `${value}%` : `₦${value.toFixed(2)}`
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive")
      return <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
