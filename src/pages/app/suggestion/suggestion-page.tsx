"use client"

import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import {
    LayoutGrid,
    Rocket,
    Microscope,
    PartyPopper,
    Search,
    XCircle,
    Plus,
    Lightbulb
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { useHeaderStore } from "@/hooks/use-header-store"
import { getSuggestions } from "@/api/get-suggestions"
import { SuggestionColumn } from "./components/suggestion-column"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CreateSuggestion } from "./components/create-suggestion"
import { SuggestionHelpButton } from "./components/suggestion-help-button"

const BRAND_COLOR = "#27187E"

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

const COLUMN_CONFIG = [
    {
        title: "Votação",
        icon: Lightbulb,
        status: "OPEN",
        color: "bg-blue-200",
        dotColor: "bg-blue-500",
        iconColor: "text-blue-800"
    },
    {
        title: "Em Estudo",
        icon: Microscope,
        status: "UNDER_REVIEW",
        color: "bg-purple-200",
        dotColor: "bg-purple-500",
        iconColor: "text-purple-800"
    },
    {
        title: "Implementando",
        icon: Rocket,
        status: "PLANNED",
        color: "bg-slate-300",
        dotColor: "bg-slate-500",
        iconColor: "text-slate-800"
    },
    {
        title: "Concluído",
        icon: PartyPopper,
        status: "IMPLEMENTED",
        color: "bg-emerald-200",
        dotColor: "bg-emerald-500",
        iconColor: "text-emerald-800"
    },
] as const

export function SuggestionPage() {
    const { setTitle } = useHeaderStore()
    const [search, setSearch] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const debouncedSearch = useDebounce(search, 400)

    useEffect(() => {
        setTitle("Envios da Comunidade")
    }, [setTitle])

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["suggestions", debouncedSearch],
        queryFn: () => getSuggestions({
            search: debouncedSearch,
            sortBy: 'most_voted'
        }),
    })

    const filterByStatus = (status: string) => suggestions?.filter((s) => s.status === status) || []

    function handleClearFilters() {
        setSearch("")
    }

    return (
        <>
            <Helmet title="Envios da Comunidade" />

            <div className="flex flex-col gap-6 mt-4 h-[calc(100vh-160px)] overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 pl-5 py-2" style={{ borderLeftColor: BRAND_COLOR }}>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                            <LayoutGrid className="size-6" style={{ color: BRAND_COLOR }} />
                            <span>Sugestões da Comunidade</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            As sugestões passam por moderação antes de aparecerem para a comunidade.
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="cursor-pointer gap-2 w-full lg:w-auto shrink-0 bg-blue-700 hover:bg-blue-800 shadow-sm transition-all">
                                <Plus className="h-4 w-4" />
                                Nova sugestão
                            </Button>
                        </DialogTrigger>
                        <CreateSuggestion onSuccess={() => setIsCreateOpen(false)} />
                    </Dialog>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 items-center p-2 rounded-lg">
                    <div className="relative w-full lg:w-auto">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Buscar ideias aprovadas..."
                            className="h-8 w-full lg:w-[400px] pl-9 bg-white shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="cursor-pointer h-8 px-2 text-muted-foreground hover:text-destructive gap-2 transition-colors"
                        >
                            <XCircle className="size-4" />
                            Limpar busca
                        </Button>
                    )}
                </div>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 h-full min-h-0 auto-cols-fr"
                    role="region"
                >
                    {COLUMN_CONFIG.map((column) => {
                        const Icon = column.icon
                        return (
                            <SuggestionColumn
                                key={column.status}
                                title={column.title}
                                icon={<Icon className={`size-5 ${column.iconColor}`} />}
                                color={column.color}
                                dotColor={column.dotColor}
                                suggestions={filterByStatus(column.status)}
                                isLoading={isLoading}
                            />
                        )
                    })}
                </div>
            </div>

            <SuggestionHelpButton />
        </>
    )
}