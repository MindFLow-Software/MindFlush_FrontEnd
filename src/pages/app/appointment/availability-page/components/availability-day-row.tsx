"use client"

import { Plus, Trash2, Clock, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    disabled?: boolean
}

export function AvailabilityDayRow({
    dayName,
    dayOfWeek,
    slots,
    onAddSlot,
    onRemoveSlot,
    onUpdateSlot,
    disabled = false,
}: AvailabilityDayRowProps) {
    const hasSlots = slots.length > 0

    return (
        <div
            className={cn(
                "group rounded-lg border border-border bg-card transition-all",
                "hover:border-border/80 hover:shadow-sm",
                disabled && "opacity-50 pointer-events-none"
            )}
        >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4">
                {/* Dia da semana */}
                <div className="flex items-center gap-3 sm:w-32 shrink-0">
                    <div
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors",
                            hasSlots
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        {dayName.slice(0, 3)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">{dayName}</span>
                        <span className="text-xs text-muted-foreground">
                            {hasSlots
                                ? `${slots.length} horário${slots.length > 1 ? "s" : ""}`
                                : "Indisponível"}
                        </span>
                    </div>
                </div>

                {/* Slots de horário */}
                <div className="flex-1 min-w-0">
                    {!hasSlots ? (
                        <div className="flex items-center justify-center py-3 px-4 rounded-lg border-2 border-dashed border-border bg-muted/30">
                            <span className="text-sm text-muted-foreground">
                                Nenhum horário definido para este dia
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {slots.map((slot, index) => (
                                <TimeSlotCard
                                    key={index}
                                    slot={slot}
                                    index={index}
                                    dayOfWeek={dayOfWeek}
                                    onUpdate={onUpdateSlot}
                                    onRemove={onRemoveSlot}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Botão de adicionar */}
                <div className="shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onAddSlot(dayOfWeek)}
                        className="gap-1.5 text-xs h-9 w-full sm:w-auto"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Adicionar
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface TimeSlotCardProps {
    slot: TimeSlot
    index: number
    dayOfWeek: number
    onUpdate: (day: number, index: number, field: keyof TimeSlot, value: string) => void
    onRemove: (day: number, index: number) => void
}

function TimeSlotCard({ slot, index, dayOfWeek, onUpdate, onRemove }: TimeSlotCardProps) {
    return (
        <div className="group/card flex items-center gap-2 bg-muted/50 hover:bg-muted border border-border rounded-lg px-3 py-2 transition-all">
            <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 hidden sm:block" />

            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />

            <div className="flex items-center gap-2">
                <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => onUpdate(dayOfWeek, index, "startTime", e.target.value)}
                    className={cn(
                        "bg-background border border-input rounded-md px-2 py-1 text-sm font-medium",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                        "w-[90px]"
                    )}
                />

                <span className="text-muted-foreground text-sm">até</span>

                <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => onUpdate(dayOfWeek, index, "endTime", e.target.value)}
                    className={cn(
                        "bg-background border border-input rounded-md px-2 py-1 text-sm font-medium",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                        "w-[90px]"
                    )}
                />
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(dayOfWeek, index)}
                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-1 shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    )
}

// Componente completo de configuração de disponibilidade
interface WeeklyAvailabilityProps {
    availability: Record<number, TimeSlot[]>
    onUpdate: (day: number, slots: TimeSlot[]) => void
}

const daysOfWeek = [
    { dayOfWeek: 0, dayName: "Domingo" },
    { dayOfWeek: 1, dayName: "Segunda-feira" },
    { dayOfWeek: 2, dayName: "Terça-feira" },
    { dayOfWeek: 3, dayName: "Quarta-feira" },
    { dayOfWeek: 4, dayName: "Quinta-feira" },
    { dayOfWeek: 5, dayName: "Sexta-feira" },
    { dayOfWeek: 6, dayName: "Sábado" },
]

export function WeeklyAvailability({ availability, onUpdate }: WeeklyAvailabilityProps) {
    const handleAddSlot = (day: number) => {
        const currentSlots = availability[day] || []
        const newSlot: TimeSlot = { startTime: "09:00", endTime: "18:00" }
        onUpdate(day, [...currentSlots, newSlot])
    }

    const handleRemoveSlot = (day: number, index: number) => {
        const currentSlots = availability[day] || []
        const newSlots = currentSlots.filter((_, i) => i !== index)
        onUpdate(day, newSlots)
    }

    const handleUpdateSlot = (
        day: number,
        index: number,
        field: keyof TimeSlot,
        value: string
    ) => {
        const currentSlots = availability[day] || []
        const newSlots = currentSlots.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
        )
        onUpdate(day, newSlots)
    }

    const totalSlots = Object.values(availability).reduce(
        (acc, slots) => acc + slots.length,
        0
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Horários de Atendimento
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Configure seus horários disponíveis para cada dia da semana
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-foreground">{totalSlots}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                        {totalSlots === 1 ? "período" : "períodos"}
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                {daysOfWeek.map(({ dayOfWeek, dayName }) => (
                    <AvailabilityDayRow
                        key={dayOfWeek}
                        dayName={dayName}
                        dayOfWeek={dayOfWeek}
                        slots={availability[dayOfWeek] || []}
                        onAddSlot={handleAddSlot}
                        onRemoveSlot={handleRemoveSlot}
                        onUpdateSlot={handleUpdateSlot}
                    />
                ))}
            </div>
        </div>
    )
}
