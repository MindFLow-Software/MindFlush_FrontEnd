"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface PatientDetailsHeaderProps {
    patient: {
        id: string
        firstName: string
        lastName: string
        status: "active" | "inactive"
        profileImageUrl?: string | null
    }
}

function getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

function StatusDot({ status }: { status: "active" | "inactive" }) {
    return (
        <span
            className={cn(
                "relative flex h-2 w-2",
                status === "active" && "animate-pulse"
            )}
            aria-hidden="true"
        >
            {status === "active" && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
                className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40"
                )}
            />
        </span>
    )
}

export function PatientDetailsHeader({ patient }: PatientDetailsHeaderProps) {
    const shortId = useMemo(
        () => patient.id.substring(0, 8).toUpperCase(),
        [patient.id]
    )
    const fullName = `${patient.firstName} ${patient.lastName}`
    const initials = getInitials(patient.firstName, patient.lastName)

    const handleCopyId = () => {
        navigator.clipboard.writeText(patient.id)
    }

    return (
        <TooltipProvider delayDuration={200}>
            <header className="flex flex-col gap-5 pb-6">
                <div className="flex items-start gap-4 sm:items-center">
                    {/* Avatar with status indicator */}
                    <div className="relative shrink-0">
                        <Avatar className="h-14 w-14 border-2 border-background shadow-sm ring-1 ring-border">
                            {patient.profileImageUrl && (
                                <AvatarImage
                                    src={patient.profileImageUrl || "/placeholder.svg"}
                                    alt={`Foto de ${fullName}`}
                                />
                            )}
                            <AvatarFallback className="bg-muted text-base font-semibold text-muted-foreground">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span
                            className={cn(
                                "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background",
                                patient.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40"
                            )}
                            aria-label={patient.status === "active" ? "Paciente ativo" : "Paciente inativo"}
                        >
                            {patient.status === "active" && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-200" />
                            )}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                {fullName}
                            </h1>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "shrink-0 gap-1.5 text-[11px] font-medium",
                                    patient.status === "active"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                                        : "border-border bg-muted text-muted-foreground"
                                )}
                            >
                                <StatusDot status={patient.status} />
                                {patient.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={handleCopyId}
                                        className="inline-flex items-center gap-1.5 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-50"
                                            aria-hidden="true"
                                        >
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                        <span className="font-mono text-[11px] tracking-wide">
                                            {shortId}
                                        </span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">
                                    Clique para copiar o ID completo
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-border" role="separator" />
            </header>
        </TooltipProvider>
    )
}
