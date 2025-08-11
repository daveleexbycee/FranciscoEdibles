
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from "lucide-react"
import { Chef } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChefForm } from "@/components/admin/chefs/chef-form"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

type ChefWithId = Chef & { id: string };

export default function AdminChefsPage() {
  const [data, setData] = useState<ChefWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [selectedChef, setSelectedChef] = useState<ChefWithId | null>(null)
  const { toast } = useToast()

  const fetchChefs = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "chefs"));
      const chefsData = querySnapshot.docs.map(doc => ({ ...doc.data() as Chef, id: doc.id }));
      setData(chefsData);
    } catch (error) {
      console.error("Error fetching chefs: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch chefs from the database." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleOpenForm = (chef: ChefWithId | null = null) => {
    setSelectedChef(chef)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedChef(null)
    setFormOpen(false)
  }

  const handleOpenDeleteAlert = (chef: ChefWithId) => {
    setSelectedChef(chef)
    setDeleteAlertOpen(true)
  }

  const handleCloseDeleteAlert = () => {
    setSelectedChef(null)
    setDeleteAlertOpen(false)
  }

  const handleSubmit = async (formData: Omit<Chef, 'id'>) => {
    try {
      if (selectedChef) {
        // Editing existing chef
        const chefDoc = doc(db, "chefs", selectedChef.id);
        await updateDoc(chefDoc, formData);
        toast({ title: "Chef Updated", description: `${formData.name} has been updated.`});
      } else {
        // Adding new chef
        await addDoc(collection(db, "chefs"), formData);
        toast({ title: "Chef Added", description: `${formData.name} has been added.`});
      }
      fetchChefs(); // Refresh data
    } catch (error) {
       console.error("Error saving chef: ", error);
       toast({ variant: "destructive", title: "Error", description: "Failed to save chef." });
    } finally {
      handleCloseForm()
    }
  }

  const handleDelete = async () => {
    if (!selectedChef) return
    try {
      await deleteDoc(doc(db, "chefs", selectedChef.id));
      toast({ variant: "destructive", title: "Chef Deleted", description: `${selectedChef.name} has been deleted.`});
      fetchChefs(); // Refresh data
    } catch (error) {
       console.error("Error deleting chef: ", error);
       toast({ variant: "destructive", title: "Error", description: "Failed to delete chef." });
    } finally {
      handleCloseDeleteAlert()
    }
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={data} onEdit={handleOpenForm} onDelete={handleOpenDeleteAlert} />
        )}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
