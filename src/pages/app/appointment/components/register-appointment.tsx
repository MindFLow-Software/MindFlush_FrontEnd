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

import { registerAppointment, type RegisterAppointmentRequest } from "@/api/create-appointment"
import { getPatientsByName } from "@/api/get-patient-by-name"

export function RegisterAppointment() {
    const queryClient = useQueryClient()
    const [date, setDate] = useState<Date | undefined>()
    const [patients, setPatients] = useState<{ id: string; name: string }[]>([])
    const [selectedPatient, setSelectedPatient] = useState("")
    const [notes, setNotes] = useState("")

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatientsByName("")
                const formatted = data.patients.map((p) => ({
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                }))
                setPatients(formatted)
            } catch {
                setPatients([])
            }
        }
        fetchPatients()
    }, [])

    const { mutateAsync: registerAppointmentFn, isPending } = useMutation({
        mutationFn: registerAppointment,
        onSuccess: () => {
            toast.success("Agendamento criado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
        },
        onError: () => toast.error("Erro ao criar agendamento."),
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const psychologistId = formData.get("psychologistId") as string
        const diagnosis = formData.get("diagnosis") as string

        if (!selectedPatient) {
            toast.error("Selecione um paciente.")
            return
        }
        if (!date) {
            toast.error("Selecione uma data e hora.")
            return
        }

        const payload: RegisterAppointmentRequest = {
            patientId: selectedPatient,
            psychologistId,
            diagnosis,
            notes: notes || undefined,
            scheduledAt: date,
            status: "SCHEDULED",
        }

        await registerAppointmentFn(payload)
        e.currentTarget.reset()
        setDate(undefined)
        setSelectedPatient("")
        setNotes("")
    }

    return (
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                    Preencha as informações abaixo para criar um novo agendamento
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {/* Paciente */}
                    <div className="space-y-2">
                        <label htmlFor="patient" className="text-sm font-medium">
                            Paciente
                        </label>
                        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o paciente" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.length > 0 ? (
                                    patients.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        Nenhum paciente encontrado
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Diagnóstico */}
                    <div className="space-y-2">
                        <label htmlFor="diagnosis" className="text-sm font-medium">
                            Diagnóstico
                        </label>
                        <Input
                            id="diagnosis"
                            name="diagnosis"
                            placeholder="ex: Ansiedade generalizada"
                            required
                            maxLength={90}
                        />
                    </div>

                    {/* Data e Hora */}
                    <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium">
                            Data e Hora
                        </label>
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
                                    onSelect={(selectedDate) => setDate(selectedDate)}
                                    fromYear={1900}
                                    toYear={new Date().getFullYear() + 1}
                                    locale={ptBR}
                                />
                                <div className="border-t p-3 bg-muted/40">
                                    <Input
                                        type="time"
                                        className="w-full"
                                        onChange={(e) => {
                                            if (date) {
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
                    </div>

                    {/* Notas */}
                    <div className="space-y-2">
                        <label htmlFor="notes" className="text-sm font-medium">
                            Notas (opcional)
                        </label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Adicione observações..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            maxLength={255}
                            rows={4}
                            className="w-full resize-none overflow-y-auto wrap-break-word whitespace-pre-wrap"
                            style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                            }}
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {notes.length}/255 caracteres
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Criando..." : "Criar Agendamento"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}
