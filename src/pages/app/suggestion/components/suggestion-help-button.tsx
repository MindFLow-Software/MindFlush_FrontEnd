"use client"

import { HelpCircle, Search, FileText, ThumbsUp, Rocket, Lightbulb } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const STEPS = [
    {
        title: "Pesquise antes",
        description: "Use a busca para ver se sua ideia já existe e evitar sugestões duplicadas.",
        icon: Search,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "Capriche no detalhe",
        description: "Explique o porquê e como sua ideia ajudaria no dia a dia clínico.",
        icon: FileText,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        title: "Vote em outras",
        description: "Curtiu uma sugestão? Vote! As mais apoiadas ganham prioridade.",
        icon: ThumbsUp,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        title: "Acompanhe o status",
        description: "Veja sua ideia evoluir de sugestão até funcionalidade entregue.",
        icon: Rocket,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    }
]

export function SuggestionHelpButton() {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Dialog>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <DialogTrigger asChild>
                            <TooltipTrigger asChild>
                                <button className="
                                    relative flex items-center justify-center size-12
                                    rounded-full text-white
                                    bg-gradient-to-br from-blue-600 to-indigo-600
                                    shadow-xl hover:shadow-2xl
                                    hover:scale-110 transition-all
                                    active:scale-95
                                    border-2 border-white
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                ">
                                    <HelpCircle className="size-6" />
                                </button>
                            </TooltipTrigger>
                        </DialogTrigger>
                        <TooltipContent side="left" className="bg-slate-900 text-white border-none text-xs font-semibold px-3 py-2 mb-2">
                            Comunidade MindFlow
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none sm:rounded-2xl">
                    <DialogHeader className="p-6 pb-4 bg-slate-50/70 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white shadow-sm">
                                <Lightbulb className="size-5 text-indigo-600" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-lg font-extrabold text-slate-900">
                                    Comunidade MindFlow
                                </DialogTitle>
                                <DialogDescription className="text-sm text-slate-500">
                                    Suas ideias ajudam a definir os próximos passos do sistema.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="cursor-pointer grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        {STEPS.map((step, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "p-6 flex gap-4 transition-all duration-300",
                                    "hover:bg-slate-50/60 hover:shadow-sm group",
                                    index < 2 && "md:border-b border-slate-100"
                                )}
                            >
                                <div className={cn(
                                    "size-11 rounded-xl flex items-center justify-center shrink-0",
                                    "transition-transform group-hover:-translate-y-0.5",
                                    step.bg
                                )}>
                                    <step.icon className={cn("size-5", step.color)} />
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 tracking-widest">
                                        PASSO {index + 1}
                                    </span>
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-50 text-center">
                        <p className="text-[13px] text-slate-600 font-medium">
                            ❤️ As sugestões são avaliadas semanalmente com base no número de votos. ❤️
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
