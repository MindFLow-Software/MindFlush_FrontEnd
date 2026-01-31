"use client"

import { useEffect, useRef } from "react"
import {
    CalendarCheck2,
    CheckCircle2,
    Filter,
    Plus,
    Search,
    Users,
    XCircle,
    Activity,
    History
} from "lucide-react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AppointmentsTableFiltersProps {
    onNewAppointment: () => void
}

export function AppointmentsTableFilters({ onNewAppointment }: AppointmentsTableFiltersProps) {
    const [searchParams, setSearchParams] = useSearchParams()
    const isFirstRender = useRef(true)

    const name = searchParams.get("name") ?? ""
    const status = searchParams.get("status") ?? "all"

    const { register, watch, setValue } = useForm({
        values: {
            name: name,
        },
    })

    const watchedName = watch("name")

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (watchedName === name) return

        const timeout = setTimeout(() => {
            setSearchParams((state) => {
                if (watchedName) state.set("name", watchedName)
                else state.delete("name")
                state.set("pageIndex", "1")
                return state
            })
        }, 400)

        return () => clearTimeout(timeout)
    }, [watchedName, name, setSearchParams])

    function handleStatusChange(value: string) {
        setSearchParams((state) => {
            if (value !== "all") state.set("status", value)
            else state.delete("status")
            state.set("pageIndex", "1")
            return state
        })
    }

    function handleClearFilters() {
        setValue("name", "")
        setSearchParams((state) => {
            state.delete("name")
            state.delete("status")
            state.set("pageIndex", "1")
            return state
        })
    }

    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
                {/* Campo de Busca */}
                <div className="relative w-full lg:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        {...register("name")}
                        placeholder="Buscar por paciente..."
                        className="h-9 w-full lg:w-[320px] pl-9 bg-card border-border rounded-xl focus-visible:ring-primary"
                    />
                </div>

                {/* Seletor de Status */}
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger
                        className="cursor-pointer h-9 min-w-[180px] w-auto bg-card
            border-border hover:border-primary/30 transition-all
            shadow-sm px-3 rounded-xl"
                    >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>

                    <SelectContent className="min-w-[220px] bg-popover border-border rounded-xl">
                        <SelectItem value="all" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Users className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Todos os status</span>
                            </div>
                        </SelectItem>

                        <SelectItem value="SCHEDULED" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <CalendarCheck2 className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Agendados</span>
                            </div>
                        </SelectItem>

                        <SelectItem value="RESCHEDULED" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <History className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium">Remarcados</span>
                            </div>
                        </SelectItem>

                        <SelectItem value="ATTENDING" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Activity className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-medium">Em atendimento</span>
                            </div>
                        </SelectItem>

                        <SelectItem value="FINISHED" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-medium">Finalizados</span>
                            </div>
                        </SelectItem>

                        <SelectItem value="CANCELED" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <XCircle className="h-4 w-4 text-rose-500" />
                                <span className="text-sm font-medium">Cancelados</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Botão Limpar Filtros */}
                {(name || status !== "all") && (
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={handleClearFilters}
                        className="cursor-pointer h-8 px-2 lg:px-3 text-muted-foreground hover:text-destructive gap-2 transition-colors"
                    >
                        <XCircle className="h-4 w-4" />
                        Limpar filtros
                    </Button>
                )}
            </div>

            <div className="flex items-center">
                <Button
                    onClick={onNewAppointment}
                    className="h-10 gap-2 w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-primary/20 cursor-pointer transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Nova Consulta
                </Button>
            </div>
        </div>
    )
}