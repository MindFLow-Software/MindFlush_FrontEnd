"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarOff, Loader2, RefreshCcw, AlertCircle } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getDailySessionsMetrics } from "@/api/get-daily-sessions-metrics"

interface SessionsBarChartProps {
    endDate: Date | undefined
}

const chartConfig = {
    count: {
        label: "Sessões",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function SessionsBarChart({ endDate }: SessionsBarChartProps) {
    const [timeRange, setTimeRange] = React.useState("30d")

    const { startDateToFetch, endDateToFetch } = React.useMemo(() => {
        const referenceDate = endDate ? new Date(endDate) : new Date()
        let daysToSubtract = 30

        if (timeRange === "90d") daysToSubtract = 90
        if (timeRange === "7d") daysToSubtract = 7

        return {
            startDateToFetch: startOfDay(subDays(referenceDate, daysToSubtract)),
            endDateToFetch: endOfDay(referenceDate)
        }
    }, [timeRange, endDate])

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["daily-sessions-bar", startDateToFetch.toISOString(), endDateToFetch.toISOString()],
        queryFn: () => getDailySessionsMetrics(
            startDateToFetch.toISOString(),
            endDateToFetch.toISOString()
        ),
        enabled: !!startDateToFetch && !!endDateToFetch,
        staleTime: 1000 * 60 * 5,
    })

    const { chartData, totalSessions, isEmpty } = React.useMemo(() => {
        const sessions = data || []
        const total = sessions.reduce((acc, d) => acc + d.count, 0)
        return {
            chartData: sessions,
            totalSessions: total,
            isEmpty: sessions.length === 0 || total === 0
        }
    }, [data])

    return (
        <Card className="col-span-full lg:col-span-6 border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4">
                    <CardTitle className="text-base font-semibold">Atendimentos</CardTitle>
                    <CardDescription className="text-sm">
                        Volume diário de sessões concluídas
                    </CardDescription>
                </div>
                <div className="flex border-t sm:border-t-0 sm:border-l">
                    <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 border-r sm:border-r-0">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Total Geral
                        </span>
                        <span className="text-xl font-bold leading-none sm:text-2xl">
                            {totalSessions.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center px-4">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger
                                className="w-[140px] cursor-pointer rounded-lg bg-muted/50 border-none focus:ring-0"
                                aria-label="Selecionar período"
                            >
                                <SelectValue placeholder="Últimos 30 dias" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="90d" className="cursor-pointer rounded-lg">90 dias</SelectItem>
                                <SelectItem value="30d" className="cursor-pointer rounded-lg">30 dias</SelectItem>
                                <SelectItem value="7d" className="cursor-pointer rounded-lg">7 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {isLoading ? (
                    <div className="flex h-[250px] w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex h-[250px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <AlertCircle className="size-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Erro ao carregar dados</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                        >
                            <RefreshCcw size={12} /> Tentar novamente
                        </button>
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-[250px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                            <CalendarOff className="h-5 w-5 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Nenhuma sessão</p>
                        <p className="mt-1 text-xs text-slate-400">Sem atendimentos neste período</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ left: 0, right: 0, top: 10 }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => format(new Date(value), "dd MMM", { locale: ptBR })}
                            />
                            <YAxis
                                hide
                                domain={[0, 'auto']}
                            />
                            <ChartTooltip
                                cursor={{ fill: "#f8fafc", radius: 8 }}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => format(new Date(value), "dd 'de' MMMM", { locale: ptBR })}
                                        indicator="dashed"
                                    />
                                }
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--color-count)"
                                radius={[4, 4, 0, 0]}
                                barSize={timeRange === "7d" ? 40 : 12}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}