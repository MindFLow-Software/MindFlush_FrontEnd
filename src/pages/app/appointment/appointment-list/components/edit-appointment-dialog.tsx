"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDownIcon, CalendarClock, Trash2, User, FileText, Clock, AlertCircle } from "lucide-react"

import {
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import {
    Field,
    FieldGroup,
    FieldSet,
    FieldLabel,
} from "@/components/ui/field"

import type { Appointment } from "@/api/get-appointment"

interface EditAppointmentProps {
    appointment: Appointment
    onClose: () => void
    onCancelTrigger: () => void
    onRescheduleTrigger: () => void
}

export function EditAppointment({
    appointment,
    onClose,
    onCancelTrigger,
    onRescheduleTrigger
}: EditAppointmentProps) {

    const appointmentData = useMemo(() => {
        const raw = (appointment as any).props || appointment
        const p = raw.patient?.props || raw.patient || (appointment as any).patient || raw.user

        const apiName = raw.patientName || (appointment as any).patientName || raw.patient_name
        const firstName = p?.firstName || p?.first_name || raw.patientFirstName || ""
        const lastName = p?.lastName || p?.last_name || raw.patientLastName || ""

        let pName = `${firstName} ${lastName}`.trim()
        if (!pName || pName === "null null") pName = apiName
        if (!pName) pName = "Paciente"

        return {
            id: appointment.id,
            patientId: raw.patientId || p?.id || "none",
            patientName: pName,
            scheduledAt: raw.scheduledAt || raw.date || (appointment as any).scheduledAt,
            notes: raw.notes || "",
            diagnosis: raw.diagnosis || "",
            status: raw.status || appointment.status,
        }
    }, [appointment])

    const isCanceled = appointmentData.status === "CANCELED"
    const date = appointmentData.scheduledAt ? new Date(appointmentData.scheduledAt) : undefined

    return (
        <DialogContent className="max-h-[95vh] max-w-2xl p-0 flex flex-col overflow-hidden border-none shadow-2xl bg-card rounded-xl">

            {/* HEADER */}
            <div className="px-8 pt-8 pb-6 border-b border-border/40 bg-card shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                        <CalendarClock className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground/90">
                            Detalhes do Agendamento
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
                            Sessão agendada com: <span className="text-black font-extrabold">{appointmentData.patientName}</span>
                        </DialogDescription>
                    </div>
                </div>
            </div>

            {/* AÇÕES CRÍTICAS */}
            <div className="px-8 py-5 bg-muted/20 border-b border-border/40 shrink-0">
                {isCanceled && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-semibold">
                        <AlertCircle className="size-4" />
                        Agendamento cancelado. Apenas a remarcação está disponível.
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-lg border-primary/20 bg-card text-primary font-bold text-xs uppercase tracking-tight hover:bg-primary/5 hover:text-primary transition-all gap-2 shadow-sm"
                        onClick={onRescheduleTrigger}
                    >
                        <Clock className="h-3.5 w-3.5" />
                        Remarcar Horário
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={isCanceled}
                        className="h-10 rounded-lg border-destructive/20 bg-card text-destructive font-bold text-xs uppercase tracking-tight hover:bg-destructive/5 hover:text-destructive transition-all gap-2 shadow-sm disabled:opacity-50"
                        onClick={onCancelTrigger}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Cancelar Sessão
                    </Button>
                </div>
            </div>

            {/* ÁREA DE CONTEÚDO COM SCROLL */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6 min-h-0">
                <FieldGroup>
                    <FieldSet>
                        <div className="grid grid-cols-1 gap-6">
                            {/* PACIENTE - RESTAURADO AO ORIGINAL */}
                            <Field>
                                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Paciente</FieldLabel>
                                <div className="relative group">
                                    <Select disabled>
                                        <SelectTrigger className="w-full bg-muted/30 border-border/50 opacity-100 font-semibold text-sm h-11 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <User className="size-4 text-primary/60" />
                                                <SelectValue placeholder={appointmentData.patientName} />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">{appointmentData.patientName}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Field>

                            {/* DIAGNÓSTICO */}
                            <Field>
                                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Diagnóstico Identificado</FieldLabel>
                                <div className="relative">
                                    <Input
                                        value={appointmentData.diagnosis || "Nenhum diagnóstico registrado"}
                                        disabled
                                        className="bg-muted/30 border-border/50 h-11 rounded-lg font-medium text-foreground/80 pl-10"
                                    />
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                                </div>
                            </Field>

                            {/* DATA E HORÁRIO */}
                            <Field>
                                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Data e Horário</FieldLabel>
                                <Popover>
                                    <PopoverTrigger asChild disabled>
                                        <Button
                                            variant="outline"
                                            className="w-full h-11 justify-between font-bold bg-muted/30 border-border/50 rounded-lg text-sm px-4 opacity-100"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="size-4 text-primary/60" />
                                                {date ? format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : "Não definido"}
                                            </div>
                                            <ChevronDownIcon className="size-4 opacity-30" />
                                        </Button>
                                    </PopoverTrigger>
                                </Popover>
                            </Field>

                            {/* NOTAS */}
                            <Field>
                                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Notas Internas</FieldLabel>
                                <Textarea
                                    value={appointmentData.notes || "Sem observações para esta sessão."}
                                    disabled
                                    rows={4}
                                    className="resize-none bg-muted/30 border-border/50 rounded-xl font-medium text-foreground/70 p-4 text-sm leading-relaxed"
                                />
                            </Field>
                        </div>
                    </FieldSet>
                </FieldGroup>
            </div>

            {/* FOOTER */}
            <div className="px-8 py-5 border-t border-border/40 bg-muted/10 flex items-center justify-end gap-3 shrink-0">
                <Button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 w-full sm:w-auto min-w-[150px] font-bold"
                >
                    Fechar Detalhes
                </Button>
            </div>
        </DialogContent>
    )
}