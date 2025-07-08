
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { MenuItem, menuItems as initialMenuItems } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MenuItemForm } from "@/components/admin/menu/menu-item-form"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function AdminMenuPage() {
  const [data, setData] = useState<MenuItem[]>(initialMenuItems)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const { toast } = useToast()

  const handleOpenForm = (item: MenuItem | null = null) => {
    setSelectedMenuItem(item)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedMenuItem(null)
    setFormOpen(false)
  }

  const handleOpenDeleteAlert = (item: MenuItem) => {
    setSelectedMenuItem(item)
    setDeleteAlertOpen(true)
  }

  const handleCloseDeleteAlert = () => {
    setSelectedMenuItem(null)
    setDeleteAlertOpen(false)
  }

  const handleSubmit = (formData: Omit<MenuItem, 'id'>) => {
    if (selectedMenuItem) {
      setData(data.map(item => item.id === selectedMenuItem.id ? { ...item, ...formData } : item))
      toast({ title: "Menu Item Updated", description: `${formData.name} has been updated.`})
    } else {
      const newItem = { ...formData, id: `menu-${Date.now()}` }
      setData([...data, newItem])
      toast({ title: "Menu Item Added", description: `${formData.name} has been added to the menu.`})
    }
    handleCloseForm()
  }

  const handleDelete = () => {
    if (!selectedMenuItem) return
    setData(data.filter(item => item.id !== selectedMenuItem.id))
    toast({ variant: "destructive", title: "Menu Item Deleted", description: `${selectedMenuItem.name} has been deleted.`})
    handleCloseDeleteAlert()
  }

  const handleToggleAvailability = (itemToToggle: MenuItem) => {
    setData(data.map(item => item.id === itemToToggle.id ? { ...item, soldOut: !item.soldOut } : item))
    toast({ title: "Availability Updated", description: `${itemToToggle.name} is now ${!itemToToggle.soldOut ? 'available' : 'sold out'}.`})
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manage Menu Items</h2>
            <p className="text-muted-foreground">
              Add, edit, and manage the dishes on your restaurant's menu.
            </p>
          </div>
          <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
        <DataTable 
          columns={columns} 
          data={data} 
          onEdit={handleOpenForm} 
          onDelete={handleOpenDeleteAlert}
          onToggleAvailability={handleToggleAvailability}
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          </DialogHeader>
          <MenuItemForm 
            initialData={selectedMenuItem}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this menu item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteAlert}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
