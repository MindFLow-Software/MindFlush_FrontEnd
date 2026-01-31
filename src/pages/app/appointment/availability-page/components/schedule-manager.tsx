"use client"

import { useState, useEffect } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { AvailabilityDayRow } from './availability-day-row'

interface ScheduleManagerProps {
    defaultData: {
        dayOfWeek: number
        startTime: string
        endTime: string
    }[]
}

const DAYS_OF_WEEK = [
    { id: 1, name: 'Segunda' },
    { id: 2, name: 'Terça' },
    { id: 3, name: 'Quarta' },
    { id: 4, name: 'Quinta' },
    { id: 5, name: 'Sexta' },
    { id: 6, name: 'Sábado' },
    { id: 0, name: 'Domingo' },
]

export function ScheduleManager({ defaultData }: ScheduleManagerProps) {
    const [schedule, setSchedule] = useState<Record<number, { startTime: string, endTime: string }[]>>({
        1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 0: []
    })

    useEffect(() => {
        if (defaultData && defaultData.length > 0) {
            const formatted: Record<number, { startTime: string, endTime: string }[]> = {
                1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 0: []
            }

            defaultData.forEach(item => {
                if (formatted[item.dayOfWeek]) {
                    formatted[item.dayOfWeek].push({
                        startTime: item.startTime,
                        endTime: item.endTime
                    })
                }
            })

            setSchedule(formatted)
        }
    }, [defaultData])

    const addSlot = (day: number) => {
        setSchedule(prev => ({
            ...prev,
            [day]: [...prev[day], { startTime: '08:00', endTime: '12:00' }]
        }))
    }

    const removeSlot = (day: number, index: number) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }))
    }

    const updateSlot = (day: number, index: number, field: string, value: string) => {
        setSchedule(prev => {
            const newDaySlots = [...prev[day]]
            newDaySlots[index] = { ...newDaySlots[index], [field]: value }
            return { ...prev, [day]: newDaySlots }
        })
    }

    const handleSave = async () => {
        const allSlots = Object.entries(schedule).flatMap(([day, slots]) =>
            slots.map(s => ({
                dayOfWeek: Number(day),
                startTime: s.startTime,
                endTime: s.endTime
            }))
        )

        if (allSlots.length === 0) {
            return toast.error("Adicione pelo menos um horário")
        }

        try {
            await api.post('/availabilities', { slots: allSlots })
            toast.success("Agenda salva com sucesso!")
        } catch (err) {
            toast.error("Erro ao salvar agenda")
        }
    }

    return (
        <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden transition-colors">
            <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-base font-bold text-foreground uppercase tracking-wider">Definir Disponibilidade Recorrente</h2>
                    <p className="text-xs text-muted-foreground">Configure os horários padrão para seus atendimentos semanais</p>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all active:scale-95 cursor-pointer"
                >
                    Salvar Agenda
                </button>
            </div>

            <div className="divide-y divide-border bg-card">
                {DAYS_OF_WEEK.map(day => (
                    <AvailabilityDayRow
                        key={day.id}
                        dayName={day.name}
                        dayOfWeek={day.id}
                        slots={schedule[day.id]}
                        onAddSlot={addSlot}
                        onRemoveSlot={removeSlot}
                        onUpdateSlot={updateSlot}
                    />
                ))}
            </div>
        </div>
    )
}