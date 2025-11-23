"use client"

import { useState, useEffect } from "react"
import { CalendarPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { RegisterAppointment } from "./register-appointment"

// 1. Definição do Schema de Filtros
const appointmentsFilterSchema = z.object({
    cpf: z.string().optional(),
    name: z.string().optional(),
    status: z.string().optional(),
})

type AppointmentsFilterSchema = z.infer<typeof appointmentsFilterSchema>

export function AppointmentsTableFilters() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)

    // 2. Recupera valores iniciais da URL
    const cpf = searchParams.get("cpf")
    const name = searchParams.get("name")
    const status = searchParams.get("status")

    // 3. Configura o React Hook Form
    const { register, watch, setValue } = useForm<AppointmentsFilterSchema>({
        resolver: zodResolver(appointmentsFilterSchema),
        defaultValues: {
            cpf: cpf ?? "",
            name: name ?? "",
            status: status ?? "all",
        },
    })

    // 4. Observa as mudanças nos campos
    const watchedCpf = watch("cpf")
    const watchedName = watch("name")
    const watchedStatus = watch("status")

    // 5. Função que atualiza a URL
    function applyFilters({ cpf, name, status }: AppointmentsFilterSchema) {
        setSearchParams((state) => {
            if (cpf) state.set("cpf", cpf)
            else state.delete("cpf")

            if (name) state.set("name", name)
            else state.delete("name")

            if (status && status !== "all") state.set("status", status)
            else state.delete("status")

            state.set("pageIndex", "0") // Reseta para a primeira página ao filtrar
            return state
        })
    }

    // 7. Efeito de Debounce (Executa a busca após o usuário parar de digitar)
    useEffect(() => {
        const timeout = setTimeout(() => {
            applyFilters({
                cpf: watchedCpf,
                name: watchedName,
                status: watchedStatus,
            })
        }, 400) // Delay de 400ms

        return () => clearTimeout(timeout)
    }, [watchedCpf, watchedName, watchedStatus])

    // Lógica visual para limpar campos conflitantes (se preencher CPF, limpa Nome, etc - opcional, mantido do seu exemplo original)
    useEffect(() => {
        if (watchedCpf && watchedName) {
           // Se quiser manter comportamento exclusivo, descomente abaixo:
           // if (document.activeElement?.getAttribute('name') === 'cpf') setValue('name', '')
           // else setValue('cpf', '')
        }
    }, [watchedCpf, watchedName, setValue])

    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_180px_auto] gap-2 flex-1 items-center">

                <Input
                    placeholder="Buscar por Nome..."
                    className="h-9"
                    {...register("name")}
                />             
            </div>

            {/* Botão de Novo Agendamento */}
            <div className="flex items-center">
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer"
                        >
                            <CalendarPlus className="h-4 w-4" />
                            Novo agendamento
                        </Button>
                    </DialogTrigger>
                    
                    {isRegisterOpen && (
                         <DialogContent>
                            <RegisterAppointment />
                         </DialogContent>
                    )}
                </Dialog>
            </div>
        </div>
    )
}