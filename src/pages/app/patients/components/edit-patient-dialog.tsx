"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDownIcon, CloudDownload } from "lucide-react"
import { toast } from "sonner"
// Importação simulada do AxiosError, assumindo que está disponível no seu ambiente
// import { AxiosError } from "axios" 

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import {
    Field,
    FieldGroup,
    FieldSet,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
} from "@/components/ui/field"

import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyMedia,
    EmptyContent,
} from "@/components/ui/empty"

import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

import { updatePatient, type UpdatePatientData } from "@/api/upadate-patient"

interface FormErrors {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    password?: boolean
    dateOfBirth?: boolean
    cpf?: boolean
    phoneNumber?: boolean
}

interface EditPatientProps {
    patient: UpdatePatientData
    onClose?: () => void
}

const cn = (...classes: (string | boolean | undefined)[]) =>
    classes.filter(Boolean).join(" ")

export function EditPatient({ patient, onClose }: EditPatientProps) {
    const queryClient = useQueryClient()

    const [date, setDate] = useState<Date | undefined>(
        patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined
    )
    const [cpf, setCpf] = useState(patient.cpf ? formatCPF(patient.cpf) : "")
    const [phone, setPhone] = useState(
        patient.phoneNumber ? formatPhone(patient.phoneNumber) : ""
    )

    const [gender, setGender] = useState(patient.gender || "FEMININE")

    const [errors, setErrors] = useState<FormErrors>({})

    const { mutateAsync: updatePatientFn, isPending } = useMutation({
        mutationFn: updatePatient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
            toast.success("Paciente atualizado com sucesso!")
            onClose?.()
        },
        onError: (err: any) => {
            // --- INÍCIO DA LÓGICA DE TRATAMENTO DE ERROS COM DETALHES DA API ---
            let errorMessage = "Erro ao atualizar paciente."

            // Tenta verificar se é um erro de resposta HTTP
            if (err.response) {
                // Tenta extrair a mensagem de erro do corpo da resposta
                const apiMessage = err.response.data?.message || err.response.data?.error

                if (err.response.status === 409) {
                    errorMessage = apiMessage || "Conflito: CPF ou Email já cadastrado para outro paciente."
                } else if (apiMessage) {
                    errorMessage = apiMessage
                } else {
                    errorMessage = `Erro (${err.response.status}): Falha na comunicação com o servidor.`
                }
            } else {
                // Se não houver response, usa a mensagem genérica
                errorMessage = "Erro de rede ou desconhecido. Tente novamente."
            }

            toast.error(errorMessage)
            // --- FIM DA LÓGICA DE TRATAMENTO DE ERROS COM DETALHES DA API ---
        },
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrors({})

        const form = e.currentTarget
        const fd = new FormData(form)

        const rawCpf = cpf.replace(/\D/g, "")
        const rawPhone = phone.replace(/\D/g, "")

        const firstName = fd.get("firstName") as string
        const lastName = fd.get("lastName") as string
        const email = fd.get("email") as string
        const password = fd.get("password") as string

        const newErrors: FormErrors = {}

        if (!firstName) newErrors.firstName = true
        if (!lastName) newErrors.lastName = true
        if (!email) newErrors.email = true
        if (password && password.length < 6) newErrors.password = true
        if (!date) newErrors.dateOfBirth = true
        if (rawCpf.length < 11) newErrors.cpf = true
        if (rawPhone.length < 10) newErrors.phoneNumber = true

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Preencha corretamente os campos destacados.")
            return
        }

        const data: UpdatePatientData = {
            id: patient.id,
            firstName,
            lastName,
            email: email || undefined,
            // A senha só é enviada se preenchida
            password: password || undefined,
            phoneNumber: rawPhone,
            profileImageUrl: (fd.get("profileImageUrl") as string) || undefined,
            dateOfBirth: date!,
            cpf: rawCpf,
            gender: gender as any,
        }

        await updatePatientFn(data)
    }

    return (
        <DialogContent className="max-h-[85vh] max-w-2xl p-0 flex flex-col gap-0">

            <DialogHeader className="p-6 pb-2 shrink-0">
                <DialogTitle>Editar Paciente</DialogTitle>
                <DialogDescription>
                    Atualize os dados do paciente {patient.firstName} {patient.lastName}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 pb-6">
                <FieldGroup className="mt-2">

                    <FieldSet>
                        <FieldLegend>Dados Pessoais</FieldLegend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <Field>
                                <FieldLabel htmlFor="firstName">Primeiro Nome*</FieldLabel>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    maxLength={30}
                                    defaultValue={patient.firstName}
                                    className={cn(errors.firstName && "border-red-500 ring-red-500")}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="lastName">Último Nome*</FieldLabel>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    maxLength={50}
                                    defaultValue={patient.lastName}
                                    className={cn(errors.lastName && "border-red-500 ring-red-500")}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="cpf">CPF*</FieldLabel>
                                <Input
                                    id="cpf"
                                    name="cpf"
                                    maxLength={14}
                                    value={cpf}
                                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                                    className={cn(errors.cpf && "border-red-500 ring-red-500")}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Data de Nascimento*</FieldLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-between bg-transparent font-normal",
                                                errors.dateOfBirth &&
                                                "border-red-500 text-red-500 hover:text-red-500 hover:border-red-500"
                                            )}
                                        >
                                            {date
                                                ? format(date, "dd/MM/yyyy", { locale: ptBR })
                                                : "Selecione a data"}
                                            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="p-0 w-auto" align="start">
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
                                <FieldLabel htmlFor="phoneNumber">Telefone*</FieldLabel>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    maxLength={15}
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    className={cn(errors.phoneNumber && "border-red-500 ring-red-500")}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email*</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={patient.email}
                                    className={cn(errors.email && "border-red-500 ring-red-500")}
                                />
                            </Field>

                        </div>

                        <Field>
                            <FieldLabel htmlFor="password">Senha</FieldLabel>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Deixe em branco para manter a atual"
                                minLength={6}
                                maxLength={30}
                                className={cn(errors.password && "border-red-500 ring-red-500")}
                            />
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet>
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <Field>
                                <FieldLabel>Gênero do Paciente</FieldLabel>
                                <Select
                                    value={gender}
                                    onValueChange={(value) =>
                                        setGender(value as "FEMININE" | "MASCULINE" | "OTHER")
                                    }
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
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

                    <FieldSet>
                        <FieldLegend>Documentos do Paciente</FieldLegend>

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

                    <Field orientation="horizontal">
                        <Button className="w-full" type="submit" disabled={isPending}>
                            {isPending ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </Field>

                </FieldGroup>
            </form>
        </DialogContent>
    )
}