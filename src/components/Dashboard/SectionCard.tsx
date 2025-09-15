import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCard({
  heading,
  amount,
  percent,
  details,
}: {
  heading: string
  amount: number
  percent: number
  details: {text: string}[]
}
) {
  return (
      <Card className="flex flex-col h-full w-full gap-0 justify-between bg-app-white">
        <CardHeader>
          <CardDescription>{heading}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {amount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {percent>0 && <IconTrendingUp />}
              {percent<0 && <IconTrendingDown />}
              {percent>0 ? "+":""}{percent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {details[0]?.text} 
            {percent>0 && <IconTrendingUp className="size-4" />} 
            {percent<0 && <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {details[0]?.text}
          </div>
        </CardFooter>
      </Card>
  )
}
