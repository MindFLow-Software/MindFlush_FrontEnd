"use client"

import { useQuery } from "@tanstack/react-query"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useMemo } from "react" // 🔑 Importar useMemo

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
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"

const chartConfig = {
    newPatients: {
        label: "Novos Pacientes",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function NewPatientsChart() {
    // 1. 🔑 ESTABILIZAR DATAS: Usar useMemo para que o cálculo só ocorra na montagem
    const { startDate, endDate } = useMemo(() => {
        const end = new Date();
        const start = subDays(end, 7);
        return { startDate: start, endDate: end };
    }, []) // Dependência vazia garante que só roda uma vez

    const { data, isLoading, isError } = useQuery({
        // 2. Usar datas estáveis no queryKey
        queryKey: ["new-patients", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
        // 3. Adicionar retry baixo para evitar loop infinito em falhas de autenticação (401/403)
        retry: 1, 
    })

    if (isLoading) {
        return (
            <Card className="col-span-6 flex h-[250px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </Card>
        )
    }

    if (isError || !data) {
        return (
            <Card className="col-span-6 flex h-[250px] items-center justify-center text-muted-foreground">
                Erro ao carregar dados do gráfico
            </Card>
        )
    }

    return (
        <Card className={cn("col-span-6 py-4 sm:py-0")}>
            <CardHeader className="flex-row items-center justify-between pb-8 mt-5">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                        Crescimento de Pacientes
                    </CardTitle>
                    <CardDescription>
                        Quantidade de novos pacientes no período
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) =>
                                format(new Date(value), "dd/MM", { locale: ptBR })
                            }
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[140px]"
                                    nameKey="newPatients"
                                    labelFormatter={(value) =>
                                        format(new Date(value), "dd 'de' MMMM 'de' yyyy", {
                                            locale: ptBR,
                                        })
                                    }
                                />
                            }
                        />
                        <Line
                            dataKey="newPatients"
                            type="monotone"
                            stroke="#0ea5e9"
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