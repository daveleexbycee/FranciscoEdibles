import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Utensils, DollarSign, ShoppingBag } from "lucide-react"

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Revenue", value: "₦1,250,430", icon: DollarSign, change: "+20.1% from last month" },
    { title: "Total Orders", value: "+2350", icon: ShoppingBag, change: "+180.1% from last month" },
    { title: "Chefs", value: "3", icon: Users, change: "Active" },
    { title: "Menu Items", value: "6", icon: Utensils, change: "Available" },
  ]

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your restaurant's performance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground border">
        <p>Charts and recent activity will be displayed here.</p>
      </div>
    </div>
  )
}
