import { TrendingUp } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { useMemo } from "react"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"
import { cn } from "@/lib/utils"

// NOTE: Se você estiver usando um framework como Next.js, 
// é altamente recomendado importar a imagem no topo e usar o componente Image.

interface PatientsCountCardProps {
    startDate?: Date
    endDate?: Date
}

export const PatientsCountCard = ({
    startDate: propStartDate,
    endDate: propEndDate
}: PatientsCountCardProps) => {

    const endDate = propEndDate || new Date()
    const startDate = propStartDate || subDays(endDate, 30)

    const { data: chartData, isLoading, isError } = useQuery({
        queryKey: [
            "dashboard",
            "patients-count-summary",
            startDate.toISOString(),
            endDate.toISOString()
        ],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
    })

    const { totalPatients, formattedDiff, diffSign, diffColorClass } = useMemo(() => {
        if (!chartData?.length) {
            return {
                totalPatients: 0,
                formattedDiff: 0,
                diffSign: "",
                diffColorClass: "text-emerald-500 dark:text-emerald-400"
            }
        }

        const total = chartData.reduce((sum, item) => sum + item.newPatients, 0)

        const diff = 0.05 // mock
        const formatted = diff * 100
        const sign = formatted >= 0 ? "+" : ""
        const colorClass =
            formatted >= 0
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"

        return {
            totalPatients: total,
            formattedDiff: formatted,
            diffSign: sign,
            diffColorClass: colorClass,
        }
    }, [chartData])

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
            {/* 1. SEU GRADIENTE ABSOLUTO (MANTIDO) */}
            <div
                className={cn(
                    "absolute -top-14 -right-14",
                    "w-40 h-40 rounded-full",
                    "bg-linear-to-r from-emerald-400/50 to-emerald-700/30 dark:from-emerald-400/70 dark:to-emerald-900",
                    "blur-3xl opacity-60 pointer-events-none"
                )}
            />

            <img
                src={'/brain.png'}
                alt="Ícone de Cérebro/Ideia"
                className={cn(
                    "absolute bottom-0 right-0", // Posição
                    "w-3xl h-auto max-w-[200px]", // Tamanho
                    "opacity-70", // <-- Novo: Valor único para Light e Dark
                    "pointer-events-none",        // Garante que não interfira no clique
                    "translate-x-1/4 translate-y-1/4" // Move a imagem para fora do Card ligeiramente
                )}
            />

            <div className="relative z-10 flex flex-col gap-4">

                <div className="rounded-full bg-emerald-100/80 dark:bg-emerald-950/40 p-2 w-fit">
                    <TrendingUp className="size-5 text-emerald-700 dark:text-emerald-400" />
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
                            {totalPatients.toLocaleString("pt-BR")}
                        </span>

                        <p className="text-[13px] text-muted-foreground font-medium leading-none">
                            Novos pacientes
                        </p>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className={cn("font-semibold", diffColorClass)}>
                                {diffSign}
                                {formattedDiff.toFixed(1)}%
                            </span>{" "}
                            em relação ao período anterior
                        </p>
                    </div>
                )}
            </div>
        </Card>
    )
}