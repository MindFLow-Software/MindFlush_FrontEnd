"use client"

import { useEffect, useState, useMemo } from "react"
import { BarChart } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import colors from "tailwindcss/colors"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPatientsByGender, type PatientsByGenderResponse } from "@/api/get-patients-by-gender"

const GENDER_TRANSLATIONS: Record<string, string> = {
    FEMININE: "Feminino",
    MASCULINE: "Masculino",
    OTHER: "Outros",
}

// Função pra definir cores personalizadas conforme o gênero
const getColorByGender = (gender: string) => {
    switch (gender) {
        case "Feminino":
            return colors.fuchsia[500]
        case "Masculino":
            return colors.blue[500]
        default:
            return colors.emerald[500]
    }
}

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

export function PatientsByGenderChart() {
    const [data, setData] = useState<PatientsByGenderResponse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getPatientsByGender()
                const translated = response.map(item => ({
                    ...item,
                    gender: GENDER_TRANSLATIONS[item.gender] || item.gender,
                }))
                setData(translated)
            } catch (error) {
                console.error("Erro ao buscar dados de pacientes por gênero:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const totalPatients = useMemo(
        () => data.reduce((sum, item) => sum + item.patients, 0),
        [data]
    )

    if (loading) {
        return (
            <Card className="col-span-2 flex items-center justify-center h-[300px]">
                <p className="text-sm text-muted-foreground">Carregando gráfico...</p>
            </Card>
        )
    }

    if (!data.length) {
        return (
            <Card className="col-span-2 flex items-center justify-center h-[300px]">
                <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            </Card>
        )
    }

    return (
        <Card className="col-span-2">
            <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                        Distribuição por Gênero
                    </CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>

            <CardContent>
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
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
                                const RADIAN = Math.PI / 180
                                const radius = 12 + innerRadius + (outerRadius - innerRadius)
                                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                                const y = cy + radius * Math.sin(-midAngle * RADIAN)
                                const percentage = ((value / totalPatients) * 100).toFixed(0)

                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        className="fill-foreground text-xs font-medium"
                                        textAnchor={x > cx ? "start" : "end"}
                                        dominantBaseline="central"
                                    >
                                        {percentage}%
                                    </text>
                                )
                            }}
                            animationBegin={0}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            {data.map((item, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColorByGender(item.gender)}
                                    className="stroke-background hover:opacity-80 transition-opacity cursor-pointer"
                                    strokeWidth={8}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip total={totalPatients} />} />
                    </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 place-items-center">
                    {data.map((item) => {
                        const percentage = ((item.patients / totalPatients) * 100).toFixed(1)
                        return (
                            <div
                                key={item.gender}
                                className="flex flex-col items-center text-center space-y-1"
                            >
                                <div
                                    className="h-3 w-3 rounded-sm"
                                    style={{ backgroundColor: getColorByGender(item.gender) }}
                                />
                                <p className="text-xs font-medium text-foreground truncate max-w-[90px]">
                                    {item.gender}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {item.patients} ({percentage}%)
                                </p>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
