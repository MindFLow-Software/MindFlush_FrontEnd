"use client"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CloudDownload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { format } from "date-fns"
import z from "zod"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

export const registerPatientForm = z.object({
  firstName: z.string().min(1, "Primeiro nome é obrigatório"),
  lastName: z.string().min(1, "Último nome é obrigatório"),
  phoneNumber: z.string().min(1, "Telefone é obrigatório").max(15),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").optional(),
  dateOfBirth: z.date(),
  cpf: z.string().min(11, "CPF inválido").max(14),
  role: z.enum(["PATIENT"]),
  gender: z.enum(["MASCULINE", "FEMININE", "OTHER"]),
  isActive: z.boolean().optional(),
  profileImageUrl: z.string().url().optional(),
})

export function RegisterPatients() {
  const [date, setDate] = useState<Date | undefined>()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [cpf, setCpf] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState<string | undefined>()
  const [role, setRole] = useState("PATIENT")
  const [isActive, setIsActive] = useState("true")
  const [profileImageUrl, setProfileImageUrl] = useState("")

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-lg sm:text-xl">Novo Paciente</DialogTitle>
        <DialogDescription className="text-sm">Preencha os dados para cadastrar um novo paciente</DialogDescription>
      </DialogHeader>

      <form className="space-y-3 sm:space-y-4 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm">
              Primeiro Nome
            </Label>
            <Input
              id="firstName"
              className="w-full"
              placeholder="Ex: Mariana"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm">
              Último Nome
            </Label>
            <Input
              id="lastName"
              className="w-full"
              placeholder="Ex: Silva"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpf" className="text-sm">
              CPF
            </Label>
            <Input
              id="cpf"
              className="w-full"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              maxLength={14}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="birthDate" className="text-sm">
              Data de Nascimento
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left text-sm bg-transparent">
                  {date ? format(date, "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border shadow-sm"
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" className="text-sm">
              Telefone
            </Label>
            <Input
              id="phoneNumber"
              className="w-full"
              placeholder="(11) 99999-9999"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
              maxLength={15}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="w-full"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="password" className="text-sm">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              className="w-full"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="gender" className="text-sm">
              Gênero
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEMININE">Feminino</SelectItem>
                <SelectItem value="MASCULINE">Masculino</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-sm">
              Perfil
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PATIENT">Paciente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="isActive" className="text-sm">
              Ativo?
            </Label>
            <Select value={isActive} onValueChange={setIsActive}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profileImageUrl" className="text-sm">
            URL da Foto
          </Label>
          <Input
            id="profileImageUrl"
            type="url"
            className="w-full"
            placeholder="https://exemplo.com/foto.jpg"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Empty className="border border-accent-foreground">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CloudDownload className="w-8 h-8 sm:w-10 sm:h-10" />
              </EmptyMedia>
              <EmptyTitle className="text-sm sm:text-base">Sem Documentos</EmptyTitle>
              <EmptyDescription className="text-xs sm:text-sm px-2">
                Faça o upload dos documentos do paciente para acessá-los facilmente.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" className="cursor-pointer text-sm bg-transparent" size="sm">
                Upload de Documentos
              </Button>
            </EmptyContent>
          </Empty>
        </div>

        <div className="pt-3 sm:pt-4">
          <Button type="submit" className="w-full cursor-pointer text-sm sm:text-base h-10 sm:h-11">
            Cadastrar paciente
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
