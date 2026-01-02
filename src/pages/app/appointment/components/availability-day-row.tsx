import { Plus, Trash2 } from 'lucide-react'

interface TimeSlot {
    startTime: string
    endTime: string
}

interface AvailabilityDayRowProps {
    dayName: string
    dayOfWeek: number
    slots: TimeSlot[]
    onAddSlot: (day: number) => void
    onRemoveSlot: (day: number, index: number) => void
    onUpdateSlot: (day: number, index: number, field: keyof TimeSlot, value: string) => void
}

export function AvailabilityDayRow({
    dayName, dayOfWeek, slots, onAddSlot, onRemoveSlot, onUpdateSlot
}: AvailabilityDayRowProps) {
    return (
        <div className="flex flex-col gap-3 p-4 border-b last:border-0">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700 w-24">{dayName}</span>

                <button
                    type="button"
                    onClick={() => onAddSlot(dayOfWeek)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                    <Plus size={16} /> Adicionar Horário
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                {slots.length === 0 ? (
                    <span className="text-sm text-gray-400 italic">Nenhum horário definido</span>
                ) : (
                    slots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border">
                            <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => onUpdateSlot(dayOfWeek, index, 'startTime', e.target.value)}
                                className="bg-transparent border-none text-sm focus:ring-0"
                            />
                            <span className="text-gray-400">até</span>
                            <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => onUpdateSlot(dayOfWeek, index, 'endTime', e.target.value)}
                                className="bg-transparent border-none text-sm focus:ring-0"
                            />
                            <button
                                onClick={() => onRemoveSlot(dayOfWeek, index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}