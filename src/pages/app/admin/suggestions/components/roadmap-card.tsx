"use client"

import { ThumbsUp, Calendar, Clock, Search, Rocket, ChevronRight, XCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Suggestion } from "@/api/get-suggestions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface RoadmapCardProps {
    item: Suggestion
    onStatusChange: (id: string, status: string) => void
    isUpdating: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
    UI_UX: "Interface / UX",
    SCHEDULING: "Agendamentos",
    REPORTS: "Relatórios",
    PRIVACY_LGPD: "Privacidade",
    INTEGRATIONS: "Integrações",
    OTHERS: "Outros",
}

const STEPS = [
    { id: "OPEN", label: "Votação", icon: Search, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "UNDER_REVIEW", label: "Em Estudo", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { id: "PLANNED", label: "Planejado", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
    { id: "IMPLEMENTED", label: "Concluído", icon: Rocket, color: "text-emerald-600", bg: "bg-emerald-50" },
]

export function RoadmapCard({ item, onStatusChange, isUpdating }: RoadmapCardProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <article className="bg-white border border-slate-200 rounded-[24px] p-5 cursor-pointer transition-all hover:shadow-md group min-w-0 w-full">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 min-w-0">

                        <div className="space-y-3 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-[#27187E]/10 text-[#27187E] px-2 py-0.5 rounded-md font-black uppercase tracking-wider shrink-0">
                                    {CATEGORY_LABELS[item.category] || item.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full shrink-0 border border-amber-100">
                                    <ThumbsUp className="size-3.5 fill-amber-500/20" />
                                    <span className="text-[10px] font-black">{item.likesCount || 0}</span>
                                </div>
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#27187E] transition-colors truncate break-words">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-1 break-words italic">
                                    "{item.description}"
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-dashed border-slate-100">
                                <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 font-bold text-[8px] shrink-0">
                                    {item.psychologistName.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">
                                    {item.psychologistName} • {format(new Date(item.createdAt), "dd/MM/yyyy")}
                                </span>
                            </div>
                        </div>

                        {/* Stepper de Status */}
                        <div
                            className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl shrink-0 self-end xl:self-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {STEPS.map((step, index) => {
                                const isCurrent = item.status === step.id
                                return (
                                    <div key={step.id} className="flex items-center">
                                        <button
                                            disabled={isUpdating}
                                            onClick={() => onStatusChange(item.id, step.id)}
                                            className={cn(
                                                "cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                                                isCurrent
                                                    ? `${step.bg} ${step.color} shadow-sm border border-slate-200/50`
                                                    : "text-slate-400 hover:bg-slate-200/50"
                                            )}
                                        >
                                            <step.icon className="size-3" />
                                            <span className={cn(!isCurrent && "hidden xl:inline")}>{step.label}</span>
                                        </button>
                                        {index < STEPS.length - 1 && <ChevronRight className="size-3 text-slate-300 mx-0.5" />}
                                    </div>
                                )
                            })}

                            <div className="ml-1 pl-1 border-l border-slate-200">
                                <button
                                    onClick={() => onStatusChange(item.id, "REJECTED")}
                                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <XCircle className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] border-[#27187E]/10 gap-6 rounded-3xl overflow-hidden">
                <DialogHeader>
                    <div className="mb-2">
                        <span className="text-[10px] bg-[#27187E]/10 text-[#27187E] px-2 py-0.5 rounded-full font-black uppercase">
                            {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900 leading-tight break-words">
                        {item.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 max-h-[350px] overflow-y-auto">
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed break-words">
                            {item.description}
                        </p>
                    </div>

                    <footer className="flex items-center justify-between pt-4 border-t border-dashed border-slate-200">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 font-bold text-xs shrink-0">
                                {item.psychologistName?.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Sugestão enviada por</span>
                                <span className="text-xs font-bold text-slate-700 truncate">{item.psychologistName}</span>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase block">Data do Registro</span>
                            <span className="text-xs font-medium text-slate-600">
                                {format(new Date(item.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                            </span>
                        </div>
                    </footer>
                </div>
            </DialogContent>
        </Dialog>
    )
}