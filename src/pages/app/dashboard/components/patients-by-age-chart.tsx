"use client"

import * as React from "react"
import { Cell, Pie, PieChart } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { subDays, startOfDay, endOfDay } from "date-fns"
import { Loader2, Users, AlertCircle, RefreshCcw } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { api } from "@/lib/axios"

interface AgeStats {
    ageRange: string
    patients: number
}

async function getPatientsByAgeStats(params: { startDate?: string; endDate?: string }): Promise<AgeStats[]> {
    const response = await api.get<AgeStats[]>("/patients/stats/age", { params })
    return response.data
}

const chartConfig = {
    patients: {
        label: "Pacientes",
    },
} satisfies ChartConfig

const CHART_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]

interface PatientsByAgeChartProps {
    endDate: Date | undefined
}

export function PatientsByAgeChart({ endDate }: PatientsByAgeChartProps) {
    const [timeRange] = React.useState("90d")

    // 🟢 Cálculo interno do período baseado apenas no endDate
    const { startDateToFetch, endDateToFetch } = React.useMemo(() => {
        const referenceDate = endDate ? new Date(endDate) : new Date()
        let daysToSubtract = 90

        if (timeRange === "30d") daysToSubtract = 30
        if (timeRange === "7d") daysToSubtract = 7

        return {
            startDateToFetch: startOfDay(subDays(referenceDate, daysToSubtract)),
            endDateToFetch: endOfDay(referenceDate),
        }
    }, [timeRange, endDate])

    const { data, isLoading, isError, refetch } = useQuery<AgeStats[]>({
        queryKey: ['dashboard', 'age-stats', startDateToFetch, endDateToFetch],
        queryFn: () => getPatientsByAgeStats({
            startDate: startDateToFetch.toISOString(),
            endDate: endDateToFetch.toISOString()
        }),
        enabled: !!startDateToFetch && !!endDateToFetch,
        staleTime: 1000 * 60 * 5,
    })

    const { totalPatients, isEmpty } = React.useMemo(() => {
        const total = data?.reduce((sum, item) => sum + item.patients, 0) ?? 0
        return {
            totalPatients: total,
            isEmpty: !data || data.length === 0 || total === 0
        }
    }, [data])

    return (
        <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4">
                    <CardTitle className="text-base font-semibold uppercase tracking-wider">Faixa Etária</CardTitle>
                    <CardDescription className="text-sm">
                        Distribuição demográfica no período
                    </CardDescription>
                </div>
                <div className="flex border-t sm:border-t-0 sm:border-l">
                    <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Total Geral
                        </span>
                        <span className="text-xl font-bold leading-none sm:text-2xl">
                            {totalPatients.toLocaleString()}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pt-6 pb-6 flex-1 flex flex-col">
                {isLoading ? (
                    <div className="flex h-[300px] w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex h-[300px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <AlertCircle className="size-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Erro ao carregar dados</p>
                        <button onClick={() => refetch()} className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                            <RefreshCcw size={12} /> Tentar novamente
                        </button>
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-[300px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                            <Users className="h-5 w-5 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Sem dados demográficos</p>
                        <p className="mt-1 text-xs text-slate-400">Não há pacientes neste período</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 min-h-[250px] flex items-center justify-center">
                            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] w-full">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie
                                        data={data}
                                        dataKey="patients"
                                        nameKey="ageRange"
                                        innerRadius={70}
                                        outerRadius={90}
                                        strokeWidth={5}
                                        stroke="hsl(var(--background))"
                                        paddingAngle={2}
                                    >
                                        {data?.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-6 border-t border-slate-100 mt-6">
                            {data?.map((item, index) => {
                                const percentage = ((item.patients / totalPatients) * 100).toFixed(1)
                                return (
                                    <div key={item.ageRange} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-2.5">
                                            <div
                                                className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                            />
                                            <span className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                                                {item.ageRange}
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-bold tabular-nums">
                                            {percentage}%
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}