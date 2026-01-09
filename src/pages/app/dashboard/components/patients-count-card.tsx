"use client"

import { TrendingUp, TrendingDown, Users, AlertCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { useMemo } from "react"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientsCountCardProps {
    startDate?: Date
    endDate?: Date
}

export const PatientsCountCard = ({ startDate: propStartDate, endDate: propEndDate }: PatientsCountCardProps) => {
    const endDate = propEndDate || new Date()
    const startDate = propStartDate || subDays(endDate, 30)

    const {
        data: chartData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["dashboard", "patients-count-summary", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
    })

    const { totalPatients, formattedDiff, diffSign, diffStyle, TrendIcon } = useMemo(() => {
        if (!chartData?.length) {
            return {
                totalPatients: 0,
                formattedDiff: 0,
                diffSign: "",
                diffStyle: "bg-muted text-muted-foreground border-transparent",
                TrendIcon: TrendingUp,
            }
        }

        const total = chartData.reduce((sum, item) => sum + item.newPatients, 0)
        const diff = 0.15
        const formatted = Math.abs(diff * 100)
        const isPositive = diff >= 0

        return {
            totalPatients: total,
            formattedDiff: formatted,
            diffSign: isPositive ? "+" : "-",
            TrendIcon: isPositive ? TrendingUp : TrendingDown,
            diffStyle: isPositive
                ? "bg-[#10b981]/10 text-[#059669] border-[#10b981]/20 dark:bg-[#10b981]/20 dark:text-[#34d399]"
                : "bg-[#ef4444]/10 text-[#dc2626] border-[#ef4444]/20 dark:bg-[#ef4444]/20 dark:text-[#f87171]",
        }
    }, [chartData])

    return (
        <div
            className={cn(
                "relative overflow-hidden",
                "rounded-xl border bg-card shadow-sm",
                "p-6 transition-all duration-300 hover:shadow-md",
                "border-l-4 border-l-[#01DE82]"
            )}
        >
            <img
                src="/brain.png"
                alt="Mascote cérebro"
                className={cn(
                    "absolute -bottom-10 -right-13",
                    "w-48 h-auto opacity-[2] dark:opacity-[0.55]",
                    "pointer-events-none select-none rotate-12"
                )}
            />

            <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#01DE82]/10 p-2 border border-[#01DE82]/20">
                            <Users className="size-4 text-[#01DE82]" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                Pacientes
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Novos pacientes no período
                            </span>
                        </div>
                    </div>

                    {!isLoading && !isError && totalPatients > 0 && (
                        <Badge variant="outline" className={cn("h-6 px-2 text-[11px] font-bold gap-1 transition-colors", diffStyle)}>
                            <TrendIcon className="size-3" />
                            {diffSign}{formattedDiff.toFixed(1)}%
                        </Badge>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center gap-2 text-red-500 py-2">
                        <AlertCircle className="size-4" />
                        <span className="text-sm font-medium">Erro ao carregar dados</span>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
                                {totalPatients.toLocaleString("pt-BR")}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}