
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Chef, chefs as initialChefs } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChefForm } from "@/components/admin/chefs/chef-form"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function AdminChefsPage() {
  const [data, setData] = useState<Chef[]>(initialChefs)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null)
  const { toast } = useToast()

  const handleOpenForm = (chef: Chef | null = null) => {
    setSelectedChef(chef)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedChef(null)
    setFormOpen(false)
  }

  const handleOpenDeleteAlert = (chef: Chef) => {
    setSelectedChef(chef)
    setDeleteAlertOpen(true)
  }

  const handleCloseDeleteAlert = () => {
    setSelectedChef(null)
    setDeleteAlertOpen(false)
  }

  const handleSubmit = (formData: Omit<Chef, 'id'>) => {
    if (selectedChef) {
      // Editing existing chef
      setData(data.map(chef => chef.id === selectedChef.id ? { ...chef, ...formData } : chef))
      toast({ title: "Chef Updated", description: `${formData.name} has been updated.`})
    } else {
      // Adding new chef
      const newChef = { ...formData, id: `chef-${Date.now()}` }
      setData([...data, newChef])
      toast({ title: "Chef Added", description: `${formData.name} has been added.`})
    }
    handleCloseForm()
  }

  const handleDelete = () => {
    if (!selectedChef) return
    setData(data.filter(chef => chef.id !== selectedChef.id))
    toast({ variant: "destructive", title: "Chef Deleted", description: `${selectedChef.name} has been deleted.`})
    handleCloseDeleteAlert()
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manage Chefs</h2>
            <p className="text-muted-foreground">
              Here you can add, update, and remove chefs from your team.
            </p>
          </div>
          <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Chef
          </Button>
        </div>
        <DataTable columns={columns} data={data} onEdit={handleOpenForm} onDelete={handleOpenDeleteAlert} />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedChef ? 'Edit Chef' : 'Add New Chef'}</DialogTitle>
          </DialogHeader>
          <ChefForm 
            initialData={selectedChef}
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
              This action cannot be undone. This will permanently delete the chef
              and remove their data from our servers.
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
