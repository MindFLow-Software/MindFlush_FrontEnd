"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDownIcon, CloudUpload } from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios" // Importar o tipo AxiosError para tipagem
// ⚠️ Importar cn se estiver usando
// import { cn } from "@/lib/utils" 

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

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent } from "@/components/ui/empty"

import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

import { registerPatients, type RegisterPatientsBody } from "@/api/create-patients"

interface FormErrors {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    password?: boolean
    dateOfBirth?: boolean
    cpf?: boolean
    phoneNumber?: boolean
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');


export function RegisterPatients() {
    const queryClient = useQueryClient()

    const [date, setDate] = useState<Date | undefined>()
    const [cpf, setCpf] = useState("")
    const [phone, setPhone] = useState("")
    const [gender, setGender] = useState("FEMININE")
    // REMOVIDO: const [role, setRole] = useState("PATIENT")
    const [isActive, setIsActive] = useState(true)

    const [errors, setErrors] = useState<FormErrors>({})

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
        onError: (err, _vars, ctx) => { // O tipo 'err' é inferido ou pode ser tipado como 'AxiosError'
            if (ctx?.previous) queryClient.setQueryData(["patients"], ctx.previous)

            // --- INÍCIO DA LÓGICA DE TRATAMENTO DE ERROS COM DETALHES DA API ---
            let errorMessage = "Erro ao cadastrar paciente."

            // Verifica se é um erro do Axios e se há uma resposta com dados
            if (err instanceof AxiosError && err.response) {
                // Tenta extrair a mensagem do corpo da resposta (padrão de muitas APIs)
                const apiMessage = err.response.data?.message || err.response.data?.error

                if (err.response.status === 409) {
                    errorMessage = apiMessage || "Conflito: CPF ou Email já cadastrado no sistema."
                } else if (apiMessage) {
                    errorMessage = apiMessage
                } else {
                    errorMessage = `Erro (${err.response.status}): Falha na comunicação com o servidor.`
                }
            } else {
                errorMessage = "Erro desconhecido. Tente novamente."
            }

            toast.error(errorMessage)
        },
        onSuccess: () => toast.success("Paciente cadastrado com sucesso!"),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] })
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrors({}) // Limpa erros anteriores no início

        const form = e.currentTarget
        const fd = new FormData(form)

        const rawCpf = cpf.replace(/\D/g, "")
        const rawPhone = phone.replace(/\D/g, "")

        const firstName = fd.get("firstName") as string
        const lastName = fd.get("lastName") as string
        const email = fd.get("email") as string
        const password = fd.get("password") as string

        const newErrors: FormErrors = {}

        // --- Lógica de Validação ---
        if (!firstName) newErrors.firstName = true
        if (!lastName) newErrors.lastName = true
        if (!email) newErrors.email = true
        if (password.length < 6) newErrors.password = true
        if (!date) newErrors.dateOfBirth = true
        if (rawCpf.length < 11) newErrors.cpf = true
        if (rawPhone.length < 10) newErrors.phoneNumber = true

        // Se houver erros, atualiza o estado e para
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Preencha corretamente os campos destacados.")
            return
        }

        const data: RegisterPatientsBody = {
            firstName,
            lastName,
            email: email || undefined,
            password,
            phoneNumber: rawPhone,
            profileImageUrl: (fd.get("profileImageUrl") as string) || undefined,
            dateOfBirth: date!,
            cpf: rawCpf,
            role: "PATIENT" as any,
            gender: gender as any,
            isActive,
            expertise: "NONE" as any,
        }

        try {
            await registerPatientFn(data)

            // Resetar o formulário apenas em caso de sucesso
            form.reset()
            setCpf("")
            setPhone("")
            setDate(undefined)
            setGender("FEMININE")
            setIsActive(true)

        } catch (error) {
            // O erro já é tratado no bloco onError do useMutation
            // Não é necessário fazer mais nada aqui, apenas evitar o reset
            console.error("Erro no cadastro:", error);
        }

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
                                    <FieldLabel htmlFor="firstName">Primeiro Nome*</FieldLabel>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        maxLength={30}
                                        placeholder="Ex: Mariana"
                                        className={cn(errors.firstName && "border-red-500 ring-red-500")}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="lastName">Último Nome*</FieldLabel>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        maxLength={50}
                                        placeholder="Ex: Silva"
                                        className={cn(errors.lastName && "border-red-500 ring-red-500")}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="cpf">CPF*</FieldLabel>
                                    <Input
                                        id="cpf"
                                        name="cpf"
                                        placeholder="000.000.000-00"
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
                                                    errors.dateOfBirth && "border-red-500 text-red-500 hover:text-red-500 hover:border-red-500" // 🔴 Borda vermelha para o botão Popover
                                                )}
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
                                    <FieldLabel htmlFor="phoneNumber">Telefone*</FieldLabel>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="(11) 99999-9999"
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
                                        placeholder="exemplo@email.com"
                                        className={cn(errors.email && "border-red-500 ring-red-500")}
                                    />
                                </Field>

                            </div>

                            <Field>
                                <FieldLabel htmlFor="password">Senha*</FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    minLength={6}
                                    maxLength={30}
                                    className={cn(errors.password && "border-red-500 ring-red-500")}
                                />
                            </Field>

                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet>
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">

                            <Field>
                                <FieldLabel>Gênero do Paciente</FieldLabel>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FEMININE">Feminino</SelectItem>
                                        <SelectItem value="MASCULINE">Masculino</SelectItem>
                                        <SelectItem value="OTHER">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                        </div>
                    </FieldSet>


                    <FieldSet>
                        <FieldLegend>Documentos do Paciente</FieldLegend>

                        <Empty className="border border-dashed py-6">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CloudUpload className="h-8 w-8" />
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