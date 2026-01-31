"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { CalendarIcon, Clock, FileText, Loader2, Stethoscope, User } from "lucide-react"
import { AxiosError } from "axios"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

import { registerAppointment, type RegisterAppointmentRequest } from "@/api/create-appointment"
import { getPatients } from "@/api/get-patients"

const MAX_NOTE_LENGTH = 200

interface RegisterAppointmentProps {
    initialDate?: Date
    onSuccess?: () => void
}

export function RegisterAppointment({ initialDate, onSuccess }: RegisterAppointmentProps) {
    const queryClient = useQueryClient()

    const [date, setDate] = useState<Date | undefined>()
    const [time, setTime] = useState("")

    const [patients, setPatients] = useState<{ id: string; name: string }[]>([])
    const [selectedPatient, setSelectedPatient] = useState("")
    const [notes, setNotes] = useState("")
    const [diagnosis, setDiagnosis] = useState("")
    const [isLoadingPatients, setIsLoadingPatients] = useState(true)

    useEffect(() => {
        if (initialDate) {
            setDate(initialDate)
            const hours = String(initialDate.getHours()).padStart(2, '0')
            const minutes = String(initialDate.getMinutes()).padStart(2, '0')
            setTime(`${hours}:${minutes}`)
        }
    }, [initialDate])

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoadingPatients(true)
            try {
                const data = await getPatients({
                    pageIndex: 0,
                    perPage: 1000,
                    status: 'active',
                })

                const formatted = data.patients.map((p) => ({
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                }))

                setPatients(formatted)
            } catch (error) {
                console.error(error)
                setPatients([])
                toast.error("Erro ao carregar a lista de pacientes.")
            } finally {
                setIsLoadingPatients(false)
            }
        }
        fetchPatients()
    }, [])

    const { mutateAsync: registerAppointmentFn, isPending } = useMutation({
        mutationFn: registerAppointment,
        onSuccess: () => {
            toast.success("Agendamento criado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            if (onSuccess) {
                onSuccess()
            }
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                const status = error.response?.status
                const message = error.response?.data?.message

                if (status === 409) {
                    return toast.error("Conflito de Horário", {
                        description: message || "Você já possui um agendamento para este horário."
                    })
                }

                if (status === 400) {
                    if (message?.toLowerCase().includes("inativo")) {
                        return toast.error("Paciente Inativo", {
                            description: message
                        })
                    }
                    return toast.error("Dados Inválidos", {
                        description: message || "Verifique as informações ou a data selecionada."
                    })
                }

                if (status === 404) {
                    return toast.error("Não encontrado", {
                        description: message || "Paciente não localizado."
                    })
                }
            }

            toast.error("Erro ao criar agendamento.")
        },
    })

    const handleTimeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newTime = e.target.value
            setTime(newTime)
            if (date && newTime) {
                const [h, m] = newTime.split(":")
                const newDate = new Date(date)
                newDate.setHours(Number(h))
                newDate.setMinutes(Number(m))
                setDate(newDate)
            }
        },
        [date],
    )

    const handleDateSelect = useCallback(
        (selectedDate: Date | undefined) => {
            if (selectedDate && time) {
                const [h, m] = time.split(":")
                selectedDate.setHours(Number(h))
                selectedDate.setMinutes(Number(m))
            }
            setDate(selectedDate)
        },
        [time],
    )

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (!selectedPatient) return toast.error("Selecione um paciente.")
            if (!date) return toast.error("Selecione uma data.")
            if (!time) return toast.error("Selecione um horário.")
            if (!diagnosis.trim()) return toast.error("Informe o diagnóstico.")

            const finalDate = new Date(date)
            const [h, m] = time.split(":")
            finalDate.setHours(Number(h), Number(m), 0, 0)

            const payload: RegisterAppointmentRequest = {
                patientId: selectedPatient,
                diagnosis: diagnosis.trim(),
                notes: notes.trim() || undefined,
                scheduledAt: finalDate,
                status: "SCHEDULED" as any,
            }

            try {
                await registerAppointmentFn(payload)
            } catch {
            }
        },
        [selectedPatient, date, time, diagnosis, notes, registerAppointmentFn],
    )

    const isFormValid = selectedPatient && date && time && diagnosis.trim()

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="space-y-1.5">
                <DialogTitle className="text-xl font-semibold">Novo Agendamento</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                    Preencha as informações abaixo para criar um novo agendamento
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                <div className="space-y-2">
                    <Label htmlFor="patient" className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Paciente
                    </Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        {/* Cursor pointer no gatilho do select */}
                        <SelectTrigger id="patient" className="h-11 w-full cursor-pointer">
                            <SelectValue placeholder={isLoadingPatients ? "Carregando..." : "Selecione o paciente"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[280px]">
                            {isLoadingPatients ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : patients.length > 0 ? (
                                patients.map((p) => (
                                    /* Cursor pointer nos itens do select */
                                    <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                                        {p.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-sm text-muted-foreground text-center">Nenhum paciente ativo encontrado</div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="diagnosis" className="text-sm font-medium flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        Tema da Sessão
                    </Label>
                    <Input
                        id="diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="ex: Ansiedade generalizada"
                        maxLength={90}
                        className="h-11"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            Data
                        </Label>
                        <Popover>
                            {/* Cursor pointer no botão que abre o calendário */}
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-11 w-full justify-start font-normal bg-transparent cursor-pointer">
                                    {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    locale={ptBR}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Horário
                        </Label>
                        {/* Cursor pointer no input de hora nativo */}
                        <Input id="time" type="time" value={time} onChange={handleTimeChange} className="h-11 cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Notas <span className="text-muted-foreground font-normal">(opcional)</span>
                    </Label>
                    <Textarea
                        id="notes"
                        placeholder="Adicione observações relevantes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        maxLength={MAX_NOTE_LENGTH}
                        rows={3}
                        className="resize-none"
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                        <span>{notes.length}/{MAX_NOTE_LENGTH}</span>
                    </div>
                </div>

                <div className="pt-3">
                    {/* Cursor pointer no botão de submissão */}
                    <Button type="submit" className="h-11 w-full font-medium cursor-pointer" disabled={isPending || !isFormValid}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Criando agendamento...
                            </>
                        ) : (
                            "Criar Agendamento"
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}