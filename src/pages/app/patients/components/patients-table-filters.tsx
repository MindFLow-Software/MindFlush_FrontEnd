"use client"

import { useState, useEffect } from "react"
import { UserRoundPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { RegisterPatients } from "./register-patients"

const patientsFilterSchema = z.object({
  name: z.string().optional(),
  cpf: z.string().optional(),
  status: z.string().optional(),
})

type PatientsFilterSchema = z.infer<typeof patientsFilterSchema>

interface PatientsTableFiltersProps {
  onPatientRegistered?: () => void
}

export function PatientsTableFilters({ onPatientRegistered }: PatientsTableFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const name = searchParams.get("name")
  const cpf = searchParams.get("cpf")
  const status = searchParams.get("status")

  const { register, watch } = useForm<PatientsFilterSchema>({
    resolver: zodResolver(patientsFilterSchema),
    defaultValues: {
      name: name ?? "",
      cpf: cpf ?? "",
      status: status ?? "all",
    },
  })

  const watchedName = watch("name")
  const watchedCpf = watch("cpf")

  function applyFilters({ name, cpf, status }: PatientsFilterSchema) {
    setSearchParams((state) => {
      if (name) state.set("name", name)
      else state.delete("name")

      if (cpf) state.set("cpf", cpf)
      else state.delete("cpf")

      if (status && status !== "all") state.set("status", status)
      else state.delete("status")

      // 🔴 ANTES (ERRADO):
      // state.set("pageIndex", "0")

      // 🟢 DEPOIS (CORRETO):
      // Removemos o parâmetro técnico e setamos a página humana para 1
      state.delete("pageIndex")
      state.set("page", "1")

      return state
    })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      applyFilters({
        name: watchedName,
        cpf: watchedCpf,
        status: status ?? "all",
      })
    }, 400)

    return () => clearTimeout(timeout)
  }, [watchedName, watchedCpf])

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">

      <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
        <Input
          placeholder="Buscar por CPF"
          className="h-8 w-full lg:w-auto"
          {...register("cpf")}
        />

        <Input
          placeholder="Buscar por Nome"
          className="h-8 w-full lg:w-[320px]"
          {...register("name")}
        />
      </div>

      <div className="flex items-center">
        <Button
          size="sm"
          className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer"
          onClick={() => setIsRegisterOpen(true)}
        >
          <UserRoundPlus className="h-4 w-4" />
          Cadastrar paciente
        </Button>

        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          {isRegisterOpen && (
            <RegisterPatients
              onSuccess={() => {
                setIsRegisterOpen(false)
                if (onPatientRegistered) onPatientRegistered()
              }}
            />
          )}
        </Dialog>
      </div>
    </div>
  )
}