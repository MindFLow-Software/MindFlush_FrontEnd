"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
    Filter,
    Search,
    XCircle,
    LayoutGrid,
    Palette,
    CalendarDays,
    BarChart3,
    ShieldCheck,
    Share2,
    HelpCircle,
    Loader2
} from "lucide-react"
import { useForm } from "react-hook-form"
import { Helmet } from "react-helmet-async"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useHeaderStore } from "@/hooks/use-header-store"
import { getSuggestions } from "@/api/get-suggestions"
import { updateSuggestionStatus } from "@/api/update-suggestion-status"
import { RoadmapCard } from "./components/roadmap-card"

const CATEGORIES = [
    { value: "all", label: "Todas Categorias", icon: LayoutGrid, color: "text-slate-500" },
    { value: "UI_UX", label: "Interface / UX", icon: Palette, color: "text-pink-500" },
    { value: "SCHEDULING", label: "Agendamentos", icon: CalendarDays, color: "text-blue-500" },
    { value: "REPORTS", label: "Relatórios", icon: BarChart3, color: "text-amber-500" },
    { value: "PRIVACY_LGPD", label: "Privacidade", icon: ShieldCheck, color: "text-emerald-500" },
    { value: "INTEGRATIONS", label: "Integrações", icon: Share2, color: "text-indigo-500" },
    { value: "OTHERS", label: "Outros", icon: HelpCircle, color: "text-slate-400" },
]

export function SuggestionsManagement() {
    const queryClient = useQueryClient()
    const isFirstRender = useRef(true)
    const { setTitle } = useHeaderStore()

    const [search, setSearch] = useState("")
    const [category, setCategory] = useState<string>("all")

    useEffect(() => {
        setTitle('Gestão de Sugestões')
    }, [setTitle])

    const { register, watch, setValue } = useForm({
        values: { search: search },
    })

    const watchedSearch = watch("search")

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        if (watchedSearch === search) return

        const timeout = setTimeout(() => {
            setSearch(watchedSearch)
        }, 400)

        return () => clearTimeout(timeout)
    }, [watchedSearch, search])

    const handleClearFilters = useCallback(() => {
        setSearch("")
        setCategory("all")
        setValue("search", "")
    }, [setValue])

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["admin", "roadmap", search, category],
        queryFn: () => getSuggestions({
            status: ["OPEN", "UNDER_REVIEW", "PLANNED", "IMPLEMENTED"],
            search: search || undefined,
            category: category === "all" ? undefined : category
        }),
    })

    const { mutate: changeStatus, isPending } = useMutation({
        mutationFn: updateSuggestionStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "roadmap"] })
            queryClient.removeQueries({ queryKey: ["suggestions", "ranking"] })
            toast.success("Fase atualizada!")
        }
    })

    return (
        <div className="flex flex-col gap-8 mt-6">
            <Helmet title="Gestão de Sugestões" />

            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">

                    <div className="relative w-full lg:w-auto">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            {...register("search")}
                            placeholder="Buscar por título ou descrição..."
                            className="h-8 w-full lg:w-[320px] pl-9 text-xs"
                        />
                    </div>

                    <Select
                        value={category}
                        onValueChange={setCategory}
                    >
                        <SelectTrigger className="cursor-pointer h-8 min-w-[180px] w-auto bg-background border-muted-foreground/20 hover:border-primary/30 transition-all shadow-sm px-3">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                <SelectValue placeholder="Categoria" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="min-w-[220px]">
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value} className="cursor-pointer py-2">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                        <cat.icon className={cn("h-4 w-4", cat.color)} />
                                        <span className="text-sm font-medium">{cat.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
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

            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader2 className="animate-spin opacity-20 text-[#27187E]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {suggestions?.map((item) => (
                        <RoadmapCard
                            key={item.id}
                            item={item}
                            onStatusChange={(id, s) => changeStatus({ id, status: s })}
                            isUpdating={isPending}
                        />
                    ))}

                    {!isLoading && suggestions?.length === 0 && (
                        <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
                            <p className="text-slate-400 text-sm font-medium italic">Nenhuma sugestão encontrada.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}