"use client"

import { useState, useEffect, useRef } from "react"
import { Search, UserRoundPlus, XCircle } from "lucide-react"
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

import { RegisterPatients } from "./register-patients"
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
          <SelectTrigger className="h-8 w-full lg:w-[180px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pacientes</SelectItem>
            <SelectItem value="active">Apenas Ativos</SelectItem>
            <SelectItem value="inactive">Apenas Inativos</SelectItem>
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
        <Button
          size="sm"
          className="cursor-pointer gap-2 w-full lg:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          onClick={() => setIsRegisterOpen(true)}
        >
          <UserRoundPlus className="h-4 w-4" />
          Cadastrar paciente
        </Button>

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