"use client"

import { FileText, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AttachmentsTableFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    onClearFilters: () => void
}

export function AttachmentsTableFilters({
    search,
    onSearchChange,
    onClearFilters
}: AttachmentsTableFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary/70" /> Documentos de pacientes
            </h3>

            <div className="flex items-center gap-2 w-full md:max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Filtrar por nome do arquivo ou paciente..."
                        className="h-9 pl-9 rounded-xl bg-card border-border text-xs focus-visible:ring-primary"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {search && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-xl text-xs gap-2 border-dashed"
                        onClick={onClearFilters}
                    >
                        <X className="size-3" />
                        Limpar
                    </Button>
                )}
            </div>
        </div>
    )
}