"use client"

import { BarChart } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import colors from "tailwindcss/colors"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 🔹 Dados de pacientes por faixa etária
const data = [
    { ageRange: "0-12 anos", patients: 8 },
    { ageRange: "13-17 anos", patients: 15 },
    { ageRange: "18-25 anos", patients: 32 },
    { ageRange: "26-40 anos", patients: 46 },
    { ageRange: "41-60 anos", patients: 28 },
    { ageRange: "60+ anos", patients: 10 },
]

const COLORS = [
    colors.sky[400],
    colors.amber[400],
    colors.violet[400],
    colors.emerald[400],
    colors.rose[400],
    colors.orange[400],
]

const totalPatients = data.reduce((sum, item) => sum + item.patients, 0)

function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        const data = payload[0]
        const percentage = ((data.value / totalPatients) * 100).toFixed(1)

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

export function PatientsByAgeChart() {
    return (
        <Card className="col-span-2">
            <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Distribuição por Idade</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart style={{ fontSize: 12 }}>
                        <Pie
                            data={data}
                            nameKey="ageRange"
                            dataKey="patients"
                            cx="50%"
                            cy="50%"
                            outerRadius={86}
                            innerRadius={64}
                            strokeWidth={8}
                            labelLine={false}
                            label={(props: any) => {
                                const { cx, cy, midAngle, innerRadius, outerRadius, value } = props
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
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index]}
                                    className="stroke-background hover:opacity-80 transition-opacity cursor-pointer"
                                    strokeWidth={8}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 place-items-center">
                    {data.map((item, index) => {
                        const percentage = ((item.patients / totalPatients) * 100).toFixed(1)
                        return (
                            <div
                                key={item.ageRange}
                                className="flex flex-col items-center text-center space-y-1"
                            >
                                <div
                                    className="h-3 w-3 rounded-sm"
                                    style={{ backgroundColor: COLORS[index] }}
                                />
                                <p className="text-xs font-medium text-foreground truncate max-w-[80px]">
                                    {item.ageRange}
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
