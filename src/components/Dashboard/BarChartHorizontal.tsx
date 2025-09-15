
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A horizontal bar chart"

const chartData = [
  { day: "Sun", desktop: 186 },
  { day: "Mon", desktop: 305 },
  { day: "Tue", desktop: 237 },
  { day: "Wed", desktop: 73 },
  { day: "Thu", desktop: 209 },
  { day: "Fri", desktop: 214 },
  { day: "Sat", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function BarChartHorizontal() {
  return (
    <Card className="flex flex-col h-full w-full gap-0 justify-between">
      <CardHeader>
        <CardTitle>Order frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="flex flex-col mx-auto aspect-square h-full w-full items-center justify-center justify-self-center">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
            width={300}
            height={500}
          >
            <XAxis type="number" dataKey="desktop" hide />
            <YAxis
              dataKey="day"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={30}/>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
