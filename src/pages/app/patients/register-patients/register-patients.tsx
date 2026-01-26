"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, CalendarIcon, Eye, EyeOff, Venus, Mars, Users, ShieldCheck, Contact } from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { IMaskMixin } from "react-imask"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { registerPatients } from "@/api/create-patients"
import { uploadAttachment } from "@/api/attachments"
import { cn } from "@/lib/utils"
import { UploadZone } from "./upload-zone"
import { PatientAvatarUpload } from "./patient-avatar-upload"

interface FormErrors {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    password?: boolean
    dateOfBirth?: boolean
    cpf?: boolean
    phoneNumber?: boolean
}

interface RegisterPatientsProps {
    onSuccess?: () => void
}

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
    <Input ref={inputRef} {...props} />
))

export function RegisterPatients({ onSuccess }: RegisterPatientsProps) {
    const queryClient = useQueryClient()

    const [date, setDate] = useState<Date | undefined>()
    const [cpf, setCpf] = useState("")
    const [phone, setPhone] = useState("")
    const [gender, setGender] = useState("FEMININE")
    const [showPassword, setShowPassword] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [errors, setErrors] = useState<FormErrors>({})
    const [isUploading, setIsUploading] = useState(false)

    const { mutateAsync: registerPatientFn, isPending } = useMutation({
        mutationFn: registerPatients,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unseen-popups'] })
            queryClient.invalidateQueries({ queryKey: ["patients"] })
            queryClient.invalidateQueries({ queryKey: ["metrics"] })
            toast.success("Paciente cadastrado com sucesso!")
            onSuccess?.()
        },
        onError: (err) => {
            let errorMessage = "Erro ao cadastrar paciente."
            if (err instanceof AxiosError && err.response) {
                errorMessage = err.response.data?.message || "Erro na comunicação com o servidor."
            }
            toast.error(errorMessage)
        }
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
        if (!password || password.length < 6) newErrors.password = true
        if (!date) newErrors.dateOfBirth = true
        if (rawCpf.length < 11) newErrors.cpf = true
        if (rawPhone.length < 10) newErrors.phoneNumber = true

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Preencha corretamente os campos destacados.")
            return
        }

        try {
            setIsUploading(true)

            let profileImageUrl = undefined
            if (avatarFile) {
                const response = await uploadAttachment(avatarFile)
                profileImageUrl = response.url
            }

            let attachmentIds: string[] = []
            if (selectedFiles.length > 0) {
                attachmentIds = await Promise.all(
                    selectedFiles.map(async (file) => {
                        const response = await uploadAttachment(file)
                        return response.attachmentId
                    })
                )
            }

            await registerPatientFn({
                firstName,
                lastName,
                email: email || undefined,
                password,
                phoneNumber: rawPhone,
                dateOfBirth: date!,
                cpf: rawCpf,
                role: "PATIENT" as any,
                gender: gender as any,
                isActive: true,
                expertise: "OTHER" as any,
                profileImageUrl,
                attachmentIds,
            })

            form.reset()
            setCpf("")
            setPhone("")
            setDate(undefined)
            setGender("FEMININE")
            setAvatarFile(null)
            setSelectedFiles([])
        } catch (error) {
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Novo Prontuário</DialogTitle>
                <DialogDescription>
                    Cadastre as informações básicas do paciente para iniciar o acompanhamento.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                <section aria-label="Foto de perfil">
                    <PatientAvatarUpload onFileSelect={setAvatarFile} />
                </section>

                <fieldset className="space-y-4">
                    <legend className="text-sm font-semibold text-foreground flex items-center gap-2 px-1 mb-4">
                        <Contact className="size-4 text-blue-500" />
                        Dados Pessoais
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className={cn(errors.firstName && "text-red-500")}>Nome *</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Ex: Ana"
                                autoComplete="given-name"
                                aria-invalid={errors.firstName}
                                className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className={cn(errors.lastName && "text-red-500")}>Sobrenome *</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Ex: Silva"
                                autoComplete="family-name"
                                aria-invalid={errors.lastName}
                                className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cpf" className={cn(errors.cpf && "text-red-500")}>CPF *</Label>
                            <MaskedInput
                                id="cpf"
                                name="cpf"
                                mask="000.000.000-00"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onAccept={(value: string) => setCpf(value)}
                                aria-invalid={errors.cpf}
                                className={cn(errors.cpf && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={cn(errors.dateOfBirth && "text-red-500")}>Data de Nascimento *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        aria-label="Selecionar data de nascimento"
                                        className={cn(
                                            "w-full justify-start text-left font-normal cursor-pointer",
                                            !date && "text-muted-foreground",
                                            errors.dateOfBirth && "border-red-500 text-red-500"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : <span>Selecione</span>}
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
                        </div>
                    </div>
                </fieldset>

                <fieldset className="space-y-4">
                    <legend className="text-sm font-semibold text-foreground flex items-center gap-2 pt-2 border-t w-full px-1 mb-4">
                        <ShieldCheck className="size-4 text-blue-500" />
                        Contato e Acesso
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className={cn(errors.phoneNumber && "text-red-500")}>Celular / WhatsApp *</Label>
                            <MaskedInput
                                id="phoneNumber"
                                name="phoneNumber"
                                mask="(00) 00000-0000"
                                type="tel"
                                autoComplete="tel"
                                placeholder="(00) 00000-0000"
                                value={phone}
                                onAccept={(value: string) => setPhone(value)}
                                aria-invalid={errors.phoneNumber}
                                className={cn(errors.phoneNumber && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender-select">Gênero</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger id="gender-select" className="cursor-pointer">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FEMININE" className="cursor-pointer">
                                        <div className="flex items-center gap-2"><Venus className="h-4 w-4 text-rose-500" /> Feminino</div>
                                    </SelectItem>
                                    <SelectItem value="MASCULINE" className="cursor-pointer">
                                        <div className="flex items-center gap-2"><Mars className="h-4 w-4 text-blue-500" /> Masculino</div>
                                    </SelectItem>
                                    <SelectItem value="OTHER" className="cursor-pointer">
                                        <div className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" /> Outro</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email" className={cn(errors.email && "text-red-500")}>Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="email@exemplo.com"
                                aria-invalid={errors.email}
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
                                    autoComplete="new-password"
                                    placeholder="Mínimo 6 caracteres"
                                    aria-invalid={errors.password}
                                    className={cn("pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <section aria-label="Anexos e documentos">
                    <UploadZone selectedFiles={selectedFiles} onFilesChange={setSelectedFiles} />
                </section>

                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={isPending || isUploading}
                        className="gap-2 w-full lg:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                        {(isPending || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isPending || isUploading ? "Salvando..." : "Cadastrar Paciente"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}