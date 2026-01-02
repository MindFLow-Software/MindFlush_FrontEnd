"use client" // Adicionado para seguir o padrão do seu Dashboard

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { CalendarClock, Info } from 'lucide-react'

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

            <div className="flex flex-col gap-8 p-8 max-w-[1000px] mx-auto">
                <header className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <CalendarClock className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Minha Agenda de Atendimento
                        </h1>
                    </div>
                    <p className="text-gray-500">
                        Configure os horários recorrentes em que você estará disponível para novos agendamentos.
                    </p>
                </header>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 flex gap-3">
                    <Info className="text-blue-500 shrink-0" />
                    <p className="text-sm text-blue-700">
                        <strong>Como funciona?</strong> Os horários definidos aqui serão usados para gerar os slots
                        disponíveis para seus pacientes. Se você tiver um agendamento já marcado,
                        aquele horário será removido automaticamente da lista do paciente.
                    </p>
                </div>

                <hr />

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <ScheduleManager defaultData={initialData || []} />
                )}
            </div>
        </>
    )
}