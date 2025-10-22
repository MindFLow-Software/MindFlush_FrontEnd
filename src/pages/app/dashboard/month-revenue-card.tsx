import { DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MonthRevenueCard() {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-2">
        <CardTitle className="flex items-center justify-between text-sm sm:text-base font-semibold">
          <span className="leading-tight">Receita total (mês)</span>
          <DollarSign className="size-4 sm:size-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-xl sm:text-2xl font-bold tracking-tight">R$ 1248,60</span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-emerald-500 dark:text-emerald-400">+2%</span> em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  )
}
