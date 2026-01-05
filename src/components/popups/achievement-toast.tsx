"use client"

import { useEffect, useState, useCallback, useMemo, memo } from "react"
import { createPortal } from "react-dom"
import { X, Trophy, Star, Zap, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Popup } from "@/api/popups"

export type AchievementVariant = "bronze" | "silver" | "gold" | "platinum"

interface AchievementToastProps {
    popup: Popup
    onClose: (action: string) => void
    duration?: number
}

const CONFETTI_COLORS: Record<AchievementVariant, string[]> = {
    bronze: ["#D97706", "#F59E0B", "#FBBF24", "#FCD34D", "#FEF3C7"],
    silver: ["#64748B", "#94A3B8", "#CBD5E1", "#E2E8F0", "#F1F5F9"],
    gold: ["#EAB308", "#FACC15", "#FDE047", "#FEF08A", "#FEF9C3"],
    platinum: ["#06B6D4", "#22D3EE", "#67E8F9", "#A5F3FC", "#CFFAFE"],
}

const VARIANTS = {
    bronze: { label: "Bronze", bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/80 dark:to-orange-950/60", border: "border-amber-300/60 dark:border-amber-700/50", glow: "shadow-[0_0_30px_-8px_rgba(217,119,6,0.35)]", iconBg: "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600", iconRing: "ring-2 ring-amber-400/30", progressBar: "from-amber-400 to-orange-500", labelColor: "text-amber-700 dark:text-amber-400", shimmer: "from-amber-200/0 via-amber-200/50 to-amber-200/0", Icon: Star },
    silver: { label: "Prata", bg: "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/80 dark:to-gray-900/60", border: "border-slate-300/60 dark:border-slate-600/50", glow: "shadow-[0_0_30px_-8px_rgba(148,163,184,0.4)]", iconBg: "bg-gradient-to-br from-slate-400 via-gray-300 to-slate-500", iconRing: "ring-2 ring-slate-300/40", progressBar: "from-slate-400 to-gray-500", labelColor: "text-slate-600 dark:text-slate-400", shimmer: "from-slate-200/0 via-slate-200/50 to-slate-200/0", Icon: Zap },
    gold: { label: "Ouro", bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/80 dark:to-amber-950/60", border: "border-yellow-400/60 dark:border-yellow-600/50", glow: "shadow-[0_0_40px_-8px_rgba(234,179,8,0.45)]", iconBg: "bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500", iconRing: "ring-2 ring-yellow-400/40", progressBar: "from-yellow-400 to-amber-500", labelColor: "text-yellow-700 dark:text-yellow-400", shimmer: "from-yellow-200/0 via-yellow-200/60 to-yellow-200/0", Icon: Trophy },
    platinum: { label: "Platina", bg: "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/80 dark:to-sky-950/60", border: "border-cyan-400/60 dark:border-cyan-600/50", glow: "shadow-[0_0_50px_-8px_rgba(34,211,238,0.45)]", iconBg: "bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500", iconRing: "ring-2 ring-cyan-400/40", progressBar: "from-cyan-400 to-blue-500", labelColor: "text-cyan-700 dark:text-cyan-400", shimmer: "from-cyan-200/0 via-cyan-200/60 to-cyan-200/0", Icon: Crown },
}

const ConfettiPiece = memo(({ color, delay, left, rotation, scale }: any) => (
    <div
        className="absolute top-0 w-2 h-2 opacity-0 animate-[confetti_1.5s_ease-out_forwards]"
        style={{
            left: `${left}%`,
            backgroundColor: color,
            animationDelay: `${delay}ms`,
            transform: `rotate(${rotation}deg) scale(${scale})`,
            borderRadius: "2px",
        }}
    />
))
ConfettiPiece.displayName = "ConfettiPiece"

export function AchievementToast({
    popup,
    onClose,
    duration = 15000 // Máximo de 15 segundos conforme pedido
}: AchievementToastProps) {
    const [isVisible, setIsVisible] = useState(false)

    // Extração segura e memorizada da variante (Evita erro de 'undefined' no Icon)
    const variant = useMemo(() => {
        const raw = popup.internalName?.split("-")[1] as AchievementVariant
        return (raw && raw in VARIANTS) ? raw : "bronze"
    }, [popup.internalName])

    const style = VARIANTS[variant]
    const IconComponent = style.Icon

    // Memoriza as peças de confete para performance
    const confettiPieces = useMemo(() => {
        const colors = CONFETTI_COLORS[variant]
        return Array.from({ length: 35 }).map((_, i) => ({
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 400,
            left: Math.random() * 100,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 1,
        }))
    }, [variant])

    const handleDismiss = useCallback((action: string) => {
        setIsVisible(false)
        const timer = setTimeout(() => onClose(action), 500)
        return () => clearTimeout(timer)
    }, [onClose])

    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), 50)
        
        const autoCloseTimer = setTimeout(() => {
            handleDismiss("auto_closed")
        }, duration)

        return () => {
            clearTimeout(showTimer)
            clearTimeout(autoCloseTimer)
        }
    }, [duration, handleDismiss])

    if (typeof document === "undefined") return null

    return createPortal(
        <div
            role="alert"
            aria-live="assertive"
            className="fixed top-6 right-6 z-[9999] w-full max-w-[340px] pointer-events-none flex justify-end"
        >
            <div
                className={cn(
                    "pointer-events-auto relative overflow-hidden w-full rounded-2xl border backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    style.bg, style.border, style.glow,
                    isVisible ? "translate-x-0 opacity-100 scale-100 shadow-2xl" : "translate-x-12 opacity-0 scale-95",
                )}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {isVisible && confettiPieces.map((p) => (
                        <ConfettiPiece key={p.id} {...p} />
                    ))}
                </div>

                <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", style.shimmer, "animate-[shimmer_2s_infinite]")} />

                <div className="relative p-4">
                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg",
                            style.iconBg, style.iconRing
                        )}>
                            <IconComponent className="h-6 w-6 text-white drop-shadow-md" />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0 gap-1">
                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/5 dark:bg-white/10 w-fit",
                                style.labelColor
                            )}>
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                {style.label}
                            </span>
                            <h3 className="font-bold text-sm text-foreground leading-tight">{popup.title}</h3>
                            <div
                                className="text-xs text-muted-foreground leading-relaxed line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: popup.body || "" }}
                            />
                        </div>

                        <button
                            onClick={() => handleDismiss("manual_closed")}
                            className="shrink-0 p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-black/5 transition-all cursor-pointer group"
                            aria-label="Fechar"
                        >
                            <X className="h-4 w-4 transition-transform group-hover:scale-110" />
                        </button>
                    </div>
                </div>

                <div className="h-1 bg-black/5 dark:bg-white/5">
                    <div
                        className={cn("h-full bg-gradient-to-r origin-left animate-[shrink_linear_forwards]", style.progressBar)}
                        style={{ animationDuration: `${duration}ms` }}
                    />
                </div>
            </div>
        </div>,
        document.body
    )
}