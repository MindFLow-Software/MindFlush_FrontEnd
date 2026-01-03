"use client"

import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { toast } from "sonner"
import { CalendarIcon, Plus } from "lucide-react"

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { AppointmentsTableFilters } from "./components/appointments-table-filters"
import { CalendarView } from "./components/calendar-view"
import { EditAppointment } from "./components/edit-appointment-dialog"
import { RegisterAppointment } from "./components/register-appointment"
import { RescheduleAppointmentDialog } from "./components/reschedule-appointment-dialog"
import { CancelAppointmentDialog } from "./components/cancel-appointment-dialog"

import { getAppointments, type GetAppointmentsResponse, type Appointment } from "@/api/get-appointment"
import { rescheduleAppointment } from "@/api/reschedule-appointment"
import { cancelAppointment } from "@/api/cancel-appointment"
import { useHeaderStore } from "@/hooks/use-header-store"

export function AppointmentsList() {
    const { setTitle } = useHeaderStore()
    const queryClient = useQueryClient()
    const [searchParams] = useSearchParams()

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isCancelOpen, setIsCancelOpen] = useState(false)
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)

    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    useEffect(() => {
        setTitle('Meus Agendamentos')
    }, [setTitle])

    const pageIndex = z.coerce
        .number()
        .transform((page) => page - 1)
        .parse(searchParams.get("pageIndex") ?? "1")

    const status = searchParams.get("status")
    const name = searchParams.get("name")
    const perPage = 100

    const { data: result, isLoading, isError } = useQuery<GetAppointmentsResponse, Error>({
        queryKey: ["appointments", "calendar", pageIndex, status, name],
        queryFn: () =>
            getAppointments({
                pageIndex,
                perPage,
                status: status === "all" ? null : status,
                name: name || undefined,
            }),
        select: (data) => ({
            ...data,
            appointments: data.appointments.map((app: any) => {
                const raw = app.props || app
                const p = raw.patient?.props || raw.patient || app.patient || raw.user

                const apiName = raw.patientName || app.patientName || raw.patient_name || app.patient_name
                const firstName = p?.firstName || p?.first_name || raw.patientFirstName || ""
                const lastName = p?.lastName || p?.last_name || raw.patientLastName || ""

                let pName = `${firstName} ${lastName}`.trim()
                if (!pName || pName === "null null") pName = apiName
                if (!pName) pName = "Paciente"

                const scheduledAtValue = raw.scheduledAt || raw.date || app.scheduledAt || raw.scheduled_at
                const startDate = new Date(scheduledAtValue)

                const endedAtValue = raw.endedAt || raw.ended_at
                const endDate = endedAtValue
                    ? new Date(endedAtValue)
                    : new Date(startDate.getTime() + 60 * 60 * 1000)

                return {
                    ...app,
                    id: app.id || raw.id,
                    title: pName,
                    start: startDate,
                    end: endDate,
                    patientName: pName,
                    status: raw.status || app.status
                }
            })
        }),
        staleTime: 1000 * 60 * 5,
    })

    const { mutateAsync: cancelFn, isPending: isCancelling } = useMutation({
        mutationFn: cancelAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            setIsCancelOpen(false)
            setIsEditOpen(false)
            toast.success("Agendamento cancelado com sucesso!")
        }
    })

    const { mutateAsync: rescheduleFn, isPending: isRescheduling } = useMutation({
        mutationFn: rescheduleAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            setIsRescheduleOpen(false)
            setIsEditOpen(false)
            toast.success("Agendamento remarcado com sucesso!")
        }
    })

    const handleSelectSlot = (date: Date) => {
        setSelectedDate(date)
        setIsCreateOpen(true)
    }

    const handleSelectEvent = (appointment: Appointment) => {
        setSelectedAppointment(appointment)
        setIsEditOpen(true)
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4 bg-background">
                <p className="text-destructive font-bold uppercase tracking-widest text-xs">Erro na sincronização</p>
                <Button variant="outline" onClick={() => queryClient.refetchQueries({ queryKey: ["appointments"] })}>
                    Tentar novamente
                </Button>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Agenda" />

            <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
                <div className="flex items-center px-8 py-3 gap-6 bg-card border-b border-border/40 shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                            <CalendarIcon className="size-5" />
                        </div>
                        <h1 className="text-sm font-bold uppercase tracking-widest text-foreground/80 hidden sm:block">
                            Agenda
                        </h1>
                    </div>

                    <div className="flex-1">
                        <AppointmentsTableFilters />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {isLoading ? (
                        <div className="h-full p-8">
                            <div className="w-full h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl grid grid-cols-7 bg-card overflow-hidden">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className="border-r border-border/40 last:border-r-0 p-6 space-y-6">
                                        <div className="flex flex-col items-center gap-2 mb-10">
                                            <Skeleton className="h-2 w-8 opacity-40" />
                                            <Skeleton className="h-9 w-9 rounded-full" />
                                        </div>
                                        <Skeleton className="h-32 w-full rounded-xl opacity-20" />
                                        <Skeleton className="h-20 w-full rounded-xl opacity-10" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full">
                            <CalendarView
                                appointments={result?.appointments ?? []}
                                onSelectSlot={handleSelectSlot}
                                onSelectEvent={handleSelectEvent}
                            />
                        </div>
                    )}
                </div>

                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => {
                                    handleSelectSlot(new Date())
                                }}
                                className="absolute bottom-8 right-8 h-14 w-14 rounded-2xl shadow-2xl bg-primary hover:scale-105 hover:shadow-primary/20 transition-all z-50 p-0"
                            >
                                <Plus className="h-8 w-8 text-white" />
                                <span className="sr-only">Novo agendamento</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            side="left"
                            className="flex items-center gap-2 bg-zinc-900 text-zinc-50 border-none px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-xl"
                        >
                            <p>Novo Agendamento</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <RegisterAppointment
                        initialDate={selectedDate}
                        onSuccess={() => {
                            queryClient.invalidateQueries({ queryKey: ["appointments"] })
                            setIsCreateOpen(false)
                        }}
                    />
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                        <DialogTitle className="sr-only">Detalhes</DialogTitle>
                        <DialogDescription className="sr-only">Ações da sessão</DialogDescription>
                        {selectedAppointment && (
                            <EditAppointment
                                appointment={selectedAppointment}
                                onClose={() => setIsEditOpen(false)}
                                onCancelTrigger={() => setIsCancelOpen(true)}
                                onRescheduleTrigger={() => setIsRescheduleOpen(true)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                    <DialogContent className="p-0 border-none max-w-[400px] rounded-xl shadow-2xl">
                        {selectedAppointment && (
                            <CancelAppointmentDialog
                                patientName={(selectedAppointment as any).patientName}
                                isCancelling={isCancelling}
                                onClose={() => setIsCancelOpen(false)}
                                onCancel={async () => {
                                    const raw = (selectedAppointment as any).props || selectedAppointment
                                    const id = selectedAppointment.id || raw.id
                                    if (id) await cancelFn(id)
                                }}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                    <DialogContent className="p-0 border-none max-w-md rounded-xl shadow-2xl">
                        {selectedAppointment && (
                            <RescheduleAppointmentDialog
                                patientName={(selectedAppointment as any).patientName}
                                isRescheduling={isRescheduling}
                                onClose={() => setIsRescheduleOpen(false)}
                                onReschedule={async (newDate) => {
                                    const raw = (selectedAppointment as any).props || selectedAppointment
                                    const id = selectedAppointment.id || raw.id
                                    if (id) await rescheduleFn({ appointmentId: id, newDate })
                                }}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}