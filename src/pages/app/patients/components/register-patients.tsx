"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDownIcon, CloudDownload } from "lucide-react"
import { toast } from "sonner"

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
    FieldDescription,
    FieldSeparator,
} from "@/components/ui/field"

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent } from "@/components/ui/empty"

import { formatCEP } from "@/utils/formatCEP"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

import { registerPatients, type RegisterPatientsBody } from "@/api/create-patients"

export function RegisterPatients() {
    const queryClient = useQueryClient()

    const [date, setDate] = useState<Date | undefined>()
    const [cpf, setCpf] = useState("")
    const [phone, setPhone] = useState("")
    const [cep, setCep] = useState("")
    const [gender, setGender] = useState("FEMININE")
    const [role, setRole] = useState("PATIENT")
    const [isActive, setIsActive] = useState(true)

    const { mutateAsync: registerPatientFn, isPending } = useMutation({
        mutationFn: registerPatients,
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["patients"] })
            const previous = queryClient.getQueryData(["patients"])

            queryClient.setQueryData(["patients"], (old: any) => {
                if (Array.isArray(old)) return [...old, variables]
                if (old?.data && Array.isArray(old.data))
                    return { ...old, data: [...old.data, variables] }
                return old
            })

            return { previous }
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["patients"], ctx.previous)
            toast.error("Erro ao cadastrar paciente.")
        },
        onSuccess: () => toast.success("Paciente cadastrado com sucesso!"),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] })
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const form = e.currentTarget
        const fd = new FormData(form)

        const data: RegisterPatientsBody = {
            firstName: fd.get("firstName") as string,
            lastName: fd.get("lastName") as string,
            email: (fd.get("email") as string) || undefined,
            password: fd.get("password") as string,
            phoneNumber: phone,
            profileImageUrl: (fd.get("profileImageUrl") as string) || undefined,
            dateOfBirth: date!,
            cpf,
            role: role as any,
            gender: gender as any,
            isActive,
            expertise: "NONE" as any,
        }

        await registerPatientFn(data)

        form.reset()
        setCpf("")
        setPhone("")
        setCep("")
        setDate(undefined)
        setGender("FEMININE")
        setRole("PATIENT")
        setIsActive(true)
    }

    return (
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Novo Paciente</DialogTitle>
                <DialogDescription>
                    Preencha os dados para cadastrar um novo paciente
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <FieldGroup className="mt-3">

                    <FieldSet>
                        <FieldGroup>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <Field>
                                    <FieldLabel htmlFor="firstName">Primeiro Nome</FieldLabel>
                                    <Input id="firstName" name="firstName" maxLength={30} placeholder="Ex: Mariana" />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="lastName">Último Nome</FieldLabel>
                                    <Input id="lastName" name="lastName" maxLength={50} placeholder="Ex: Silva" />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                                    <Input
                                        id="cpf"
                                        name="cpf"
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        value={cpf}
                                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Data de Nascimento</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between bg-transparent font-normal">
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
                                        maxLength={15}
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="cep">CEP</FieldLabel>
                                    <Input
                                        id="cep"
                                        name="cep"
                                        placeholder="00000-000"
                                        maxLength={9}
                                        value={cep}
                                        onChange={(e) => setCep(formatCEP(e.target.value))}
                                    />
                                </Field>

                            </div>

                             <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input id="email" name="email" type="email" placeholder="exemplo@email.com" />
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

                    <FieldSet>
                        <FieldLegend>Configurações do Perfil</FieldLegend>
                        <FieldDescription>Informações internas do sistema</FieldDescription>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                            <Field>
                                <FieldLabel>Gênero</FieldLabel>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FEMININE">Feminino</SelectItem>
                                        <SelectItem value="MASCULINE">Masculino</SelectItem>
                                        <SelectItem value="OTHER">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel>Perfil</FieldLabel>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PATIENT">Paciente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel>Ativo?</FieldLabel>
                                <Select value={isActive ? "true" : "false"} onValueChange={(v) => setIsActive(v === "true")}>
                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Sim</SelectItem>
                                        <SelectItem value="false">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                        </div>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet>
                        <FieldLegend>Foto</FieldLegend>

                        <Field>
                            <FieldLabel htmlFor="profileImageUrl">URL da Foto</FieldLabel>
                            <Input id="profileImageUrl" name="profileImageUrl" placeholder="https://exemplo.com/foto.jpg" />
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet>
                        <FieldLegend>Documentos</FieldLegend>
                        <FieldDescription>Arquivos enviados pelo paciente</FieldDescription>

                        <Empty className="border border-dashed py-6">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CloudDownload className="h-8 w-8" />
                                </EmptyMedia>
                                <EmptyTitle className="text-base">Sem Documentos</EmptyTitle>
                                <EmptyDescription className="text-sm">Faça o upload dos documentos do paciente</EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button variant="outline" size="sm" type="button">Upload de Documentos</Button>
                            </EmptyContent>
                        </Empty>
                    </FieldSet>

                    <FieldSeparator />

                    <Field orientation="horizontal">
                        <Button className="w-full" type="submit" disabled={isPending}>
                            {isPending ? "Cadastrando..." : "Cadastrar paciente"}
                        </Button>
                    </Field>

                </FieldGroup>
            </form>
        </DialogContent>
    )
}
