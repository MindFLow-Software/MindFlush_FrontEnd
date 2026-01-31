"use client"

import { useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

import { CalendarView } from "./components/calendar-view"
import { EditAppointment } from "./components/edit-appointment-dialog"
import { RescheduleAppointmentDialog } from "./components/reschedule-appointment-dialog"
import { CancelAppointmentDialog } from "./components/cancel-appointment-dialog"
import { RegisterAppointment } from "./components/register-appointment"

import { getAppointments, type GetAppointmentsResponse, type Appointment } from "@/api/get-appointment"
import { rescheduleAppointment } from "@/api/reschedule-appointment"
import { cancelAppointment } from "@/api/cancel-appointment"
import { useHeaderStore } from "@/hooks/use-header-store"
import { AppointmentsTableFilters } from "./components/appointments-table-filters"

export function AppointmentsList() {
    const { setTitle } = useHeaderStore()
    const queryClient = useQueryClient()
    const [searchParams] = useSearchParams()

    // Estados de Controle de Modais
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isCancelOpen, setIsCancelOpen] = useState(false)
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)

    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    useEffect(() => {
        setTitle('Meus Agendamentos')
    }, [setTitle])

    // Filtros e Parâmetros
    const pageIndex = z.coerce.number().transform((p) => p - 1).parse(searchParams.get("pageIndex") ?? "1")
    const status = searchParams.get("status")
    const name = searchParams.get("name")
    const perPage = 100

    // Busca de Dados
    const { data: result, isLoading, isError } = useQuery<GetAppointmentsResponse, Error>({
        queryKey: ["appointments", "calendar", pageIndex, status, name],
        queryFn: () => getAppointments({
            pageIndex,
            perPage,
            status: status === "all" ? null : status,
            name: name || undefined
        }),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    })

    // Tratamento de Dados (Memoizado como no PatientsList)
    const appointments = useMemo(() => {
        if (!result?.appointments) return []

        return result.appointments.map((app: Appointment) => {
            const raw = (app as any).props || app
            const p = raw.patient?.props || raw.patient || (app as any).patient || (app as any).user

            const firstName = p?.firstName || p?.first_name || raw.patientFirstName || ""
            const lastName = p?.lastName || p?.last_name || raw.patientLastName || ""
            let pName = `${firstName} ${lastName}`.trim()
            if (!pName || pName === "null null") pName = raw.patientName || "Paciente"

            const startDate = new Date(raw.scheduledAt || raw.date)
            const endDate = raw.endedAt ? new Date(raw.endedAt) : new Date(startDate.getTime() + 60 * 60 * 1000)

            // Formatação para visão mensal: "11h Nome"
            const displayTitle = `${format(startDate, "HH'h'")} ${pName}`

            return {
                ...app,
                title: displayTitle,
                start: startDate,
                end: endDate,
                patientName: pName
            }
        })
    }, [result])

    // Mutações
    const { mutateAsync: cancelFn, isPending: isCancelling } = useMutation({
        mutationFn: cancelAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            setIsCancelOpen(false)
            setIsEditOpen(false)
            toast.success("Agendamento cancelado!")
        }
    })

    const { mutateAsync: rescheduleFn, isPending: isRescheduling } = useMutation({
        mutationFn: rescheduleAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            setIsRescheduleOpen(false)
            setIsEditOpen(false)
            toast.success("Agendamento remarcado!")
        }
    })

    // Handlers
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
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <p className="text-destructive font-medium">Erro ao carregar agenda 😕</p>
                <button
                    onClick={() => queryClient.refetchQueries({ queryKey: ["appointments"] })}
                    className="text-sm underline text-muted-foreground hover:text-foreground"
                >
                    Tentar novamente
                </button>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Agenda" />

            <style dangerouslySetInnerHTML={{
                __html: `
                .rbc-month-view .rbc-event {
                    padding: 1px 6px !important;
                    font-size: 11px !important;
                    min-height: 18px !important;
                    margin-bottom: 1px !important;
                    border-radius: 4px !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    display: block !important;
                }
                .rbc-event-label { display: none !important; }
                .rbc-event-content { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            `}} />

            <div className="flex flex-col gap-5 mt-6 h-[calc(100vh-10rem)]">
                {/* Filtros e Botão Novo (Padrão PatientsTableFilters) */}
                <AppointmentsTableFilters onNewAppointment={() => setIsCreateOpen(true)} />

                <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden shadow-sm relative">
                    {isLoading ? (
                        <div className="h-full p-4"><Skeleton className="w-full h-full rounded-lg" /></div>
                    ) : (
                        <CalendarView
                            appointments={appointments}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                        />
                    )}
                </div>

                {/* Camada de Modais */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <RegisterAppointment
                        initialDate={selectedDate}
                        onSuccess={() => setIsCreateOpen(false)}
                    />
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    {selectedAppointment && (
                        <EditAppointment
                            appointment={selectedAppointment}
                            onClose={() => setIsEditOpen(false)}
                            onCancelTrigger={() => setIsCancelOpen(true)}
                            onRescheduleTrigger={() => setIsRescheduleOpen(true)}
                        />
                    )}
                </Dialog>

                <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                    <DialogContent className="p-0 border-none max-w-[400px] rounded-xl shadow-2xl bg-card">
                        {selectedAppointment && (
                            <CancelAppointmentDialog
                                patientName={(selectedAppointment as any).patientName}
                                isCancelling={isCancelling}
                                onClose={() => setIsCancelOpen(false)}
                                onCancel={async () => {
                                    const id = selectedAppointment.id || (selectedAppointment as any).props?.id
                                    if (id) await cancelFn(id)
                                }}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                    <DialogContent className="p-0 border-none max-w-md rounded-xl shadow-2xl bg-card">
                        {selectedAppointment && (
                            <RescheduleAppointmentDialog
                                patientName={(selectedAppointment as any).patientName}
                                isRescheduling={isRescheduling}
                                onClose={() => setIsRescheduleOpen(false)}
                                onReschedule={async (newDate) => {
                                    const id = selectedAppointment.id || (selectedAppointment as any).props?.id
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