import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Mail, Phone, Award } from "lucide-react"

// Mock de psicólogo
const mockPsychologist = {
    name: "Dra. Mariana Almeida",
    specialization: "Terapia Cognitivo-Comportamental",
    bio: "Psicóloga dedicada com foco em bem-estar emocional.",
    registrationNumber: "CRP 12345",
    email: "mariana.almeida@email.com",
    phone: "+55 11 91234-5678",
    photo: "", // ou URL de imagem
}

// Mock de stats
const generateMockStats = () =>
    Array.from({ length: 52 * 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (52 * 7 - i))
        return {
            date: date.toISOString(),
            count: Math.floor(Math.random() * 5), // 0 a 4 atendimentos
        }
    })

interface AppointmentStats {
    date: string
    count: number
}

export function MockPsychologistProfilePage() {
    const stats: AppointmentStats[] = generateMockStats()

    const getColor = (count: number, max: number) => {
        if (count === 0) return "bg-slate-100 dark:bg-slate-900"
        const intensity = count / max
        if (intensity < 0.25) return "bg-emerald-200 dark:bg-emerald-900"
        if (intensity < 0.5) return "bg-emerald-400 dark:bg-emerald-700"
        if (intensity < 0.75) return "bg-emerald-600 dark:bg-emerald-600"
        return "bg-emerald-700 dark:bg-emerald-500"
    }

    const max = Math.max(...stats.map((d) => d.count), 1)
    const weeks: AppointmentStats[][] = []
    let currentWeek: AppointmentStats[] = []

    stats.forEach((day, index) => {
        currentWeek.push(day)
        if ((index + 1) % 7 === 0) {
            weeks.push(currentWeek)
            currentWeek = []
        }
    })

    if (currentWeek.length > 0) weeks.push(currentWeek)

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Perfil */}
                <Card className="overflow-hidden lg:col-span-1">
                    <div className="h-24 bg-linear-to-r from-emerald-500 to-emerald-600" />
                    <CardHeader className="pb-0 -mt-12 relative z-10">
                        <div className="flex gap-6 items-end">
                            <div className="w-24 h-24 rounded-lg bg-slate-200 dark:bg-slate-800 border-4 border-background dark:border-slate-950 flex items-center justify-center overflow-hidden">
                                {mockPsychologist.photo ? (
                                    <img
                                        src={mockPsychologist.photo}
                                        alt={mockPsychologist.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-slate-400 dark:text-slate-600">
                                        {mockPsychologist.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="pb-2">
                                <h1 className="text-2xl font-bold text-foreground">{mockPsychologist.name}</h1>
                                <p className="text-lg text-emerald-600 dark:text-emerald-400 font-semibold">
                                    {mockPsychologist.specialization}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{mockPsychologist.bio}</p>
                        <div className="pt-4 space-y-3 border-t border-border">
                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Registro Profissional</p>
                                    <p className="font-semibold text-foreground">{mockPsychologist.registrationNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <a
                                        href={`mailto:${mockPsychologist.email}`}
                                        className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        {mockPsychologist.email}
                                    </a>
                                </div>
                            </div>
                            {mockPsychologist.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Telefone</p>
                                        <a
                                            href={`tel:${mockPsychologist.phone}`}
                                            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            {mockPsychologist.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Heatmap */}
                <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
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
                </div>
            </div>
        </main>
    )
}
