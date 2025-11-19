"use client"

import { BarChart, Loader2 } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import colors from "tailwindcss/colors"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { getPatientsByGender, type PatientsByGenderResponse } from "@/api/get-patients-by-gender"

const GENDER_TRANSLATIONS: Record<string, string> = {
    FEMININE: "Feminino",
    MASCULINE: "Masculino",
    OTHER: "Outros",
}

const COLORS = [
    colors.fuchsia[500],
    colors.blue[500],
    colors.emerald[500],
    colors.sky[400],
    colors.amber[400],
    colors.rose[400],
]

function CustomTooltip({ active, payload, total }: any) {
    if (active && payload && payload.length) {
        const data = payload[0]
        const percentage = ((data.value / total) * 100).toFixed(1)

        return (
            <div className="rounded-lg border bg-background p-3 shadow-lg">
                <p className="font-medium text-sm mb-1">{data.name}</p>
                <p className="text-sm text-muted-foreground">
                    {data.value} pacientes ({percentage}%)
                </p>
            </div>
        )
    }
    return null
}

interface PatientsByGenderChartProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function PatientsByGenderChart({ startDate, endDate }: PatientsByGenderChartProps) {

    const startIso = startDate?.toISOString()
    const endIso = endDate?.toISOString()

    const { data: rawData, isLoading, isError } = useQuery<PatientsByGenderResponse[], Error, PatientsByGenderResponse[], (string | undefined)[]>({
        queryKey: ['dashboard', 'gender-stats', startIso, endIso],
        queryFn: () => getPatientsByGender({ startDate: startIso, endDate: endIso }),
        enabled: true,
        staleTime: 1000 * 60 * 5,
    })

    const data = useMemo(() => {
        if (!rawData) return []
        return rawData.map(item => ({
            ...item,
            gender: GENDER_TRANSLATIONS[item.gender] || item.gender,
        }))
    }, [rawData])

    const totalPatients = useMemo(
        () => data.reduce((sum, item) => sum + item.patients, 0),
        [data]
    )

    if (isLoading || !data || data.length === 0) {
        return (
            <Card className="col-span-1 flex items-center justify-center h-[300px]">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="col-span-1 flex items-center justify-center h-[300px]">
                <p className="text-sm text-red-500">Erro ao carregar dados.</p>
            </Card>
        )
    }

    return (
        <Card className="col-span-1">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">
                        Distribuição por Gênero
                    </CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                    Total de {totalPatients} pacientes no período
                </p>
            </CardHeader>

            <CardContent className="space-y-6">

                <ResponsiveContainer width="100%" height={240}>
                    <PieChart style={{ fontSize: 12 }}>
                        <Pie
                            data={data}
                            nameKey="gender"
                            dataKey="patients"
                            cx="50%"
                            cy="50%"
                            outerRadius={86}
                            innerRadius={64}
                            strokeWidth={8}
                            labelLine={false}
                            animationBegin={0}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="stroke-background hover:opacity-80 transition-opacity cursor-pointer"
                                    strokeWidth={8}
                                />
                            ))}
                        </Pie>

                        <Tooltip content={<CustomTooltip total={totalPatients} />} />
                    </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 p-4 border-t">
                    {data.map((item, index) => {
                        const percentage = ((item.patients / totalPatients) * 100).toFixed(1)
                        return (
                            <div
                                key={item.gender}
                                className="flex items-center space-x-2"
                            >
                                <div
                                    className="h-3 w-3 rounded-full shrink-0"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm font-medium text-foreground">
                                    {item.gender}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({percentage}%)
                                </span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
