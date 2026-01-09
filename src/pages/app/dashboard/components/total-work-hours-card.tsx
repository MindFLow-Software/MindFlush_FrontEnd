"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Clock, AlertCircle } from "lucide-react"
import { getTotalWorkHours } from "@/api/get-total-work-hours"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface TotalWorkHoursCardProps {
    startDate?: Date
    endDate?: Date
}

const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
}

export const TotalWorkHoursCard = ({ startDate, endDate }: TotalWorkHoursCardProps) => {
    const [state, setState] = useState({
        totalMinutes: null as number | null,
        isLoading: true,
        isError: false,
    })

    useEffect(() => {
        setState(prev => ({ ...prev, isLoading: true }))

        getTotalWorkHours(startDate, endDate)
            .then((data) =>
                setState({
                    totalMinutes: data.totalMinutes,
                    isLoading: false,
                    isError: false,
                })
            )
            .catch(() =>
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    isError: true,
                }))
            )
    }, [startDate, endDate])

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-xl border bg-card shadow-sm",
                "p-6 transition-all duration-300 hover:shadow-md",
                "border-l-4 border-l-[#a40c2c]"
            )}
        >
            <img
                src="/timer-svgrepo-com.svg"
                alt="Ícone decorativo"
                className={cn(
                    "absolute -bottom-7 -right-10",
                    "w-32 h-auto opacity-[2] dark:opacity-[0.55]",
                    "pointer-events-none select-none"
                )}
            />

            <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-start gap-3">
                    {/* Corrigido para usar a opacidade correta do seu hex */}
                    <div className="rounded-lg bg-[#a40c2c]/10 p-2 border border-[#a40c2c]/20">
                        <Clock className="size-4 text-[#a40c2c]" />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Horas de Atendimento
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Sessões finalizadas no período
                        </span>
                    </div>
                </div>

                {state.isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                ) : state.isError ? (
                    <div className="flex items-center gap-2 text-red-500 py-2">
                        <AlertCircle className="size-4" />
                        <span className="text-sm font-medium">
                            Erro ao carregar dados
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tight tabular-nums">
                                {state.totalMinutes !== null
                                    ? formatTime(state.totalMinutes)
                                    : "0m"}
                            </span>
                        </div>
                    </div>
                )}

            </div>
        </Card>
    )
}