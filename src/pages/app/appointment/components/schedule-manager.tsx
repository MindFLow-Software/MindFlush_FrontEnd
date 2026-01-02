import { useState, useEffect } from 'react'
import { AvailabilityDayRow } from './availability-day-row'
import { api } from '@/lib/axios'
import { toast } from 'sonner'

// 1. Definição da interface para as props
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
    // Estado que guarda um array de horários para cada dia
    const [schedule, setSchedule] = useState<Record<number, { startTime: string, endTime: string }[]>>({
        1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 0: []
    })

    // 2. useEffect para carregar os dados iniciais quando o componente montar ou os dados mudarem
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
            // 3. Chamada real para o seu backend
            await api.post('/availabilities', { slots: allSlots })
            toast.success("Agenda salva com sucesso!")
        } catch (err) {
            toast.error("Erro ao salvar agenda")
        }
    }

    return (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold">Definir Disponibilidade Recorrente</h2>
                <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Salvar Agenda
                </button>
            </div>

            <div className="divide-y">
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