"use client"

import { useState, useMemo } from "react"
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutGrid, List, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type Appointment } from "@/api/get-appointment"

const locales = { "pt-BR": ptBR }
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const calendarStyles = `
  .rbc-calendar { font-family: inherit; border: none !important; background: transparent; }
  .rbc-header { 
    padding: 12px 8px !important; 
    font-weight: 600 !important; 
    text-transform: capitalize; 
    font-size: 13px; 
    color: var(--foreground); 
    border-bottom: 1px solid var(--border) !important;
    background: var(--muted);
  }
  .rbc-time-view, .rbc-month-view { 
    border: 1px solid var(--border) !important; 
    border-radius: 12px !important;
    overflow: hidden;
    background: var(--card);
  }
  .rbc-event { 
    padding: 0 !important; 
    border: none !important; 
    background-color: transparent !important; 
  }
  .rbc-off-range-bg { background-color: var(--muted) !important; opacity: 0.5; }
  .rbc-today { background-color: var(--primary/5) !important; }
  .rbc-event-label { display: none !important; }
`

const statusConfig = {
    SCHEDULED: {
        bg: "bg-blue-50 dark:bg-blue-950/50",
        border: "border-l-blue-500",
        text: "text-blue-700 dark:text-blue-300",
        dot: "bg-blue-500",
        label: "Agendado"
    },
    RESCHEDULED: {
        bg: "bg-purple-50 dark:bg-purple-950/50",
        border: "border-l-purple-500",
        text: "text-purple-700 dark:text-purple-300",
        dot: "bg-purple-500",
        label: "Remarcado"
    },
    ATTENDING: {
        bg: "bg-amber-50 dark:bg-amber-950/50",
        border: "border-l-amber-500",
        text: "text-amber-700 dark:text-amber-300",
        dot: "bg-amber-500",
        label: "Em atendimento"
    },
    FINISHED: {
        bg: "bg-emerald-50 dark:bg-emerald-950/50",
        border: "border-l-emerald-500",
        text: "text-emerald-700 dark:text-emerald-300",
        dot: "bg-emerald-500",
        label: "Finalizado"
    },
    CANCELED: {
        bg: "bg-rose-50 dark:bg-rose-950/50",
        border: "border-l-rose-500",
        text: "text-rose-700 dark:text-rose-300",
        dot: "bg-rose-500",
        label: "Cancelado"
    },
    NOT_ATTEND: {
        bg: "bg-slate-50 dark:bg-slate-900/50",
        border: "border-l-slate-400",
        text: "text-slate-600 dark:text-slate-400",
        dot: "bg-slate-400",
        label: "Não compareceu"
    },
} as const

type AppointmentStatus = keyof typeof statusConfig

interface CalendarAppointment extends Appointment {
    [key: string]: any
}

interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    resource: CalendarAppointment
}

const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    const status = event.resource?.status || "SCHEDULED"
    const config = statusConfig[status as AppointmentStatus] || statusConfig.SCHEDULED

    return (
        <div className={cn(
            "h-full w-full px-2 py-1 flex flex-col border-l-[3px] rounded-r-md transition-all cursor-pointer",
            config.bg,
            config.border
        )}>
            <div className="flex items-center gap-1.5 overflow-hidden">
                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
                <span className={cn("font-bold text-[10px] truncate leading-tight", config.text)}>
                    {event.title}
                </span>
            </div>
        </div>
    )
}

const viewOptions = [
    { value: Views.MONTH, label: "Mês", icon: LayoutGrid },
    { value: Views.WEEK, label: "Semana", icon: CalendarIcon },
    { value: Views.DAY, label: "Dia", icon: Clock },
    { value: Views.AGENDA, label: "Lista", icon: List },
] as const

const CustomToolbar = ({ date, view, onNavigate, onView }: any) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-border bg-muted/10">
            <div className="flex items-center gap-4">
                <div className="flex bg-background border border-border rounded-lg p-1">
                    <Button variant="ghost" size="icon" onClick={() => onNavigate("PREV")} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onNavigate("NEXT")} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                    {format(date, "MMMM yyyy", { locale: ptBR })}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onNavigate("TODAY")} className="h-8 font-bold uppercase text-[10px]">Hoje</Button>
                <div className="flex bg-background border border-border rounded-lg p-1">
                    {viewOptions.map((opt) => (
                        <Button
                            key={opt.value}
                            variant={view === opt.value ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => onView(opt.value)}
                            className="h-7 px-3 text-[10px] font-bold uppercase"
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface CalendarViewProps {
    appointments: Appointment[]
    onSelectSlot: (date: Date) => void
    onSelectEvent: (appointment: Appointment) => void
}

export function CalendarView({ appointments, onSelectSlot, onSelectEvent }: CalendarViewProps) {
    const [view, setView] = useState<View>(Views.WEEK)
    const [date, setDate] = useState(new Date())

    const events = useMemo<CalendarEvent[]>(() => {
        return appointments
            .map((apt) => {
                const raw = (apt as any).props || apt
                const startDate = apt.start || new Date(raw.scheduledAt || "")
                const endDate = apt.end || new Date(raw.endedAt || startDate.getTime() + 3600000)

                return {
                    id: apt.id || raw.id || Math.random().toString(),
                    title: apt.title || "Consulta",
                    start: startDate,
                    end: endDate,
                    resource: apt as CalendarAppointment,
                }
            })
            .filter((e) => e.start && !isNaN(e.start.getTime()))
    }, [appointments])

    return (
        <div className="h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />

            <Calendar<CalendarEvent, CalendarAppointment>
                localizer={localizer}
                events={events}
                date={date}
                onNavigate={setDate}
                view={view}
                onView={setView}
                culture="pt-BR"
                messages={{
                    showMore: (total) => `+${total} mais`,
                    noEventsInRange: "Sem agendamentos",
                }}
                components={{
                    event: CustomEvent,
                    toolbar: (props: any) => <CustomToolbar {...props} />,
                }}
                step={30}
                timeslots={2}
                selectable
                onSelectSlot={({ start }) => onSelectSlot(start as Date)}
                onSelectEvent={(event) => onSelectEvent(event.resource)}
                min={new Date(0, 0, 0, 7, 0, 0)}
                max={new Date(0, 0, 0, 21, 0, 0)}
            />

            <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-border bg-muted/30">
                {Object.entries(statusConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <div className={cn("w-2 h-2 rounded-full", config.dot)} />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{config.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}