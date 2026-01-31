"use client"

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { CalendarClock, Info, Loader2 } from 'lucide-react'

import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { useHeaderStore } from "@/hooks/use-header-store"
import { ScheduleManager } from './components/schedule-manager'

interface AvailabilityData {
    dayOfWeek: number
    startTime: string
    endTime: string
}

export function AvailabilityPage() {
    const { setTitle } = useHeaderStore()

    const [initialData, setInitialData] = useState<AvailabilityData[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTitle('Horários de Atendimento')
    }, [setTitle])

    useEffect(() => {
        async function fetchAvailability() {
            try {
                const response = await api.get('/availabilities')
                setInitialData(response.data.availabilities)
            } catch (error) {
                toast.error('Não foi possível carregar sua agenda atual.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchAvailability()
    }, [])

    return (
        <>
            <Helmet title="Horários de Atendimento" />

            <div className="flex flex-col gap-5 mt-6 px-2 pb-8">
                <header className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <CalendarClock className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Minha Agenda de Atendimento
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Configure os horários recorrentes em que você estará disponível para novos agendamentos.
                    </p>
                </header>

                <div className="bg-primary/5 border-l-4 border-primary p-4 flex gap-3 rounded-r-xl">
                    <Info className="text-primary shrink-0 size-5" />
                    <div className="space-y-1">
                        <p className="text-sm text-foreground font-semibold">Como funciona?</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Os horários definidos aqui serão usados para gerar os slots disponíveis para seus pacientes.
                            Se você tiver um agendamento já marcado, aquele horário será removido automaticamente da lista de seleção do paciente.
                        </p>
                    </div>
                </div>

                <div className="border-t border-border" />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin h-10 w-10 text-primary" />
                        <p className="text-sm text-muted-foreground animate-pulse">Carregando sua agenda...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ScheduleManager defaultData={initialData || []} />
                    </div>
                )}
            </div>
        </>
    )
}