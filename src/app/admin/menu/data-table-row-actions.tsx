
"use client"

import { Row, Table } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MenuItem } from "@/lib/mock-data"

interface DataTableRowActionsProps {
  row: Row<MenuItem>
  table: Table<MenuItem>
}

export function DataTableRowActions({
  row,
  table,
}: DataTableRowActionsProps) {
  const { onEdit, onDelete, onToggleAvailability } = table.options.meta as {
    onEdit: (item: MenuItem) => void,
    onDelete: (item: MenuItem) => void,
    onToggleAvailability: (item: MenuItem) => void,
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onEdit(row.original)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleAvailability(row.original)}>
          Toggle Availability
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => onDelete(row.original)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
