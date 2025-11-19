"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

// Dados simulados expandidos para o formato interativo (Online vs Presencial)
const chartData = [
    { date: '2024-12-01', online: 3, presencial: 2 },
    { date: '2024-12-02', online: 5, presencial: 3 },
    { date: '2024-12-03', online: 4, presencial: 4 },
    { date: '2024-12-04', online: 6, presencial: 2 },
    { date: '2024-12-05', online: 7, presencial: 5 },
    { date: '2024-12-06', online: 5, presencial: 3 },
    { date: '2024-12-07', online: 2, presencial: 1 },
    { date: '2024-12-08', online: 1, presencial: 0 },
    { date: '2024-12-09', online: 4, presencial: 4 },
    { date: '2024-12-10', online: 5, presencial: 2 },
    { date: '2024-12-11', online: 6, presencial: 3 },
    { date: '2024-12-12', online: 4, presencial: 2 },
    { date: '2024-12-13', online: 7, presencial: 4 },
    { date: '2024-12-14', online: 8, presencial: 5 },
    { date: '2024-12-15', online: 3, presencial: 1 },
    { date: '2024-12-16', online: 5, presencial: 4 },
    { date: '2024-12-17', online: 6, presencial: 3 },
    { date: '2024-12-18', online: 4, presencial: 5 },
    { date: '2024-12-19', online: 7, presencial: 2 },
    { date: '2024-12-20', online: 5, presencial: 3 },
]

const chartConfig = {
    views: {
        label: "Sessões",
    },
    online: {
        label: "Online",
        color: "var(--chart-5)",
    },
    presencial: {
        label: "Presencial",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

interface SessionsChartProps {
    startDate?: Date
    endDate?: Date
}

export function SessionsChart({ }: SessionsChartProps) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("online")

    const total = React.useMemo(
        () => ({
            online: chartData.reduce((acc, curr) => acc + curr.online, 0),
            presencial: chartData.reduce((acc, curr) => acc + curr.presencial, 0),
        }),
        []
    )

    return (
        <Card className="col-span-6 py-4 sm:py-0"> {/* Mantive col-span-6 do original */}
            <CardHeader className="flex flex-col items-stretch border-b border-border/40 !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle className="text-base font-medium">
                        Sessões realizadas
                    </CardTitle>
                    <CardDescription>
                        Total de atendimentos no período selecionado
                    </CardDescription>
                </div>
                <div className="flex">
                    {["online", "presencial"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-border/40 px-6 py-4 text-left even:border-l even:border-border/40 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 transition-colors hover:bg-muted/30"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-muted-foreground text-xs">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                                    {total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
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
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("pt-BR", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("pt-BR", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})` }  radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}