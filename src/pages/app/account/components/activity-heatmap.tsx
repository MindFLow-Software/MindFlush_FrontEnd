interface AppointmentStats {
    date: string
    count: number
}

interface ActivityHeatmapProps {
    data?: AppointmentStats[]
    maxValue?: number
}

export function ActivityHeatmap({ data, maxValue }: ActivityHeatmapProps) {
    // Mock de dados caso não seja passado
    const mockData: AppointmentStats[] = Array.from({ length: 52 * 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (52 * 7 - i))
        return {
            date: date.toISOString(),
            count: Math.floor(Math.random() * 5), // 0 a 4 atendimentos por dia
        }
    })

    const heatmapData = data || mockData

    const getColor = (count: number, max: number) => {
        if (count === 0) return "bg-slate-100 dark:bg-slate-900"
        const intensity = count / max
        if (intensity < 0.25) return "bg-emerald-200 dark:bg-emerald-900"
        if (intensity < 0.5) return "bg-emerald-400 dark:bg-emerald-700"
        if (intensity < 0.75) return "bg-emerald-600 dark:bg-emerald-600"
        return "bg-emerald-700 dark:bg-emerald-500"
    }

    const max = maxValue || Math.max(...heatmapData.map((d) => d.count), 1)
    const weeks: AppointmentStats[][] = []
    let currentWeek: AppointmentStats[] = []

    heatmapData.forEach((day, index) => {
        currentWeek.push(day)
        if ((index + 1) % 7 === 0) {
            weeks.push(currentWeek)
            currentWeek = []
        }
    })

    if (currentWeek.length > 0) weeks.push(currentWeek)

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Atividade de Atendimentos</h3>
                <p className="text-sm text-muted-foreground">Últimos 12 meses de consultas realizadas</p>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="flex gap-1 min-w-max">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((day, dayIndex) => {
                                const date = new Date(day.date)
                                const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" })

                                return (
                                    <div key={dayIndex} className="group relative">
                                        <div
                                            className={`w-4 h-4 rounded-sm ${getColor(day.count, max)} border border-slate-300 dark:border-slate-700 transition-all hover:ring-2 ring-primary`}
                                            title={`${dayName} ${date.toLocaleDateString("pt-BR")}: ${day.count} atendimento(s)`}
                                        />
                                        <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                            {dayName} {date.toLocaleDateString("pt-BR")}
                                            <br />
                                            {day.count} atendimento{day.count !== 1 ? "s" : ""}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legenda */}
            <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Menos</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm" />
                    <div className="w-3 h-3 bg-emerald-200 dark:bg-emerald-900 border border-slate-300 dark:border-slate-700 rounded-sm" />
                    <div className="w-3 h-3 bg-emerald-400 dark:bg-emerald-700 border border-slate-300 dark:border-slate-700 rounded-sm" />
                    <div className="w-3 h-3 bg-emerald-600 dark:bg-emerald-600 border border-slate-300 dark:border-slate-700 rounded-sm" />
                    <div className="w-3 h-3 bg-emerald-700 dark:bg-emerald-500 border border-slate-300 dark:border-slate-700 rounded-sm" />
                </div>
                <span className="text-muted-foreground">Mais</span>
            </div>
        </div>
    )
}
