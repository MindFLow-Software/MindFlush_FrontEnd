import { Tag } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const DiscountValueCard = () => {
    const displayValue = "R$ 0,00"
    const description = "Valor em descontos concedidos"

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-2xl",
                "border border-border/60 border-b-[3px] border-b-rose-700 dark:border-b-rose-500",
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
                    "bg-gradient-to-r from-rose-400/50 to-rose-700/30 dark:from-rose-400/70 dark:to-rose-900",
                    "blur-3xl opacity-60 pointer-events-none"
                )}
            />

            <div className="relative z-10 flex flex-col gap-4">

                {/* Ícone */}
                <div className="rounded-full bg-rose-100/80 dark:bg-rose-950/40 p-2 w-fit">
                    <Tag className="size-5 text-rose-700 dark:text-rose-400" />
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
