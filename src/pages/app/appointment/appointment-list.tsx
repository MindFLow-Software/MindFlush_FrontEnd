"use client"

import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

// Componentes UI
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

// Componentes da Funcionalidade
import { AppointmentsTableFilters } from "./components/appointments-table-filters"
import { CalendarView } from "./components/calendar-view" // Seu novo componente

import { getAppointments, type GetAppointmentsResponse, type Appointment } from "@/api/get-appointment"
import { useHeaderStore } from "@/hooks/use-header-store"
import { EditAppointment } from "./components/edit-appointment-dialog"
import { RegisterAppointment } from "./components/register-appointment"

export function AppointmentsList() {
    const { setTitle } = useHeaderStore()

    // Estados para Modais e Seleções
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    useEffect(() => {
        setTitle('Meus Agendamentos')
    }, [setTitle])

    const [searchParams] = useSearchParams()

    const pageIndex = z.coerce
        .number()
        .int()
        .min(1)
        .catch(1)
        .transform((page) => page - 1)
        .parse(searchParams.get("pageIndex") ?? "1")

    const status = searchParams.get("status")
    const name = searchParams.get("name")

    // NOTA: Para o calendário, aumentamos o limite para garantir que preencha a tela.
    // O ideal seria filtrar por data (startDate, endDate), mas vamos usar paginação alta por enquanto.
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
        staleTime: 1000 * 60 * 5,
    })

    const appointments = result?.appointments ?? []

    // 1. Clicou num espaço vazio (Novo Agendamento)
    const handleSelectSlot = (date: Date) => {
        setSelectedDate(date)
        setIsCreateOpen(true)
    }

    // 2. Clicou num evento existente (Editar Agendamento)
    const handleSelectEvent = (appointment: Appointment) => {
        setSelectedAppointment(appointment)
        setIsEditOpen(true)
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)] flex-col gap-2">
                <p className="text-red-500 font-medium">Erro ao carregar calendário 😕</p>
                <p className="text-sm text-muted-foreground">Tente recarregar a página.</p>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Calendário" />

            <div className="flex flex-col gap-4 mt-4 h-full">
                {/* Mantivemos os filtros, pois funcionam bem com o calendário */}
                <div className="space-y-2.5">
                    <AppointmentsTableFilters />
                </div>

                {isLoading ? (
                    <div className="rounded-md border p-4 space-y-4 h-[750px] bg-background">
                        <div className="flex justify-between items-center mb-6">
                            <Skeleton className="h-8 w-40" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-4 h-full">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <Skeleton key={i} className="h-full w-full opacity-20" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <CalendarView
                        appointments={appointments}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                    />
                )}

                {/* MODAL: Novo Agendamento (Abre ao clicar na data/hora) */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <RegisterAppointment
                        initialDate={selectedDate}
                        onSuccess={() => setIsCreateOpen(false)}
                    />
                </Dialog>

                {/* MODAL: Editar Agendamento (Abre ao clicar no card) */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        {selectedAppointment && (
                            <EditAppointment
                                appointment={selectedAppointment}
                                onClose={() => setIsEditOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}