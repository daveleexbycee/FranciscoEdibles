
"use client"

import { Order } from "@/lib/mock-data"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface SalesChartProps {
    data: Order[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const monthlyRevenue = data
    .filter(order => order.status === 'Delivered')
    .reduce((acc, order) => {
        const month = new Date(order.date).toLocaleString('default', { month: 'short' });
        const year = new Date(order.date).getFullYear();
        const key = `${month} ${year}`;
        if (!acc[key]) {
            acc[key] = { name: month, total: 0 };
        }
        acc[key].total += order.total;
        return acc;
    }, {} as { [key: string]: { name: string; total: number } });

  const chartData = Object.values(monthlyRevenue).sort((a,b) => new Date(a.name + " 1, 2024").getMonth() - new Date(b.name + " 1, 2024").getMonth());

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₦${Number(value) / 1000}k`}
        />
        <Tooltip 
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{ 
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)'
          }}
          formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
