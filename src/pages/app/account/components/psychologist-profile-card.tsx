import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Mail, Phone, Award } from "lucide-react"

interface Psychologist {
    name: string
    specialization: string
    bio: string
    registrationNumber: string
    email: string
    phone?: string
    photo?: string
}

export function PsychologistProfileCard() {
    // Mock de dados
    const psychologist: Psychologist = {
        name: "Dra. Mariana Almeida",
        specialization: "Terapia Cognitivo-Comportamental",
        bio: "Psicóloga dedicada com foco em bem-estar emocional.",
        registrationNumber: "CRP 12345",
        email: "mariana.almeida@email.com",
        phone: "+55 11 91234-5678",
        photo: "", // ou URL de imagem
    }

    return (
        <Card className="overflow-hidden">
            <div className="h-24 bg-linear-to-r from-emerald-500 to-emerald-600" />
            <CardHeader className="pb-0 -mt-12 relative z-10">
                <div className="flex gap-6 items-end">
                    <div className="w-24 h-24 rounded-lg bg-slate-200 dark:bg-slate-800 border-4 border-background dark:border-slate-950 flex items-center justify-center overflow-hidden">
                        {psychologist.photo ? (
                            <img
                                src={psychologist.photo}
                                alt={psychologist.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl font-bold text-slate-400 dark:text-slate-600">
                                {psychologist.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="pb-2">
                        <h1 className="text-2xl font-bold text-foreground">{psychologist.name}</h1>
                        <p className="text-lg text-emerald-600 dark:text-emerald-400 font-semibold">
                            {psychologist.specialization}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{psychologist.bio}</p>

                <div className="pt-4 space-y-3 border-t border-border">
                    <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <p className="text-sm text-muted-foreground">Registro Profissional</p>
                            <p className="font-semibold text-foreground">{psychologist.registrationNumber}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <a
                                href={`mailto:${psychologist.email}`}
                                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                {psychologist.email}
                            </a>
                        </div>
                    </div>

                    {psychologist.phone && (
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-sm text-muted-foreground">Telefone</p>
                                <a
                                    href={`tel:${psychologist.phone}`}
                                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                >
                                    {psychologist.phone}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
