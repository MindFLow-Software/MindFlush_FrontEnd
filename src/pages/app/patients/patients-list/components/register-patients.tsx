"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDownIcon, CloudDownload } from "lucide-react"
import { toast } from "sonner"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

    // === MUTATION COM ATUALIZAÇÃO EM TEMPO REAL ===
    const { mutateAsync: registerPatientFn, isPending } = useMutation({
        mutationFn: registerPatients,
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["patients"] })
            const previousPatients = queryClient.getQueryData(["patients"])

            // Atualiza cache otimisticamente
            queryClient.setQueryData(["patients"], (oldData: any) => {
                if (Array.isArray(oldData)) {
                    return [...oldData, variables]
                }
                if (oldData?.data && Array.isArray(oldData.data)) {
                    return {
                        ...oldData,
                        data: [...oldData.data, variables],
                    }
                }
                return oldData
            })

            return { previousPatients }
        },
        onError: (_err, _vars, context) => {
            // Reverte o cache se algo falhar
            if (context?.previousPatients) {
                queryClient.setQueryData(["patients"], context.previousPatients)
            }
            toast.error("Erro ao cadastrar paciente.")
        },
        onSuccess: () => {
            toast.success("Paciente cadastrado com sucesso!")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
        },
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const form = e.currentTarget
        const formData = new FormData(form)

        const data: RegisterPatientsBody = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: (formData.get("email") as string) || undefined,
            password: formData.get("password") as string,
            phoneNumber: phone,
            profileImageUrl: (formData.get("profileImageUrl") as string) || undefined,
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
                <DialogDescription>Preencha os dados para cadastrar um novo paciente</DialogDescription>
            </DialogHeader>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Primeiro Nome</Label>
                            <Input id="firstName" name="firstName" placeholder="Ex: Mariana" maxLength={30} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Último Nome</Label>
                            <Input id="lastName" name="lastName" placeholder="Ex: Silva" maxLength={50} />
                        </div>

                        {/* CPF */}
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) => setCpf(formatCPF(e.target.value))}
                                maxLength={14}
                                name="cpf"
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div className="space-y-2">
                            <Label htmlFor="birthDate" className="px-1">
                                Data de Nascimento
                            </Label>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between font-normal bg-transparent"
                                    >
                                        {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                                        <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        selected={date}
                                        onSelect={(selectedDate) => {
                                            setDate(selectedDate)
                                        }}
                                        fromYear={1900}
                                        toYear={new Date().getFullYear()}
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Telefone */}
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Telefone</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="(11) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(formatPhone(e.target.value))}
                                maxLength={15}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="exemplo@email.com" />
                        </div>

                        {/* CEP */}
                        <div className="space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input
                                id="cep"
                                name="cep"
                                placeholder="00000-000"
                                value={cep}
                                onChange={(e) => setCep(formatCEP(e.target.value))}
                                maxLength={9}
                            />
                        </div>
                    </div>

                    {/* Senha */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" minLength={6} maxLength={30} />
                    </div>
                </div>

                {/* Gênero / Perfil / Ativo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gênero</Label>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FEMININE">Feminino</SelectItem>
                                <SelectItem value="MASCULINE">Masculino</SelectItem>
                                <SelectItem value="OTHER">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Perfil</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PATIENT">Paciente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="isActive">Ativo?</Label>
                        <Select value={isActive ? "true" : "false"} onValueChange={(v) => setIsActive(v === "true")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Sim</SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* URL da Foto */}
                <div className="space-y-2">
                    <Label htmlFor="profileImageUrl">URL da Foto</Label>
                    <Input id="profileImageUrl" name="profileImageUrl" placeholder="https://exemplo.com/foto.jpg" />
                </div>

                {/* Upload */}
                <div>
                    <Empty className="border border-dashed py-6">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CloudDownload className="h-8 w-8" />
                            </EmptyMedia>
                            <EmptyTitle className="text-base">Sem Documentos</EmptyTitle>
                            <EmptyDescription className="text-sm">Faça o upload dos documentos do paciente</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button variant="outline" size="sm" type="button">
                                Upload de Documentos
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>

                {/* Botão Cadastrar */}
                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Cadastrando..." : "Cadastrar paciente"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}
