"use client"

import { useMemo } from 'react'
import { Goal } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

interface MonthSessionData {
    total: number
}

const fetchMonthSessionsTotal = async (_startDate?: Date, _endDate?: Date): Promise<MonthSessionData> => {
    return { total: 58 }
}

interface MonthPatientsAmountCardProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function MonthPatientsAmountCard({ startDate, endDate }: MonthPatientsAmountCardProps) {
    // Substituído useState/useEffect por useQuery para cache e performance
    const { data, isLoading, isError } = useQuery({
        queryKey: ['month-sessions-total', startDate?.toISOString(), endDate?.toISOString()],
        queryFn: () => fetchMonthSessionsTotal(startDate, endDate),
        staleTime: 1000 * 60 * 5, // Cache de 5 minutos
    })

    const total = data?.total ?? null

    const { displayValue, diffSign, formattedDiff, diffColorClass } = useMemo(() => {
        if (total === null) {
            return {
                displayValue: '—',
                diffSign: '',
                formattedDiff: 0,
                diffColorClass: 'text-emerald-500 dark:text-emerald-400'
            }
        }

        const displayValue = total
        const diff = 0.12
        const formattedDiff = diff * 100
        const diffSign = formattedDiff >= 0 ? '+' : ''
        const diffColorClass =
            formattedDiff >= 0
                ? 'text-emerald-500 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'

        return { displayValue, diffSign, formattedDiff, diffColorClass }
    }, [total])

    return (
        <Card
            className={cn(
                "relative overflow-hidden rounded-2xl border border-border/60 border-b-[3px] border-b-purple-700 dark:border-b-purple-500",
                "shadow-md shadow-black/20 dark:shadow-black/8 bg-card transition-all p-4"
            )}
        >
            <div
                className={cn(
                    "absolute -top-14 -right-14 w-40 h-40 rounded-full",
                    "bg-linear-to-r from-purple-300/50 to-purple-700/30 dark:from-purple-400/70 dark:to-purple-900",
                    "blur-3xl opacity-60 pointer-events-none"
                )}
            />

            <img
                src={'/goal.svg'}
                alt="Ícone de Cérebro/Ideia"
                className={cn(
                    "absolute bottom-0 right-0",
                    "w-3xl h-auto max-w-[150px]",
                    "opacity-70",
                    "pointer-events-none",
                    "translate-x-1/4 translate-y-1/4"
                )}
            />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="rounded-full bg-purple-100/80 dark:bg-purple-950/40 p-2 w-fit">
                    <Goal className="size-5 text-purple-600 dark:text-purple-400" />
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-red-500">Erro ao carregar</span>
                        <span className="text-xs text-muted-foreground">Tente novamente</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-2xl font-semibold tracking-tight leading-none">
                            {displayValue.toLocaleString("pt-BR")}
                        </span>

                        <p className="text-[13px] text-muted-foreground font-medium leading-none">
                            Sessões realizadas no mês
                        </p>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className={cn("font-semibold", diffColorClass)}>
                                {diffSign}
                                {formattedDiff.toFixed(1)}%
                            </span>{" "}
                            em relação ao mês anterior
                        </p>
                    </div>
                )}
            </div>
        </Card>
    )
}