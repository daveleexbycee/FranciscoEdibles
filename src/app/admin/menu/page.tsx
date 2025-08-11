
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from "lucide-react"
import { MenuItem } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MenuItemForm } from "@/components/admin/menu/menu-item-form"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

type MenuItemWithId = MenuItem & { id: string };

export default function AdminMenuPage() {
  const [data, setData] = useState<MenuItemWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemWithId | null>(null)
  const { toast } = useToast()

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      const menuItemsData = querySnapshot.docs.map(doc => ({ ...doc.data() as MenuItem, id: doc.id }));
      setData(menuItemsData);
    } catch (error) {
      console.error("Error fetching menu items: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch menu items." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleOpenForm = (item: MenuItemWithId | null = null) => {
    setSelectedMenuItem(item)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedMenuItem(null)
    setFormOpen(false)
  }

  const handleOpenDeleteAlert = (item: MenuItemWithId) => {
    setSelectedMenuItem(item)
    setDeleteAlertOpen(true)
  }

  const handleCloseDeleteAlert = () => {
    setSelectedMenuItem(null)
    setDeleteAlertOpen(false)
  }

  const handleSubmit = async (formData: Omit<MenuItem, 'id'>) => {
    try {
      if (selectedMenuItem) {
        const itemDoc = doc(db, "menuItems", selectedMenuItem.id);
        await updateDoc(itemDoc, formData);
        toast({ title: "Menu Item Updated", description: `${formData.name} has been updated.`})
      } else {
        await addDoc(collection(db, "menuItems"), formData);
        toast({ title: "Menu Item Added", description: `${formData.name} has been added to the menu.`})
      }
      fetchMenuItems();
    } catch (error) {
      console.error("Error saving menu item: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save menu item." });
    } finally {
      handleCloseForm()
    }
  }

  const handleDelete = async () => {
    if (!selectedMenuItem) return
    try {
      await deleteDoc(doc(db, "menuItems", selectedMenuItem.id));
      toast({ variant: "destructive", title: "Menu Item Deleted", description: `${selectedMenuItem.name} has been deleted.`})
      fetchMenuItems();
    } catch (error) {
      console.error("Error deleting menu item: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete menu item." });
    } finally {
      handleCloseDeleteAlert()
    }
  }

  const handleToggleAvailability = async (itemToToggle: MenuItemWithId) => {
    try {
      const itemDoc = doc(db, "menuItems", itemToToggle.id);
      await updateDoc(itemDoc, { soldOut: !itemToToggle.soldOut });
      toast({ title: "Availability Updated", description: `${itemToToggle.name} is now ${!itemToToggle.soldOut ? 'available' : 'sold out'}.`})
      fetchMenuItems();
    } catch (error) {
      console.error("Error updating availability: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update availability." });
    }
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
        {isLoading ? (
           <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={data} 
            onEdit={handleOpenForm} 
            onDelete={handleOpenDeleteAlert}
            onToggleAvailability={handleToggleAvailability}
          />
        )}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
