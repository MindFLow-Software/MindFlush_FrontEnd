"use client"

import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { CalendarClock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface RescheduleAppointmentDialogProps {
    patientName: string
    isRescheduling: boolean
    onClose: () => void
    onReschedule: (newDate: Date) => Promise<void>
}

export function RescheduleAppointmentDialog({
    patientName,
    isRescheduling,
    onClose,
    onReschedule
}: RescheduleAppointmentDialogProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState("08:00")

    async function handleConfirm() {
        if (!selectedDate) return

        const [hours, minutes] = selectedTime.split(":").map(Number)
        const finalDate = new Date(selectedDate)
        finalDate.setHours(hours, minutes)

        await onReschedule(finalDate)
    }

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <CalendarClock className="h-5 w-5" />
                    <DialogTitle>Remarcar Sessão</DialogTitle>
                </div>
                <DialogDescription>
                    Escolha o novo horário para <strong>{patientName}</strong>.
                </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
                <div className="border rounded-md p-2 bg-muted/20">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={ptBR}
                        disabled={{ before: new Date() }} // Não permite datas passadas
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Horário:</label>
                    <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-32"
                    />
                </div>
            </div>

            <DialogFooter>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleConfirm}
                    disabled={isRescheduling || !selectedDate}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Nova Data"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}