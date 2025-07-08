
import { chefs, menuItems, orders } from "@/lib/mock-data";
import OverviewCards from "@/components/admin/dashboard/overview-cards";
import SalesChart from "@/components/admin/dashboard/sales-chart";
import RecentOrders from "@/components/admin/dashboard/recent-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const totalRevenue = orders
    .filter(order => order.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const totalOrders = orders.length;

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your restaurant's performance.
        </p>
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
