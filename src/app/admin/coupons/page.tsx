
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from "lucide-react"
import { Coupon } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CouponForm } from "@/components/admin/coupons/coupon-form"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

type CouponWithId = Coupon & { id: string };

export default function AdminCouponsPage() {
  const [data, setData] = useState<CouponWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithId | null>(null)
  const { toast } = useToast()

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const couponsData = querySnapshot.docs.map(doc => ({ ...doc.data() as Coupon, id: doc.id }));
      setData(couponsData);
    } catch (error) {
      console.error("Error fetching coupons: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch coupons." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);


  const handleOpenForm = (coupon: CouponWithId | null = null) => {
    setSelectedCoupon(coupon)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedCoupon(null)
    setFormOpen(false)
  }

  const handleOpenDeleteAlert = (coupon: CouponWithId) => {
    setSelectedCoupon(coupon)
    setDeleteAlertOpen(true)
  }

  const handleCloseDeleteAlert = () => {
    setSelectedCoupon(null)
    setDeleteAlertOpen(false)
  }

  const handleSubmit = async (formData: Omit<Coupon, 'id'>) => {
    try {
      if (selectedCoupon) {
        const couponDoc = doc(db, "coupons", selectedCoupon.id);
        await updateDoc(couponDoc, formData);
        toast({ title: "Coupon Updated", description: `Coupon "${formData.code}" has been updated.`})
      } else {
        await addDoc(collection(db, "coupons"), formData);
        toast({ title: "Coupon Added", description: `Coupon "${formData.code}" has been added.`})
      }
      fetchCoupons();
    } catch (error) {
      console.error("Error saving coupon: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save coupon." });
    } finally {
      handleCloseForm();
    }
  }

  const handleDelete = async () => {
    if (!selectedCoupon) return
    try {
      await deleteDoc(doc(db, "coupons", selectedCoupon.id));
      toast({ variant: "destructive", title: "Coupon Deleted", description: `Coupon "${selectedCoupon.code}" has been deleted.`})
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete coupon." });
    } finally {
      handleCloseDeleteAlert()
    }
  }

  const handleToggleStatus = async (coupon: CouponWithId) => {
    try {
      const couponDoc = doc(db, "coupons", coupon.id);
      await updateDoc(couponDoc, { isActive: !coupon.isActive });
      toast({ title: "Status Updated", description: `Coupon "${coupon.code}" status changed to ${!coupon.isActive ? 'Active' : 'Inactive'}.`})
      fetchCoupons();
    } catch (error) {
       console.error("Error updating status: ", error);
       toast({ variant: "destructive", title: "Error", description: "Failed to update coupon status." });
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manage Coupons</h2>
            <p className="text-muted-foreground">
              Here you can add, update, and remove promotional coupons.
            </p>
          </div>
          <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Coupon
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
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
          </DialogHeader>
          <CouponForm 
            initialData={selectedCoupon}
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
              This action cannot be undone. This will permanently delete the coupon.
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
