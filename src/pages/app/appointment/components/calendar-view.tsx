"use client"

import { useState, useMemo } from "react"
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const locales = { "pt-BR": ptBR }
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

// Estilos CSS customizados para emular o Google Calendar com Soft UI
const calendarStyles = `
  .rbc-calendar { 
    font-family: inherit; 
    border: none !important;
  }
  
  /* Cabeçalho dos dias */
  .rbc-header { 
    padding: 16px 0 !important; 
    font-weight: 500 !important; 
    text-transform: uppercase; 
    font-size: 11px; 
    letter-spacing: 0.8px;
    color: var(--muted-foreground); 
    border-bottom: 1px solid var(--border) !important;
    border-left: none !important;
  }

  .rbc-time-view { border: none !important; }
  .rbc-month-view { border: none !important; }
  
  /* Linhas da grade */
  .rbc-time-content { border-top: 1px solid var(--border) !important; border-left: none !important; }
  .rbc-timeslot-group { border-bottom: 1px solid var(--border) !important; min-height: 50px !important; }
  .rbc-day-slot .rbc-time-slot { border-top: 1px solid var(--border) !important; opacity: 0.4; }
  .rbc-day-bg + .rbc-day-bg { border-left: 1px solid var(--border) !important; }
  .rbc-time-gutter .rbc-timeslot-group { border: none !important; }
  
  /* Gutter de tempo (lateral) */
  .rbc-label { 
    font-size: 11px; 
    color: var(--muted-foreground); 
    font-weight: 500;
    padding-right: 12px !important;
  }

  /* Hoje e Seleção */
  .rbc-today { background-color: transparent !important; }
  .rbc-today .rbc-header { color: var(--primary); font-weight: 800 !important; }
  
  /* Eventos (Chips) */
  .rbc-event { 
    padding: 0 !important; 
    border: none !important; 
    background-color: transparent !important;
  }
  
  .rbc-event-label { display: none !important; }

  .rbc-current-time-indicator { 
    background-color: var(--primary) !important; 
    height: 2px !important;
    z-index: 3;
  }
  
  .rbc-current-time-indicator::before {
    content: '';
    position: absolute;
    left: -5px;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary);
  }
`;

const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate("PREV")
    const goToNext = () => toolbar.onNavigate("NEXT")
    const goToToday = () => toolbar.onNavigate("TODAY")

    return (
        <div className="flex items-center justify-between px-8 py-4 bg-card border-b border-border/50">
            <div className="flex items-center gap-6">
                {/* Botão hoje estilo Google */}
                <Button
                    variant="outline"
                    onClick={goToToday}
                    className="h-9 px-4 text-sm font-bold border-border/60 hover:bg-muted transition-all rounded-md shadow-sm"
                >
                    Hoje
                </Button>

                {/* Navegação */}
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={goToBack} className="h-9 w-9 rounded-full hover:bg-muted">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={goToNext} className="h-9 w-9 rounded-full hover:bg-muted">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                {/* Data Atual */}
                <span className="text-xl font-medium text-foreground tracking-tight first-letter:uppercase">
                    {format(toolbar.date, "MMMM 'de' yyyy", { locale: ptBR })}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <Select value={toolbar.view} onValueChange={(v) => toolbar.onView(v)}>
                    <SelectTrigger className="w-[120px] h-9 text-xs font-bold uppercase tracking-wider bg-muted/30 border-none shadow-none focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="month">Mês</SelectItem>
                        <SelectItem value="week">Semana</SelectItem>
                        <SelectItem value="day">Dia</SelectItem>
                        <SelectItem value="agenda">Agenda</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

const CustomEvent = ({ event }: { event: any }) => {
    const status = event.resource?.status || 'SCHEDULED';

    // Mapeamento de cores estilo Google Calendar (Pastel bg + Dark accent)
    const statusColors: Record<string, string> = {
        SCHEDULED: "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400",
        ATTENDING: "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400",
        FINISHED: "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400",
        CANCELED: "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400",
        NOT_ATTEND: "bg-slate-500/10 border-slate-500 text-slate-700 dark:text-slate-400",
    }

    const colorClass = statusColors[status] || statusColors.SCHEDULED;

    return (
        <div className={cn(
            "h-full w-full px-2 py-1 flex flex-col border-l-[3px] rounded-r-[4px] transition-all hover:brightness-95 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
            colorClass
        )}>
            <span className="font-bold text-[11px] truncate leading-tight">
                {event.title}
            </span>
            <span className="text-[10px] font-medium opacity-80 mt-0.5">
                {format(event.start, "HH:mm")}
            </span>
        </div>
    )
}

export function CalendarView({ appointments, onSelectSlot, onSelectEvent }: any) {
    const [view, setView] = useState<View>(Views.WEEK)
    const [date, setDate] = useState(new Date())

    const events = useMemo(() => {
        return appointments.map((apt: any) => ({
            id: apt.id,
            title: apt.title,
            start: apt.start,
            end: apt.end,
            resource: apt,
        })).filter((e: any) => !isNaN(e.start.getTime()))
    }, [appointments])

    return (
        <div className="h-full flex flex-col bg-card relative">
            <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />

            <Calendar
                localizer={localizer}
                events={events}
                date={date}
                onNavigate={setDate}
                view={view}
                onView={setView}
                culture="pt-BR"
                components={{
                    toolbar: CustomToolbar,
                    event: CustomEvent,
                }}
                step={30}
                timeslots={2}
                selectable
                onSelectSlot={({ start }) => onSelectSlot(start)}
                onSelectEvent={(event) => onSelectEvent(event.resource)}
            />

            {/* Botão flutuante estilo Google FAB */}
            <Button
                onClick={() => onSelectSlot(new Date())}
                className="absolute bottom-8 right-8 h-14 w-14 rounded-2xl shadow-2xl bg-primary hover:scale-105 transition-transform z-50 p-0"
            >
                <Plus className="h-8 w-8 text-white" />
            </Button>
        </div>
    )
}