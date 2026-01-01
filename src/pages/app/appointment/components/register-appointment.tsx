"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { CalendarIcon, Clock, FileText, Loader2, Stethoscope, User } from "lucide-react"

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

// 1. Definição da Interface das Props (Type Safety)
interface RegisterAppointmentProps {
    initialDate?: Date
    onSuccess?: () => void
}

// 2. Recebendo as props no componente
export function RegisterAppointment({ initialDate, onSuccess }: RegisterAppointmentProps) {
    const queryClient = useQueryClient()

    const [date, setDate] = useState<Date | undefined>()
    const [time, setTime] = useState("")

    const [patients, setPatients] = useState<{ id: string; name: string }[]>([])
    const [selectedPatient, setSelectedPatient] = useState("")
    const [notes, setNotes] = useState("")
    const [diagnosis, setDiagnosis] = useState("")
    const [isLoadingPatients, setIsLoadingPatients] = useState(true)

    // 3. Effect: Preenche data e hora automaticamente ao abrir via calendário
    useEffect(() => {
        if (initialDate) {
            setDate(initialDate)

            // Formata a hora do objeto Date para string "HH:mm" (necessário para o input type="time")
            const hours = String(initialDate.getHours()).padStart(2, '0')
            const minutes = String(initialDate.getMinutes()).padStart(2, '0')
            setTime(`${hours}:${minutes}`)
        }
    }, [initialDate])

    // Busca de pacientes
    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoadingPatients(true)
            try {
                const data = await getPatients({
                    pageIndex: 0,
                    perPage: 1000,
                    status: null,
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

            // 4. Fecha o modal chamando a prop do pai
            if (onSuccess) {
                onSuccess()
            }
        },
        onError: () => toast.error("Erro ao criar agendamento."),
    })

    const handleTimeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newTime = e.target.value
            setTime(newTime)

            // Atualiza o objeto Date se ele já existir, para manter sincronia
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
            // Se já tiver horário selecionado, mantém o horário na nova data
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

            // Combina Data e Hora finais para envio
            const finalDate = new Date(date)
            const [h, m] = time.split(":")
            finalDate.setHours(Number(h), Number(m))

            const payload: RegisterAppointmentRequest = {
                patientId: selectedPatient,
                psychologistId: "", // Assumindo que o back pega do token ou contexto
                diagnosis: diagnosis.trim(),
                notes: notes.trim() || undefined,
                scheduledAt: finalDate,
                status: "SCHEDULED",
            }

            await registerAppointmentFn(payload)

            // Limpeza do form acontece apenas se o modal NÃO fechar (edge case),
            // pois o onSuccess geralmente desmonta este componente.
        },
        [selectedPatient, date, time, diagnosis, notes, registerAppointmentFn, onSuccess],
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
                {/* Paciente */}
                <div className="space-y-2">
                    <Label htmlFor="patient" className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Paciente
                    </Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger
                            id="patient"
                            className="h-11 w-full transition-colors focus:ring-2 focus:ring-primary/20"
                            aria-label="Selecionar paciente"
                        >
                            <SelectValue placeholder={isLoadingPatients ? "Carregando..." : "Selecione o paciente"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[280px]">
                            {isLoadingPatients ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : patients.length > 0 ? (
                                patients.map((p) => (
                                    <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                                        {p.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-sm text-muted-foreground text-center">Nenhum paciente encontrado</div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Diagnóstico */}
                <div className="space-y-2">
                    <Label htmlFor="diagnosis" className="text-sm font-medium flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        Tema da Sessão
                    </Label>
                    <Input
                        id="diagnosis"
                        name="diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="ex: Ansiedade generalizada"
                        maxLength={90}
                        className="h-11 transition-colors focus:ring-2 focus:ring-primary/20"
                        aria-describedby="diagnosis-hint"
                    />
                    <p id="diagnosis-hint" className="text-xs text-muted-foreground">
                        Descreva brevemente o diagnóstico do paciente
                    </p>
                </div>

                {/* Data e Hora - Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Data */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            Data
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-11 w-full justify-start font-normal hover:bg-accent/50 transition-colors bg-transparent"
                                    aria-label="Selecionar data"
                                >
                                    {date ? (
                                        format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })
                                    ) : (
                                        <span className="text-muted-foreground">Selecione a data</span>
                                    )}
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

                    {/* Hora */}
                    <div className="space-y-2">
                        <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Horário
                        </Label>
                        <Input
                            id="time"
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                            className="h-11 transition-colors focus:ring-2 focus:ring-primary/20"
                            aria-label="Selecionar horário"
                        />
                    </div>
                </div>

                {/* Notas */}
                <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Notas
                        <span className="text-muted-foreground font-normal">(opcional)</span>
                    </Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Adicione observações relevantes sobre o agendamento..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        maxLength={MAX_NOTE_LENGTH}
                        rows={3}
                        className="resize-none transition-colors focus:ring-2 focus:ring-primary/20"
                        aria-describedby="notes-counter"
                    />
                    <div id="notes-counter" className="flex justify-end text-xs text-muted-foreground">
                        <span className={notes.length > MAX_NOTE_LENGTH * 0.9 ? "text-amber-500" : undefined}>
                            {notes.length}/{MAX_NOTE_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                    <Button
                        type="submit"
                        className="h-11 w-full font-medium transition-all active:scale-[0.98]"
                        disabled={isPending || !isFormValid}
                    >
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