"use client"

import { ThumbsUp, Calendar, } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Suggestion } from "@/api/get-suggestions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const CATEGORY_LABELS: Record<string, string> = {
    UI_UX: "Interface / UX",
    SCHEDULING: "Agendamentos",
    REPORTS: "Relatórios",
    PRIVACY_LGPD: "Privacidade",
    INTEGRATIONS: "Integrações",
    OTHERS: "Outros",
}

interface SuggestionCardProps {
    item: Suggestion
    userId?: string
    onLike: (id: string) => void
}

export function SuggestionCard({ item, userId, onLike }: SuggestionCardProps) {
    const isLiked = userId ? item.likes?.includes(userId) : false

    return (
        <Dialog>
            <DialogTrigger asChild>
                <article
                    className={cn(
                        "border rounded-xl p-4 cursor-pointer transition-all duration-300 group relative overflow-hidden min-w-0 w-full",
                        isLiked
                            ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 shadow-sm shadow-emerald-200/50"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm",
                    )}
                >
                    <div className="relative space-y-3 min-w-0">
                        <div className="space-y-2 pr-2 min-w-0">
                            <h3 className={cn(
                                "font-semibold leading-snug line-clamp-2 text-sm transition-colors break-words",
                                isLiked ? "text-emerald-900" : "text-slate-800 group-hover:text-[#27187E]",
                            )}>
                                {item.title}
                            </h3>
                            <p className={cn(
                                "line-clamp-2 leading-relaxed text-xs break-words",
                                isLiked ? "text-emerald-700/90" : "text-slate-600",
                            )}>
                                {item.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200/60">
                            <button
                                className={cn(
                                    "cursor-pointer flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 text-xs font-semibold shrink-0",
                                    "active:scale-95 hover:scale-105 relative z-10 tabular-nums",
                                    isLiked
                                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200/60 hover:bg-emerald-600"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200",
                                )}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onLike(item.id)
                                }}
                                type="button"
                            >
                                <ThumbsUp className="size-3.5" />
                                <span>{item.likesCount}</span>
                            </button>

                            <span className="text-[10px] text-slate-400 font-medium italic truncate ml-2">
                                {CATEGORY_LABELS[item.category] || "Geral"}
                            </span>
                        </div>
                    </div>
                </article>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] border-[#27187E]/10 gap-6 rounded-2xl overflow-hidden">
                <DialogHeader className="min-w-0">
                    <div className="mb-2">
                        <span className="text-[10px] bg-[#27187E]/10 text-[#27187E] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                            {CATEGORY_LABELS[item.category] || "Geral"}
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900 leading-tight break-words">
                        {item.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 min-w-0">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed break-words">
                            {item.description}
                        </p>
                    </div>

                    <footer className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-dashed">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                <Calendar className="size-4 text-slate-500" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-slate-400 text-[10px] uppercase">Postado em</span>
                                <span className="font-medium text-slate-700 text-xs truncate">
                                    {format(new Date(item.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                                </span>
                            </div>
                        </div>
                    </footer>
                </div>
            </DialogContent>
        </Dialog>
    )
}