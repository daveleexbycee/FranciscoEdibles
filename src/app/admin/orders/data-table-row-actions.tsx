
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Order } from "@/lib/mock-data"

interface DataTableRowActionsProps {
  row: Row<Order>
  table: Table<Order>
}

export function DataTableRowActions({
  row,
  table,
}: DataTableRowActionsProps) {
  const { onUpdateStatus } = table.options.meta as {
    onUpdateStatus: (order: Order, status: Order['status']) => void,
  }

  const statuses: Order['status'][] = ['Pending', 'Processing', 'Delivered', 'Cancelled']

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
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {statuses.map(status => (
                <DropdownMenuItem 
                  key={status}
                  onClick={() => onUpdateStatus(row.original, status)}
                  disabled={row.original.status === status}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
