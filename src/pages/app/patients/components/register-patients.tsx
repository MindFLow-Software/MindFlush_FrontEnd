"use client"

import { useState, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    CalendarIcon,
    Loader2,
    Upload,
    Eye,
    EyeOff,
    Mars,
    Venus,
    Users,
    Camera,
    CloudUpload
} from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { registerPatients, type RegisterPatientsBody } from "@/api/create-patients"
import { FieldSet } from "@/components/ui/field"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

// Utilitário simples para classes condicionais
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface FormErrors {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    password?: boolean
    dateOfBirth?: boolean
    cpf?: boolean
    phoneNumber?: boolean
}

export function RegisterPatients() {
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Estados do Formulário
    const [date, setDate] = useState<Date | undefined>()
    const [cpf, setCpf] = useState("")
    const [phone, setPhone] = useState("")
    const [gender, setGender] = useState("FEMININE")
    const [isActive] = useState(true)

    // Estados de UI
    const [showPassword, setShowPassword] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [errors, setErrors] = useState<FormErrors>({})

    // Mutação (API)
    const { mutateAsync: registerPatientFn, isPending } = useMutation({
        mutationFn: registerPatients,
        onSuccess: () => {
            toast.success("Paciente cadastrado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["patients"] })
        },
        onError: (err) => {
            let errorMessage = "Erro ao cadastrar paciente."
            if (err instanceof AxiosError && err.response) {
                errorMessage = err.response.data?.message || "Erro na comunicação com o servidor."
            }
            toast.error(errorMessage)
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setPreviewImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

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

        // Validação Manual
        if (!firstName) newErrors.firstName = true
        if (!lastName) newErrors.lastName = true
        if (!email) newErrors.email = true
        if (!password || password.length < 6) newErrors.password = true
        if (!date) newErrors.dateOfBirth = true
        if (rawCpf.length < 11) newErrors.cpf = true
        if (rawPhone.length < 10) newErrors.phoneNumber = true

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
            dateOfBirth: date!,
            cpf: rawCpf,
            role: "PATIENT" as any,
            gender: gender as any,
            isActive,
            expertise: "NONE" as any,
            // Passando a string base64 se houver, ou undefined
            profileImageUrl: previewImage || undefined
        }

        try {
            await registerPatientFn(data)
            // Reset do form
            form.reset()
            setCpf("")
            setPhone("")
            setDate(undefined)
            setGender("FEMININE")
            setPreviewImage(null)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl">
            <DialogHeader>
                <DialogTitle>Novo Prontuário</DialogTitle>
                <DialogDescription>
                    Cadastre as informações básicas do paciente para iniciar o acompanhamento.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">

                {/* 1. SEÇÃO DE AVATAR (NOVIDADE UI) */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Avatar className="h-24 w-24 border-2 border-dashed border-muted-foreground/30 group-hover:border-primary transition-colors">
                            <AvatarImage src={previewImage || ""} className="object-cover" />
                            <AvatarFallback className="bg-muted">
                                <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </AvatarFallback>
                        </Avatar>

                        {/* Botãozinho flutuante de editar */}
                        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md group-hover:scale-110 transition-transform">
                            <Upload className="h-3 w-3" />
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Clique para adicionar foto</span>

                    {/* Input invisível */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="border-t my-2" />

                {/* 2. DADOS PESSOAIS */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Dados Pessoais
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className={cn(errors.firstName && "text-red-500")}>Nome *</Label>
                            <Input
                                id="firstName" name="firstName" placeholder="Ex: Ana"
                                className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className={cn(errors.lastName && "text-red-500")}>Sobrenome *</Label>
                            <Input
                                id="lastName" name="lastName" placeholder="Ex: Silva"
                                className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cpf" className={cn(errors.cpf && "text-red-500")}>CPF *</Label>
                            <Input
                                id="cpf" name="cpf" placeholder="000.000.000-00" maxLength={14}
                                value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))}
                                className={cn(errors.cpf && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className={cn(errors.dateOfBirth && "text-red-500")}>Data de Nascimento *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground",
                                            errors.dateOfBirth && "border-red-500 text-red-500"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : <span>Selecione</span>}
                                    </Button>
                                </PopoverTrigger>

                                {/* AQUI ESTÁ A MUDANÇA */}
                                <PopoverContent className="w-auto p-0" align="start">
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
                        </div>
                    </div>
                </div>

                {/* 3. CONTATO E ACESSO */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 pt-2 border-t">
                        Contato e Acesso
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className={cn(errors.phoneNumber && "text-red-500")}>Celular / WhatsApp *</Label>
                            <Input
                                id="phoneNumber" name="phoneNumber" placeholder="(00) 00000-0000" maxLength={15}
                                value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))}
                                className={cn(errors.phoneNumber && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Gênero</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FEMININE">
                                        <div className="flex items-center gap-2"><Venus className="h-4 w-4 text-rose-500" /> Feminino</div>
                                    </SelectItem>
                                    <SelectItem value="MASCULINE">
                                        <div className="flex items-center gap-2"><Mars className="h-4 w-4 text-blue-500" /> Masculino</div>
                                    </SelectItem>
                                    <SelectItem value="OTHER">
                                        <div className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" /> Outro</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email" className={cn(errors.email && "text-red-500")}>Email *</Label>
                            <Input
                                id="email" name="email" type="email" placeholder="email@exemplo.com"
                                className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="password" className={cn(errors.password && "text-red-500")}>Senha de Acesso *</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mínimo 6 caracteres"
                                    className={cn("pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. DOCUMENTOS (Placeholder visual melhorado) */}
                <div className="pt-2 border-t">
                    <Label className="mb-2 block">Documentos Iniciais (Opcional)</Label>
                    <FieldSet>
                        <Empty className="border border-dashed py-6 mt-3">
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
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isPending} className="w-full sm:w-auto min-w-[150px]">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? "Salvando..." : "Cadastrar Paciente"}
                    </Button>
                </div>

            </form>
        </DialogContent>
    )
}