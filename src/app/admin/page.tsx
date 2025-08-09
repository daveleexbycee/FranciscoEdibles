
"use client"

import { useState, useEffect } from "react";
import { Chef, MenuItem, Order } from "@/lib/mock-data";
import OverviewCards from "@/components/admin/dashboard/overview-cards";
import SalesChart from "@/components/admin/dashboard/sales-chart";
import RecentOrders from "@/components/admin/dashboard/recent-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderWithId = Order & { id: string };

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [originalOrders, setOriginalOrders] = useState<OrderWithId[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersSnap, chefsSnap, menuItemsSnap] = await Promise.all([
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "chefs")),
        getDocs(collection(db, "menuItems")),
      ]);

      const ordersData = ordersSnap.docs.map(doc => ({ ...doc.data() as Order, id: doc.id }));
      setOrders(ordersData);
      setOriginalOrders(ordersData); // Keep a copy of the original data

      const chefsData = chefsSnap.docs.map(doc => doc.data() as Chef);
      setChefs(chefsData);

      const menuItemsData = menuItemsSnap.docs.map(doc => doc.data() as MenuItem);
      setMenuItems(menuItemsData);

    } catch (error) {
      console.error("Error fetching dashboard data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleReset = () => {
    setOrders([]);
  }

  const handleReload = () => {
    setOrders(originalOrders);
  }

  const totalRevenue = orders
    .filter(order => order.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const totalOrders = orders.length;

  if (isLoading) {
    return (
       <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              An overview of your restaurant's performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>Reset Data</Button>
            <Button onClick={handleReload}><RotateCw className="mr-2" /> Reload Data</Button>
          </div>
        </div>
      
      <OverviewCards 
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        chefCount={chefs.length}
        menuItemCount={menuItems.length}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={orders} />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
           <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders data={orders} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
