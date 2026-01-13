"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, Users } from "lucide-react"

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
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"

interface NewPatientsBarChartProps {
    endDate: Date | undefined
}

const chartConfig = {
    newPatients: {
        label: "Pacientes",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function NewPatientsBarChart({ endDate }: NewPatientsBarChartProps) {
    const [timeRange, setTimeRange] = React.useState("30d")

    const { startDateToFetch, endDateToFetch } = React.useMemo(() => {
        const referenceDate = endDate ? new Date(endDate) : new Date()
        let daysToSubtract = 30

        if (timeRange === "30d") daysToSubtract = 30
        if (timeRange === "7d") daysToSubtract = 7

        return {
            startDateToFetch: startOfDay(subDays(referenceDate, daysToSubtract)),
            endDateToFetch: endOfDay(referenceDate),
        }
    }, [timeRange, endDate])

    const { data: chartData, isLoading } = useQuery({
        queryKey: ["patients-stats", startDateToFetch, endDateToFetch],
        queryFn: () =>
            getAmountPatientsChart({
                startDate: startDateToFetch,
                endDate: endDateToFetch,
            }),
        enabled: !!startDateToFetch && !!endDateToFetch,
    })

    const { total, isEmpty } = React.useMemo(() => {
        const totalCount = chartData?.reduce((acc, curr) => acc + curr.newPatients, 0) ?? 0
        return {
            total: totalCount,
            isEmpty: !chartData || chartData.length === 0 || totalCount === 0
        }
    }, [chartData])

    return (
        <Card className="col-span-full lg:col-span-6 border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4">
                    <CardTitle className="text-base font-semibold">Fluxo de Pacientes</CardTitle>
                    <CardDescription className="text-sm">
                        Novos cadastros realizados no período
                    </CardDescription>
                </div>
                <div className="flex border-t sm:border-t-0 sm:border-l">
                    <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Total Geral
                        </span>
                        <span className="text-xl font-bold leading-none sm:text-2xl">
                            {total.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center pr-4">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger
                                className="w-[140px] cursor-pointer rounded-lg bg-muted/50 border-none focus:ring-0"
                                aria-label="Selecionar período"
                            >
                                <SelectValue placeholder="Período" />
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
                ) : isEmpty ? (
                    <div className="flex h-[250px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                            <Users className="h-5 w-5 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Nenhum paciente</p>
                        <p className="mt-1 text-xs text-slate-400">Sem novos cadastros neste período</p>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
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
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => format(new Date(value), "dd 'de' MMMM", { locale: ptBR })}
                                        indicator="dashed"
                                    />
                                }
                            />
                            <Bar
                                dataKey="newPatients"
                                fill="var(--color-newPatients)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}