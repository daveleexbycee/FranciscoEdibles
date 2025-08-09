
"use client"

import { useState, useEffect } from "react"
import { Order } from "@/lib/mock-data"
import { columns } from "./columns" 
import { DataTable } from "./data-table" 
import { useToast } from "@/hooks/use-toast"
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

type OrderWithId = Order & { id: string };

export default function AdminOrdersPage() {
  const [data, setData] = useState<OrderWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "orders"), orderBy("date", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map(doc => ({ ...doc.data() as Order, id: doc.id }));
      setData(ordersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching real-time orders: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch orders." });
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

  const handleUpdateStatus = async (orderToUpdate: OrderWithId, newStatus: Order['status']) => {
    try {
      const orderDoc = doc(db, "orders", orderToUpdate.id);
      await updateDoc(orderDoc, { status: newStatus });
      toast({ title: "Order Status Updated", description: `Order #${orderToUpdate.id.slice(-4)} is now ${newStatus}.`})
      // No need to call fetchOrders, onSnapshot will update the UI
    } catch (error) {
       console.error("Error updating status: ", error);
       toast({ variant: "destructive", title: "Error", description: "Failed to update order status." });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Orders</h2>
          <p className="text-muted-foreground">
            View and manage customer orders in real-time.
          </p>
        </div>
      </div>
       {isLoading ? (
           <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
        <DataTable 
          columns={columns} 
          data={data}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  )
}
