
"use client"

import { ColumnDef, Table } from "@tanstack/react-table"
import { MenuItem } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"

export const columns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: "imageUrl",
    header: "",
    cell: ({ row }) => (
      <Image
        src={row.getValue("imageUrl")}
        alt={row.original.name}
        width={40}
        height={40}
        className="rounded-md object-cover w-10 h-10"
        data-ai-hint="food item"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `₦${(row.getValue("price") as number).toLocaleString()}`,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
  },
  {
    accessorKey: "soldOut",
    header: "Availability",
    cell: ({ row }) => (
      <Badge variant={row.getValue("soldOut") ? "destructive" : "default"}>
        {row.getValue("soldOut") ? "Sold Out" : "Available"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table as Table<MenuItem>} />,
  },
]
