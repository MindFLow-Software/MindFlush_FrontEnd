"use client"

import { useEffect } from "react"
import { UserRoundPlus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { RegisterPatients } from "./register-patients"

const patientsFilterSchema = z.object({
  name: z.string().optional(),
  cpf: z.string().optional(),
  status: z.string().optional(),
})

type PatientsFilterSchema = z.infer<typeof patientsFilterSchema>

export function PatientsTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get("name")
  const cpf = searchParams.get("cpf")
  const status = searchParams.get("status")

  const { register, control, watch } = useForm<PatientsFilterSchema>({
    resolver: zodResolver(patientsFilterSchema),
    defaultValues: {
      name: name ?? "",
      cpf: cpf ?? "",
      status: status ?? "all",
    },
  })

  // Observa as mudanças no formulário
  const filters = watch()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchParams((state) => {
        // Valores atuais na URL
        const currentName = state.get("name") ?? ""
        const currentCpf = state.get("cpf") ?? ""
        const currentStatus = state.get("status") ?? "all"

        // Novos valores do formulário
        const newName = filters.name ?? ""
        const newCpf = filters.cpf ?? ""
        const newStatus = filters.status ?? "all"

        // Verificamos se ALGUM filtro mudou de verdade
        const hasChanged =
          currentName !== newName ||
          currentCpf !== newCpf ||
          currentStatus !== newStatus

        if (filters.name) {
          state.set("name", filters.name)
        } else {
          state.delete("name")
        }

        if (filters.cpf) {
          state.set("cpf", filters.cpf)
        } else {
          state.delete("cpf")
        }

        if (filters.status && filters.status !== "all") {
          state.set("status", filters.status)
        } else {
          state.delete("status")
        }

        // O PULO DO GATO: Só reseta a página se os filtros mudaram
        if (hasChanged) {
          state.set("pageIndex", "0")
        }

        return state
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [filters, setSearchParams]) // O array de dependências garante que o effect rode

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <form className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
        <Input
          placeholder="Buscar por CPF..."
          className="h-8 w-full lg:w-auto"
          {...register("cpf")}
        />

        <Input
          placeholder="Buscar por Nome..."
          className="h-8 w-full lg:w-[320px]"
          {...register("name")}
        />

        <Controller
          name="status"
          control={control}
          render={({ field: { name, onChange, value, disabled } }) => {
            return (
              <Select
                defaultValue="all"
                name={name}
                onValueChange={onChange}
                value={value}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full lg:w-[180px]">
                  <SelectValue placeholder="Status" />
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
            )
          }}
        />
      </form>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer">
            <UserRoundPlus className="h-4 w-4" />
            Cadastrar paciente
          </Button>
        </DialogTrigger>
        <RegisterPatients />
      </Dialog>
    </div>
  )
}