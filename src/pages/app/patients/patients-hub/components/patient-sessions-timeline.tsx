"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, History, ChevronLeft, ChevronRight, Maximize2, CalendarDays, Timer } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { ExportPDFButton } from "./export-pdf-button"

interface Session {
    id: string
    sessionDate?: string | Date | null
    createdAt: string | Date
    status: string
    theme?: string | null
    content?: string | null
    duration?: string | number | null
}

interface PatientSessionsTimelineProps {
    sessions: Session[]
    patientName: string // 🟢 Adicionado para o PDF
    meta: {
        totalCount: number
        perPage: number
    }
    pageIndex: number
    onPageChange: (newIndex: number) => void
}

export function PatientSessionsTimeline({
    sessions,
    patientName,
    meta,
    pageIndex,
    onPageChange
}: PatientSessionsTimelineProps) {
    const [selectedSession, setSelectedSession] = useState<Session | null>(null)
    const totalPages = Math.ceil(meta.totalCount / meta.perPage)

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center py-24 text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
                <History className="h-10 w-10 opacity-20 mb-3" />
                <p className="text-sm font-semibold">Sem histórico de sessões</p>
                <p className="text-xs">As sessões realizadas aparecerão aqui.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="relative border-l-2 border-muted ml-4 space-y-8 py-4">
                {sessions.map((session) => (
                    <div key={session.id} className="relative pl-8 group">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-background shadow-sm group-hover:scale-125 transition-transform" />

                        <div
                            onClick={() => setSelectedSession(session)}
                            className="flex flex-col gap-1 bg-card p-5 rounded-2xl border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer relative group/card"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(session.sessionDate ?? session.createdAt), "dd MMM yyyy '•' HH:mm", { locale: ptBR })}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[9px] uppercase px-2 bg-muted/30">
                                        {session.status}
                                    </Badge>
                                    <Maximize2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            <p className="text-sm font-bold text-foreground">
                                {session.theme || 'Sessão de Acompanhamento'}
                            </p>

                            <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-3">
                                {session.content || 'Nenhuma nota clínica detalhada para esta sessão.'}
                            </p>

                            {session.duration && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-muted/50">
                                    <Badge variant="secondary" className="text-[9px] rounded-md uppercase">
                                        {session.duration} Minutos
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
                <p className="text-xs text-muted-foreground font-medium">
                    Página {pageIndex + 1} de {totalPages || 1}
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={pageIndex === 0}
                        onClick={() => onPageChange(pageIndex - 1)}
                        className="cursor-pointer"
                    >
                        <ChevronLeft className="size-4 mr-1" /> Anterior
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={(pageIndex + 1) >= totalPages}
                        onClick={() => onPageChange(pageIndex + 1)}
                        className="cursor-pointer"
                    >
                        Próxima <ChevronRight className="size-4 ml-1" />
                    </Button>
                </div>
            </div>

            <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-600">{selectedSession?.status}</Badge>
                                {selectedSession?.duration && (
                                    <Badge variant="outline" className="flex gap-1 items-center">
                                        <Timer className="h-3 w-3" /> {selectedSession.duration} min
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <DialogTitle className="text-xl font-bold leading-tight">
                            {selectedSession?.theme || 'Sessão de Acompanhamento'}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                            <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                            {selectedSession && format(new Date(selectedSession.sessionDate ?? selectedSession.createdAt), "PPPP 'às' HH:mm", { locale: ptBR })}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-4">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">
                            Notas Clínicas
                        </h4>
                        <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap bg-muted/30 p-4 rounded-xl border border-dashed">
                            {selectedSession?.content || (
                                <span className="text-muted-foreground italic">Nenhuma anotação detalhada foi registrada para esta sessão.</span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        {/* 🟢 Botão posicionado conforme solicitado */}
                        <ExportPDFButton
                            session={selectedSession}
                            patientName={patientName}
                            psychologist={{
                                name: "Seu Nome Profissional",
                                crp: "06/12345-X"
                            }}
                        />

                        <Button variant="outline" className="cursor-pointer" onClick={() => setSelectedSession(null)}>
                            Fechar Detalhes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}