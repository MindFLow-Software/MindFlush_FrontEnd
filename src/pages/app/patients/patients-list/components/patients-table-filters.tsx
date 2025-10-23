"use client"

import type React from "react"

import { useState } from "react"
import { Search, UserRoundPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { RegisterPatients } from "./register-patients"

export function PatientsTableFilters() {
    const [cpf, setCpf] = useState("")
    const [name, setName] = useState("")
    const [status, setStatus] = useState("all")

    const hasActiveFilters = cpf || name || status !== "all"

    const handleClearFilters = () => {
        setCpf("")
        setName("")
        setStatus("all")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({ cpf, name, status })
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
                    <Input placeholder="CPF do paciente" value={cpf} onChange={(e) => setCpf(e.target.value)} className="h-9" />

                    <Input
                        placeholder="Nome do paciente"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-9"
                    />

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os status</SelectItem>
                            <SelectItem value="active">Em acompanhamento</SelectItem>
                            <SelectItem value="scheduled">Sessão agendada</SelectItem>
                            <SelectItem value="completed">Sessão concluída</SelectItem>
                            <SelectItem value="paused">Em pausa</SelectItem>
                            <SelectItem value="discharged">Alta terapêutica</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 w-full lg:w-auto shrink-0">
                            <UserRoundPlus className="h-4 w-4" />
                            Cadastrar paciente
                        </Button>
                    </DialogTrigger>
                    <RegisterPatients />
                </Dialog>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" size="sm" variant="secondary" onClick={handleSubmit} className="gap-2 w-full sm:w-auto">
                    <Search className="h-4 w-4" />
                    Aplicar filtros
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                    className="gap-2 w-full sm:w-auto bg-transparent"
                >
                    <X className="h-4 w-4" />
                    Limpar filtros
                </Button>
            </div>
        </div>
    )
}
