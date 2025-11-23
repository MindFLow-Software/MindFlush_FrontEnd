"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { ChevronDownIcon } from "lucide-react"

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import {
    Field,
    FieldGroup,
    FieldSet,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
} from "@/components/ui/field"

import { updateAppointment, type UpdateAppointmentRequest } from "@/api/update-appointment"
import { getPatients } from "@/api/get-patients"
import type { Appointment } from "@/api/get-appointment"

const MAX_NOTE_LENGTH = 300

interface EditAppointmentProps {
    appointment: Appointment
    onClose: () => void
}

export function EditAppointment({ appointment, onClose }: EditAppointmentProps) {
    const queryClient = useQueryClient()

    // 1. Estados Iniciais
    const initialPatientId = appointment.patient?.id ? String(appointment.patient.id) : ""
    const initialDate = appointment.scheduledAt ? new Date(appointment.scheduledAt) : undefined
    const initialNotes = appointment.notes || ""

    const [date, setDate] = useState<Date | undefined>(initialDate)
    const [selectedPatient, setSelectedPatient] = useState<string>(initialPatientId)
    const [notes, setNotes] = useState<string>(initialNotes)

    const [patients, setPatients] = useState<{ id: string; name: string }[]>([])

    // 2. Busca de Pacientes
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients({
                    pageIndex: 0,
                    perPage: 1000,
                    status: null as any // Força busca sem filtro de status
                })

                const formatted = data.patients.map((p) => ({
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                }))

                setPatients(formatted)
            } catch (error) {
                console.error(error)
                toast.error("Não foi possível carregar a lista de pacientes.")
            }
        }
        fetchPatients()
    }, [])

    const { mutateAsync: updateAppointmentFn, isPending } = useMutation({
        mutationFn: updateAppointment,
        onSuccess: () => {
            toast.success("Agendamento atualizado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            onClose()
        },
        onError: (err: any) => {
            // Lógica de tratamento de erros igual ao exemplo de Pacientes
            let errorMessage = "Erro ao atualizar agendamento."

            if (err.response) {
                const apiMessage = err.response.data?.message || err.response.data?.error

                if (err.response.status === 409) {
                    errorMessage = apiMessage || "Conflito de horário ou dados."
                } else if (apiMessage) {
                    errorMessage = apiMessage
                } else {
                    errorMessage = `Erro (${err.response.status}): Falha na comunicação com o servidor.`
                }
            } else {
                errorMessage = "Erro de rede ou desconhecido. Tente novamente."
            }

            toast.error(errorMessage)
        },
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const diagnosis = formData.get("diagnosis") as string

        if (!selectedPatient) {
            toast.error("Selecione um paciente.")
            return
        }
        if (!date) {
            toast.error("Selecione uma data e hora.")
            return
        }

        const payload: UpdateAppointmentRequest = {
            id: appointment.id,
            patientId: selectedPatient,
            diagnosis,
            notes: notes || undefined,
            scheduledAt: date,
            status: appointment.status,
        }

        await updateAppointmentFn(payload)
    }

    return (
        <DialogContent className="max-h-[85vh] max-w-2xl p-0 flex flex-col gap-0">
            <DialogHeader className="p-6 pb-2 shrink-0">
                <DialogTitle>Editar Agendamento</DialogTitle>
                <DialogDescription>
                    Atualize as informações do agendamento abaixo.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 pb-6">
                <FieldGroup className="mt-2">
                    <FieldSet>
                        <FieldLegend>Dados da Sessão</FieldLegend>

                        <div className="grid grid-cols-1 gap-4">

                            {/* Paciente */}
                            <Field>
                                <FieldLabel htmlFor="patient">Paciente</FieldLabel>
                                <Select
                                    value={selectedPatient}
                                    onValueChange={setSelectedPatient}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o paciente" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {patients.length > 0 ? (
                                            patients.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                                Carregando pacientes...
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* Diagnóstico */}
                            <Field>
                                <FieldLabel htmlFor="diagnosis">Diagnóstico</FieldLabel>
                                <Input
                                    id="diagnosis"
                                    name="diagnosis"
                                    placeholder="ex: Ansiedade generalizada"
                                    required
                                    defaultValue={appointment.diagnosis}
                                    maxLength={90}
                                />
                            </Field>

                            {/* Data e Hora */}
                            <Field>
                                <FieldLabel>Data e Hora</FieldLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between font-normal bg-transparent"
                                        >
                                            {date
                                                ? format(date, "dd/MM/yyyy HH:mm", { locale: ptBR })
                                                : "Selecione data e hora"}
                                            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            fromYear={1900}
                                            toYear={new Date().getFullYear() + 2}
                                            locale={ptBR}
                                        />
                                        <div className="border-t p-3 bg-muted/40">
                                            <Input
                                                type="time"
                                                className="w-full"
                                                defaultValue={date ? format(date, "HH:mm") : ""}
                                                onChange={(e) => {
                                                    if (date && e.target.value) {
                                                        const [h, m] = e.target.value.split(":")
                                                        const newDate = new Date(date)
                                                        newDate.setHours(Number(h))
                                                        newDate.setMinutes(Number(m))
                                                        setDate(newDate)
                                                    }
                                                }}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </Field>

                            {/* Notas */}
                            <Field>
                                <FieldLabel htmlFor="notes">Notas (opcional)</FieldLabel>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Adicione observações..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    maxLength={MAX_NOTE_LENGTH}
                                    rows={4}
                                    className="w-full resize-none"
                                    style={{
                                        wordBreak: "break-all",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}
                                />
                                <div className="text-xs text-muted-foreground text-right">
                                    {notes.length}/{MAX_NOTE_LENGTH} caracteres
                                </div>
                            </Field>
                        </div>
                    </FieldSet>

                    <FieldSeparator />

                    <Field orientation="horizontal">
                        <Button className="w-full" type="submit" disabled={isPending}>
                            {isPending ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </DialogContent>
    )
}