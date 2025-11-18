"use client"

import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useMemo } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { Loader2 } from "lucide-react"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"

const chartConfig = {
    newPatients: {
        label: "Novos Pacientes",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

interface NewPatientsBarChartProps {
    startDate?: Date
    endDate?: Date
}

export function NewPatientsBarChart({ startDate: propStartDate, endDate: propEndDate }: NewPatientsBarChartProps) {
    const { startDate, endDate } = useMemo(() => {
        const end = propEndDate || new Date()
        const start = propStartDate || subDays(end, 7)
        return { startDate: start, endDate: end }
    }, [propStartDate, propEndDate])

    const { data, isLoading, isError } = useQuery({
        queryKey: ["new-patients-bar", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
        retry: 1,
    })

    const chartData = useMemo(() => data || [], [data])
    const maxPatients = useMemo(() => Math.max(...chartData.map(d => d.newPatients), 0), [chartData])
    const yAxisMax = useMemo(() => Math.max(10, maxPatients + Math.ceil(maxPatients * 0.2)), [maxPatients])

    if (isLoading) {
        return (
            <Card className="col-span-6 flex h-[250px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </Card>
        )
    }

    if (isError || chartData.length === 0) {
        return (
            <Card className="col-span-6 flex h-[250px] items-center justify-center text-muted-foreground">
                Erro ao carregar dados do gráfico
            </Card>
        )
    }

    return (
        <Card className="col-span-6 py-0">
            <CardHeader className="px-6 pt-5 pb-3">
                <CardTitle className="text-base font-medium">
                    Novos Pacientes por Dia
                </CardTitle>
                <CardDescription>
                    Quantidade diária de novos pacientes cadastrados
                </CardDescription>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />

                        <YAxis
                            domain={[0, yAxisMax]}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={20}
                            tickFormatter={(value) =>
                                format(new Date(value), "dd/MM", { locale: ptBR })
                            }
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[160px]"
                                    nameKey="newPatients"
                                    labelFormatter={(value) =>
                                        format(new Date(value), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                    }
                                />
                            }
                        />

                        <Bar dataKey="newPatients" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
