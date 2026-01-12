"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Send, Loader2, AlertCircle, Lightbulb, FileText, Paperclip } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import { createSuggestion } from "@/api/create-suggestion"
import { SuggestionAttachments } from "./suggestion-attachments"
import { cn } from "@/lib/utils"

const suggestionSchema = z.object({
    title: z.string()
        .min(10, "O título deve ser descritivo (mín. 10 caracteres)")
        .max(80, "Título muito longo"),
    description: z.string()
        .min(100, "Por favor, detalhe sua sugestão com pelo menos 100 caracteres"),
    category: z.enum(["UI_UX", "SCHEDULING", "REPORTS", "PRIVACY_LGPD", "INTEGRATIONS", "OTHERS"], {
        message: "Selecione a categoria da sua sugestão",
    }),
})

type SuggestionSchema = z.infer<typeof suggestionSchema>

interface CreateSuggestionProps {
    onSuccess: () => void
}

export function CreateSuggestion({ onSuccess }: CreateSuggestionProps) {
    const [files, setFiles] = useState<File[]>([])
    const [formKey, setFormKey] = useState(0)
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { isSubmitting, errors },
    } = useForm<SuggestionSchema>({
        resolver: zodResolver(suggestionSchema),
        defaultValues: {
            description: ""
        }
    })

    const descriptionValue = watch("description") || ""

    async function onSubmit(data: SuggestionSchema) {
        try {
            await createSuggestion({ ...data, files })
            await queryClient.invalidateQueries({ queryKey: ["suggestions"] })
            toast.success("Sugestão enviada com sucesso!")
            reset()
            setFiles([])
            setFormKey(prev => prev + 1)
            onSuccess()
        } catch (error) {
            toast.error("Erro ao enviar sugestão. Tente novamente.")
        }
    }

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl p-0 gap-0">
            <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-bold">Nova Sugestão</DialogTitle>
                <DialogDescription>
                    Explique detalhadamente sua ideia. Sugestões bem descritas são analisadas mais rápido.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 p-6 pt-2 w-full">
                {/* Banner */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3 items-start w-full">
                    <AlertCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-900">Antes de enviar sua ideia...</p>
                        <div className="text-xs text-blue-800 leading-relaxed space-y-2">
                            <p className="break-words">
                                Pesquise no board se sua sugestão já foi enviada por outra pessoa. Se encontrar algo parecido,
                                prefira dar um <strong>like</strong> na sugestão existente para fortalecer o pedido.
                            </p>
                            <p className="break-words font-medium border-t border-blue-200/50 pt-2">
                                Requisito: Mínimo de 100 caracteres para uma descrição detalhada.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Classificação */}
                <div className="space-y-4 w-full">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 px-1">
                        <Lightbulb className="size-4 text-[#27187E]" />
                        Classificação
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 min-w-0">
                            <Label htmlFor="title" className={cn(errors.title && "text-red-500")}>Título *</Label>
                            <Input
                                id="title"
                                {...register("title")}
                                placeholder="Resuma sua ideia"
                                className={cn("w-full", errors.title && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.title && <p className="text-[10px] text-red-500 font-medium px-1">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2 min-w-0">
                            <Label className={cn(errors.category && "text-red-500")}>Categoria *</Label>
                            <Select key={formKey} onValueChange={(v) => setValue("category", v as any)}>
                                <SelectTrigger className={cn("w-full cursor-pointer", errors.category && "border-red-500")}>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UI_UX">Interface e Visual (UI/UX)</SelectItem>
                                    <SelectItem value="SCHEDULING">Agenda e Consultas</SelectItem>
                                    <SelectItem value="REPORTS">Relatórios e Financeiro</SelectItem>
                                    <SelectItem value="PRIVACY_LGPD">Segurança e LGPD</SelectItem>
                                    <SelectItem value="INTEGRATIONS">Integrações Externas</SelectItem>
                                    <SelectItem value="OTHERS">Outros Assuntos</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-[10px] text-red-500 font-medium px-1">{errors.category.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Descrição */}
                <div className="space-y-4 pt-2 border-t w-full">
                    <div className="flex items-center justify-between px-1 gap-2">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FileText className="size-4 text-[#27187E]" />
                            Detalhamento
                        </h3>
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
                            descriptionValue.length < 100 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                            {descriptionValue.length} / 100
                        </span>
                    </div>

                    <div className="space-y-2 w-full">
                        <Textarea
                            id="description"
                            {...register("description")}
                            className={cn(
                                "w-full min-h-[140px] max-h-[240px] resize-none break-words",
                                errors.description && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder="Descreva detalhadamente o que você imaginou..."
                        />
                        {errors.description && <p className="text-[10px] text-red-500 font-medium px-1">{errors.description.message}</p>}
                    </div>
                </div>

                {/* Anexos */}
                <div className="space-y-4 pt-2 border-t w-full min-w-0">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 px-1">
                        <Paperclip className="size-4 text-[#27187E]" />
                        Anexos
                    </h3>
                    <SuggestionAttachments files={files} onFileChange={setFiles} />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t w-full">
                    <Button type="button" variant="ghost" onClick={onSuccess} className="cursor-pointer">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer gap-2 bg-[#27187E] hover:bg-[#27187E]/90 min-w-[180px]"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Publicar Sugestão <Send className="h-4 w-4" /></>}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}