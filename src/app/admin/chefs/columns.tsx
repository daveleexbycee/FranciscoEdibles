"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Chef } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"

export const columns: ColumnDef<Chef>[] = [
  {
    accessorKey: "imageUrl",
    header: "",
    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue("imageUrl")}
          alt={row.original.name}
          width={40}
          height={40}
          className="rounded-full object-cover w-10 h-10"
          data-ai-hint="chef portrait"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string
      return <Badge variant="secondary">{title}</Badge>
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
