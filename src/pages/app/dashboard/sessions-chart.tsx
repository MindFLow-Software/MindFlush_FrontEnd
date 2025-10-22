'use client'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
    { date: '2024-12-10', sessions: 5 },
    { date: '2024-12-11', sessions: 8 },
    { date: '2024-12-12', sessions: 6 },
    { date: '2024-12-13', sessions: 9 },
    { date: '2024-12-14', sessions: 12 },
    { date: '2024-12-15', sessions: 7 },
    { date: '2024-12-16', sessions: 4 },
]

const chartConfig = {
    sessions: {
        label: 'Sessões',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig

export function SessionsChart() {

    return (
        <Card className="col-span-6 py-4 sm:py-0">

            <CardHeader className="flex-row items-center justify-between pb-8 mt-5">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                        Sessões realizadas
                    </CardTitle>
                    <CardDescription>
                        Quantidade de atendimentos concluídos no período
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 15,
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
                                return date.toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[140px]"
                                    nameKey="sessions"
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                    }
                                />
                            }
                        />
                        <Line
                            dataKey="sessions"
                            type="monotone"
                            stroke="var(--color-sessions)"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
