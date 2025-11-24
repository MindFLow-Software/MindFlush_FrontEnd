"use client"

import { useEffect, useState } from "react"
import { CalendarPlus } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { RegisterAppointment } from "./register-appointment"

const appointmentsFilterSchema = z.object({
    name: z.string().optional(),
    status: z.string().optional(),
})

type AppointmentsFilterSchema = z.infer<typeof appointmentsFilterSchema>

export function AppointmentsTableFilters() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)

    // 1. Recupera valores iniciais da URL
    const name = searchParams.get("name")
    const status = searchParams.get("status")

    const { register, control, watch } = useForm<AppointmentsFilterSchema>({
        resolver: zodResolver(appointmentsFilterSchema),
        defaultValues: {
            name: name ?? "",
            status: status ?? "all",
        },
    })

    const watchedValues = watch()

    // 3. Efeito que atualiza a URL automaticamente (com debounce)
    useEffect(() => {
        const timeout = setTimeout(() => {
            const { name, status } = watchedValues

            setSearchParams((state) => {
                if (name) state.set("name", name)
                else state.delete("name")

                if (status && status !== "all") state.set("status", status)
                else state.delete("status")

                // Reseta para a primeira página ao filtrar
                state.set("pageIndex", "1")

                return state
            })
        }, 400) // Delay de 400ms para evitar muitas requisições enquanto digita

        return () => clearTimeout(timeout)
    }, [watchedValues, setSearchParams])


    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <form
                className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center"
                onSubmit={(e) => e.preventDefault()}
            >
                {/* Filtro por Nome do Paciente */}
                <Input
                    placeholder="Buscar por Nome do Paciente..."
                    className="h-8 w-full lg:w-[320px]"
                    {...register("name")}
                />

                {/* Filtro por Status */}
                <Controller
                    name="status"
                    control={control}
                    render={({ field: { name, onChange, value, disabled } }) => (
                        <Select
                            name={name}
                            onValueChange={onChange}
                            value={value}
                            disabled={disabled}
                        >
                            <SelectTrigger className="h-8 w-full lg:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="SCHEDULED">Agendado</SelectItem>
                                <SelectItem value="ATTENDING">Em andamento</SelectItem>
                                <SelectItem value="FINISHED">Concluído</SelectItem>
                                <SelectItem value="CANCELED">Cancelado</SelectItem>
                                <SelectItem value="NOT_ATTEND">Não compareceu</SelectItem>
                                <SelectItem value="RESCHEDULED">Remarcado</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </form>

            {/* Botão Novo Agendamento */}
            <div className="flex items-center">
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer"
                            onClick={() => setIsRegisterOpen(true)}
                        >
                            <CalendarPlus className="h-4 w-4" />
                            Novo agendamento
                        </Button>
                    </DialogTrigger>

                    {isRegisterOpen && <RegisterAppointment />}
                </Dialog>
            </div>
        </div>
    )
}