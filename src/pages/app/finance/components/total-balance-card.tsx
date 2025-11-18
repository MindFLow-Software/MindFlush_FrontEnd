import { DollarSign } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const TotalBalanceCard = () => {

    const displayValue = "R$ 0,00"
    const description = "Total disponível"

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-2xl",
                "border border-border/60 border-b-[3px] border-b-blue-700 dark:border-b-blue-500",
                "shadow-md shadow-black/20 dark:shadow-black/8",
                "bg-card transition-all",
                "p-4"
            )}
        >
            {/* Glow circular */}
            <div
                className={cn(
                    "absolute -top-14 -right-14",
                    "w-40 h-40 rounded-full",
                    "bg-gradient-to-r from-blue-400/50 to-blue-700/30 dark:from-blue-400/70 dark:to-blue-900",
                    "blur-3xl opacity-60 pointer-events-none"
                )}
            />

            <div className="relative z-10 flex flex-col gap-4">

                {/* Ícone */}
                <div className="rounded-full bg-blue-100/80 dark:bg-blue-950/40 p-2 w-fit">
                    <DollarSign className="size-5 text-blue-700 dark:text-blue-400" />
                </div>

                {/* Valor e descrição */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-2xl font-semibold tracking-tight leading-none">
                        {displayValue}
                    </span>
                    <p className="text-[13px] text-muted-foreground font-medium leading-none">
                        {description}
                    </p>
                </div>
            </div>
        </Card>
    )
}
