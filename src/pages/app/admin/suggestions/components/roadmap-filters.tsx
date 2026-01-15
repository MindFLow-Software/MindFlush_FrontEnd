"use client"

import { useEffect, useRef } from "react"
import { Filter, Search, XCircle, LayoutGrid, Palette, CalendarDays, BarChart3, ShieldCheck, Share2, HelpCircle } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface RoadmapFiltersProps {
    search: string
    category: string
    onFiltersChange: (filters: { search?: string; category?: string }) => void
    onClearFilters: () => void
}

// Mapeamento de Ícones e Labels para Categorias
const CATEGORIES = [
    { value: "all", label: "Todas Categorias", icon: LayoutGrid, color: "text-slate-500" },
    { value: "UI_UX", label: "Interface / UX", icon: Palette, color: "text-pink-500" },
    { value: "SCHEDULING", label: "Agendamentos", icon: CalendarDays, color: "text-blue-500" },
    { value: "REPORTS", label: "Relatórios", icon: BarChart3, color: "text-amber-500" },
    { value: "PRIVACY_LGPD", label: "Privacidade", icon: ShieldCheck, color: "text-emerald-500" },
    { value: "INTEGRATIONS", label: "Integrações", icon: Share2, color: "text-indigo-500" },
    { value: "OTHERS", label: "Outros", icon: HelpCircle, color: "text-slate-400" },
]

export function RoadmapFilters({
    search,
    category,
    onFiltersChange,
    onClearFilters
}: RoadmapFiltersProps) {
    const isFirstRender = useRef(true)

    const { register, watch, setValue } = useForm({
        values: {
            search: search,
        },
    })

    const watchedSearch = watch("search")

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (watchedSearch === search) return

        const timeout = setTimeout(() => {
            onFiltersChange({ search: watchedSearch })
        }, 400)

        return () => clearTimeout(timeout)
    }, [watchedSearch, search, onFiltersChange])

    function handleClearFilters() {
        onClearFilters()
        setValue("search", "")
    }

    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">

                <div className="relative w-full lg:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        {...register("search")}
                        placeholder="Buscar sugestão..."
                        className="h-8 w-full lg:w-[320px] pl-9"
                    />
                </div>

                {/* Select de Categoria Padronizado */}
                <Select
                    value={category}
                    onValueChange={(value) => onFiltersChange({ category: value })}
                >
                    <SelectTrigger
                        className="cursor-pointer h-8 min-w-[180px] w-auto bg-background
            border-muted-foreground/20 hover:border-primary/30 transition-all
            shadow-sm px-3"
                    >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Categoria" />
                        </div>
                    </SelectTrigger>

                    <SelectContent className="min-w-[220px]">
                        {CATEGORIES.map((item) => {
                            const Icon = item.icon
                            return (
                                <SelectItem key={item.value} value={item.value} className="cursor-pointer py-2.5">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                        <Icon className={`h-4 w-4 ${item.color}`} />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>

                {(search || category !== "all") && (
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
        </div>
    )
}