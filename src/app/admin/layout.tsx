
"use client"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Users, Utensils, ShoppingBag, Settings, Flame, Ticket } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/chefs", label: "Chefs", icon: Users },
    { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    { href: "/admin/menu", label: "Menu Items", icon: Utensils },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Flame className="h-7 w-7 text-sidebar-primary" />
            <span className="font-headline text-xl font-bold tracking-wide">Francisco Edibles</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
           <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden"/>
            <h1 className="text-xl font-semibold hidden md:block">Admin</h1>
           </div>
           {/* Maybe user avatar here */}
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
