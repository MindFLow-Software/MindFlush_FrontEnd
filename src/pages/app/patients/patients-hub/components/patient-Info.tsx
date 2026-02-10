"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface PatientInfoProps {
    patient: {
        id: string
        firstName: string
        lastName: string
        cpf: string
        email: string
        phoneNumber: string
        status: 'active' | 'inactive'
        dateOfBirth?: string | Date | null
        gender?: string | null
    }
}

const formatCPF = (value: string | null | undefined) => {
    if (!value) return "—"
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
}

const formatPhoneNumber = (value: string | null | undefined) => {
    if (!value) return "—"
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
}

const calculateAge = (dob: string | Date | null | undefined) => {
    if (!dob) return "—"
    const birthDate = new Date(dob)
    if (isNaN(birthDate.getTime())) return "—"

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return `${age} anos`
}

interface InfoFieldProps {
    label: string
    value: string | number
    isMono?: boolean
    statusVariant?: boolean
}

function InfoField({ label, value, isMono, statusVariant }: InfoFieldProps) {
    return (
        <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {label}
            </span>
            <p className={cn(
                "text-sm font-medium",
                isMono && "font-mono tabular-nums",
                statusVariant && (value === 'Ativo' ? "text-emerald-600" : "text-amber-600")
            )}>
                {value}
            </p>
        </div>
    )
}

export function PatientInfo({ patient }: PatientInfoProps) {
    const age = calculateAge(patient.dateOfBirth)

    const dobFormatted = patient.dateOfBirth
        ? format(new Date(patient.dateOfBirth), "dd/MM/yyyy", { locale: ptBR })
        : "—"

    return (
        <div className="border rounded-xl px-4 bg-card shadow-sm">
            <div className="text-sm font-bold py-4 border-b mb-2 flex justify-between items-center">
                <span>Informações de Cadastro</span>
                <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter",
                    patient.status === 'active' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                )}>
                    {patient.status === 'active' ? "Paciente Ativo" : "Paciente Inativo"}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8 py-4">
                <InfoField
                    label="Idade"
                    value={age}
                />
                <InfoField
                    label="Nascimento"
                    value={dobFormatted}
                    isMono
                />
                <InfoField
                    label="CPF"
                    value={formatCPF(patient.cpf)}
                    isMono
                />
                <InfoField
                    label="Telefone / WhatsApp"
                    value={formatPhoneNumber(patient.phoneNumber)}
                    isMono
                />
                <InfoField
                    label="E-mail de Contato"
                    value={patient.email || "—"}
                />
                <InfoField
                    label="Status do Prontuário"
                    value={patient.status === 'active' ? 'Ativo' : 'Inativo'}
                    statusVariant
                />
            </div>
        </div>
    )
}