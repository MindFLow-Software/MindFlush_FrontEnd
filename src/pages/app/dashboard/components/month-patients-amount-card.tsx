"use client"

import { useMemo } from "react"
import { Goal, TrendingUp, TrendingDown, AlertCircle, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getMonthlySessionsCount } from "@/api/get-monthly-sessions-count"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

interface MonthPatientsAmountCardProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function MonthPatientsAmountCard({ startDate, endDate }: MonthPatientsAmountCardProps) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [
            "month-sessions-count",
            startDate?.toISOString(),
            endDate?.toISOString()
        ],
        queryFn: () => getMonthlySessionsCount({
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
        }),
        staleTime: 1000 * 60 * 5,
    })

    const total = data?.count ?? null

    const trend = useMemo(() => {
        if (total === null) return null
        const diff = 0.12 // Simulação de backend
        const isPositive = diff >= 0

        return {
            value: Math.abs(diff * 100).toFixed(1),
            isPositive,
            label: isPositive ? "+" : "-",
            icon: isPositive ? TrendingUp : TrendingDown,
            style: isPositive
                ? "bg-[#10b981]/10 text-[#059669] border-[#10b981]/20 dark:bg-[#10b981]/20 dark:text-[#34d399]"
                : "bg-[#ef4444]/10 text-[#dc2626] border-[#ef4444]/20 dark:bg-[#ef4444]/20 dark:text-[#f87171]"
        }
    }, [total])

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-xl border bg-card shadow-sm",
                "p-6 transition-all duration-300 hover:shadow-md",
                "border-l-4 border-l-[#5a189a]"
            )}
        >
            <img
                src="/goal.svg"
                alt="Mascote"
                className={cn(
                    "absolute -bottom-7 -right-10",
                    "w-32 h-auto opacity-[2] dark:opacity-[0.55]",
                    "pointer-events-none select-none"
                )}
            />

            <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#5a189a]/10 p-2 border border-[#5a189a]/20">
                            <Goal className="size-4 text-[#5a189a]" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                Sessões do Mês
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Volume total de atendimentos
                            </span>
                        </div>
                    </div>

                    {!isLoading && !isError && trend && (
                        <Badge variant="outline" className={cn("h-6 px-2 text-[11px] font-bold gap-1 transition-all", trend.style)}>
                            <trend.icon className="size-3" />
                            {trend.label}{trend.value}%
                        </Badge>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-start gap-2 py-1">
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="size-4" />
                            <span className="text-sm font-medium">Erro ao carregar</span>
                        </div>
                        <button onClick={() => refetch()} className="group flex items-center gap-1.5 text-xs text-[#5a189a] font-semibold hover:underline">
                            <RefreshCcw className="size-3 transition-transform group-hover:rotate-180 duration-500" />
                            Tentar novamente
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
                                {total?.toLocaleString("pt-BR") ?? "0"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}