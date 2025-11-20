import { DollarSign } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface TotalBalanceCardProps {
    balance?: number
    diff?: number // percentual de variação em relação ao período anterior
    isLoading?: boolean
    isError?: boolean
}

export const TotalBalanceCard = ({
    balance = 0,
    diff = 0,
    isLoading = false,
    isError = false
}: TotalBalanceCardProps) => {

    const { formattedDiff, diffSign, diffColorClass } = useMemo(() => {
        const sign = diff >= 0 ? "+" : ""
        const colorClass =
            diff >= 0
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
        return {
            formattedDiff: diff.toFixed(1),
            diffSign: sign,
            diffColorClass: colorClass
        }
    }, [diff])

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-2xl",
                "border border-border/60 border-b-[3px] border-b-green-700 dark:border-b-green-500",
                "shadow-md shadow-black/20 dark:shadow-black/8",
                "bg-card transition-all",
                "p-4"
            )}

        >

            <img
                src={'/money.png'}
                alt="Ícone de Cérebro/Ideia"
                className={cn(
                    "absolute bottom-0 right-0", // Posição
                    "w-3xl h-auto max-w-[150px]", // Tamanho
                    "opacity-60", // <-- Novo: Valor único para Light e Dark
                    "pointer-events-none",        // Garante que não interfira no clique
                    "translate-x-1/4 translate-y-1/4" // Move a imagem para fora do Card ligeiramente
                )}
            />

            
            {/* Glow circular */}
            <div
                className={cn(
                    "absolute -top-14 -right-14",
                    "w-40 h-40 rounded-full",
                    "bg-gradient-to-r from-green-400/50 to-green-700/30 dark:from-green-400/70 dark:to-green-900",
                    "blur-3xl opacity-60 pointer-events-none"
                )}
            />

            <div className="relative z-10 flex flex-col gap-4">

                {/* Ícone */}
                <div className="rounded-full bg-green-100/80 dark:bg-green-950/40 p-2 w-fit">
                    <DollarSign className="size-5 text-green-700 dark:text-green-400" />
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-3 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-red-500">Erro ao carregar</span>
                        <span className="text-xs text-muted-foreground">Tente novamente</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-2xl font-semibold tracking-tight leading-none">
                            {balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                        <p className="text-[13px] text-muted-foreground font-medium leading-none">
                            Total disponível
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className={cn("font-semibold", diffColorClass)}>
                                {diffSign}{formattedDiff}%
                            </span>{" "}
                            em relação ao período anterior
                        </p>
                    </div>
                )}
            </div>
        </Card>
    )
}
