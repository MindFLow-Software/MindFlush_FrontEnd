"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle2, Filter, QrCode, Search, UserRoundPlus, Users, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { RegisterPatients } from "../register-patients/register-patients"
import { usePatientFilters } from "@/hooks/use-patient-filters"

interface PatientsTableFiltersProps {
  onPatientRegistered?: () => void
}

export function PatientsTableFilters({ onPatientRegistered }: PatientsTableFiltersProps) {
  const { filters, setFilters, clearFilters } = usePatientFilters()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const isFirstRender = useRef(true)

  const { register, watch, setValue } = useForm({
    values: {
      filter: filters.filter,
    },
  })

  const watchedFilter = watch("filter")

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (watchedFilter === filters.filter) {
      return
    }

    const timeout = setTimeout(() => {
      setFilters({ filter: watchedFilter })
    }, 400)

    return () => clearTimeout(timeout)
  }, [watchedFilter, filters.filter, setFilters])

  function handleClearFilters() {
    clearFilters()
    setValue("filter", "")
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">

        <div className="relative w-full lg:w-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            {...register("filter")}
            placeholder="Buscar por CPF, Nome e Email"
            className="h-8 w-full lg:w-[320px] pl-9"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ status: value })}
        >
          <SelectTrigger
            className="cursor-pointer h-9 min-w-[180px] w-auto bg-background
            border-muted-foreground/20 hover:border-primary/30 transition-all
            shadow-sm px-3"
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>

          <SelectContent className="min-w-[220px]">
            <SelectItem value="all" className="cursor-pointer py-2.5">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">
                  Todos os Pacientes
                </span>
              </div>
            </SelectItem>

            <SelectItem value="active" className="cursor-pointer py-2.5">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">
                  Pacientes Ativos
                </span>
              </div>
            </SelectItem>

            <SelectItem value="inactive" className="cursor-pointer py-2.5">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <XCircle className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium">
                  Pacientes Inativos
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {(filters.filter || filters.status !== "all") && (
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

      <div className="flex items-center">
        <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
          <Button
            size="sm"
            className="cursor-pointer gap-2 w-full lg:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            onClick={() => setIsRegisterOpen(true)}
          >
            <UserRoundPlus className="h-4 w-4" />
            Cadastrar paciente
          </Button>

          <Button
            size="sm"
            className="cursor-pointer gap-2 w-full lg:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            <QrCode className="h-4 w-4" />
            QrCode de Cadastro
          </Button>
        </div>

        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          {isRegisterOpen && (
            <RegisterPatients onSuccess={() => {
              setIsRegisterOpen(false)
              onPatientRegistered?.()
            }} />
          )}
        </Dialog>
      </div>
    </div>
  )
}