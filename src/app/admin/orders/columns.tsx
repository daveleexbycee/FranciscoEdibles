
"use client"

import { ColumnDef, Table } from "@tanstack/react-table"
import { Order } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"
import { format } from "date-fns"

const statusVariant: { [key in Order['status']]: "default" | "secondary" | "outline" | "destructive" } = {
  Pending: "outline",
  Processing: "secondary",
  Delivered: "default",
  Cancelled: "destructive",
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <div className="font-mono text-xs">#{row.getValue<string>("id").slice(-6).toUpperCase()}</div>,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order['status']
      return <Badge variant={statusVariant[status]}>{status}</Badge>
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.getValue("date")), "PP"),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `₦${(row.getValue("total") as number).toLocaleString()}`,
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table as Table<Order>} />,
  },
]
