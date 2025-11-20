"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDownIcon, CloudDownload } from "lucide-react"
import { toast } from "sonner"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import {
    Field,
    FieldGroup,
    FieldSet,
    FieldLabel,
    FieldLegend,
    FieldDescription,
    FieldSeparator,
} from "@/components/ui/field"

import { formatCEP } from "@/utils/formatCEP"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { updatePatient, type UpdatePatientData } from "@/api/upadate-patient"
import type { Gender } from "@/types/enum-gender"

interface EditPatientProps {
    patient: UpdatePatientData
    onClose?: () => void
}

export function EditPatient({ patient, onClose }: EditPatientProps) {
    const queryClient = useQueryClient()

    const [date, setDate] = useState<Date | undefined>(
        patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined
    )
    const [cpf, setCpf] = useState(patient.cpf ?? "")
    const [phone, setPhone] = useState(patient.phoneNumber ?? "")
    const [cep, setCep] = useState("") // Nota: O CEP não veio no objeto patient original, mantive vazio como no original
    const [gender, setGender] = useState<Gender | "">(patient.gender ?? "")

    const { mutateAsync: updatePatientFn, isPending } = useMutation({
        mutationFn: updatePatient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
            toast.success("Paciente atualizado com sucesso!")
            onClose?.()
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Erro ao atualizar paciente")
        },
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const form = e.currentTarget
        const formData = new FormData(form)

        const data: UpdatePatientData = {
            id: patient.id,
            firstName: (formData.get("firstName") as string) || undefined,
            lastName: (formData.get("lastName") as string) || undefined,
            email: (formData.get("email") as string) || undefined,
            password: (formData.get("password") as string) || undefined,
            phoneNumber: phone || undefined,
            dateOfBirth: date,
            cpf: cpf || undefined,
            gender: gender || undefined,
            profileImageUrl: (formData.get("profileImageUrl") as string) || undefined,
        }

        await updatePatientFn(data)
    }

    return (
        <div className="overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Editar Paciente</DialogTitle>
                <DialogDescription>
                    Atualize as informações do paciente abaixo
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <FieldGroup className="mt-4">
                    
                    {/* Dados Pessoais */}
                    <FieldSet>
                        <FieldGroup>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="firstName">Primeiro Nome</FieldLabel>
                                    <Input id="firstName" name="firstName" defaultValue={patient.firstName} maxLength={30} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="lastName">Último Nome</FieldLabel>
                                    <Input id="lastName" name="lastName" defaultValue={patient.lastName} maxLength={50} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                                    <Input
                                        id="cpf"
                                        name="cpf"
                                        placeholder="000.000.000-00"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                                        maxLength={14}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Data de Nascimento</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between bg-transparent font-normal"
                                            >
                                                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                                                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto overflow-hidden" align="start">
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown"
                                                selected={date}
                                                onSelect={setDate}
                                                fromYear={1900}
                                                toYear={new Date().getFullYear()}
                                                locale={ptBR}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="phoneNumber">Telefone</FieldLabel>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="(11) 99999-9999"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                                        maxLength={15}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="cep">CEP</FieldLabel>
                                    <Input
                                        id="cep"
                                        name="cep"
                                        placeholder="00000-000"
                                        value={cep}
                                        onChange={(e) => setCep(formatCEP(e.target.value))}
                                        maxLength={9}
                                    />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" name="email" type="email" defaultValue={patient.email} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Senha</FieldLabel>
                                <Input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    placeholder="Mínimo 6 caracteres" 
                                    minLength={6} 
                                    maxLength={30} 
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    {/* Configurações / Gênero */}
                    <FieldSet>
                        <FieldLegend>Configurações do Perfil</FieldLegend>
                        <FieldDescription>Informações básicas de cadastro</FieldDescription>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field>
                                <FieldLabel>Gênero</FieldLabel>
                                <Select value={gender} onValueChange={(value) => setGender(value as Gender)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FEMININE">Feminino</SelectItem>
                                        <SelectItem value="MASCULINE">Masculino</SelectItem>
                                        <SelectItem value="OTHER">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </FieldSet>

                    <FieldSeparator />

                    {/* Foto */}
                    <FieldSet>
                        <FieldLegend>Foto</FieldLegend>
                        <Field>
                            <FieldLabel htmlFor="profileImageUrl">URL da Foto</FieldLabel>
                            <Input 
                                id="profileImageUrl" 
                                name="profileImageUrl" 
                                defaultValue={patient.profileImageUrl} 
                                placeholder="https://exemplo.com/foto.jpg" 
                            />
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    {/* Documentos */}
                    <FieldSet>
                        <FieldLegend>Documentos</FieldLegend>
                        <FieldDescription>Arquivos enviados pelo paciente</FieldDescription>

                        <Empty className="border border-dashed py-6">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CloudDownload className="h-8 w-8" />
                                </EmptyMedia>
                                <EmptyTitle className="text-base">Sem Documentos</EmptyTitle>
                                <EmptyDescription className="text-sm">
                                    Faça o upload dos documentos do paciente
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button variant="outline" size="sm" type="button">
                                    Upload de Documentos
                                </Button>
                            </EmptyContent>
                        </Empty>
                    </FieldSet>

                    <FieldSeparator />

                    {/* Botão Salvar */}
                    <Field orientation="horizontal">
                        <Button className="w-full" type="submit" disabled={isPending}>
                            {isPending ? "Atualizando..." : "Atualizar paciente"}
                        </Button>
                    </Field>

                </FieldGroup>
            </form>
        </div>
    )
}