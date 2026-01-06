"use client"

import { useState, useRef, useCallback, memo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CloudDownload, Paperclip, FileText, X, Loader2, CalendarIcon, Camera, Upload, Eye, EyeOff, Venus, Mars, Users } from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    FieldSet,
    FieldSeparator,
} from "@/components/ui/field"

import { Empty, EmptyHeader, EmptyTitle, EmptyMedia, EmptyContent } from "@/components/ui/empty"

import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { registerPatients, type RegisterPatientsBody } from "@/api/create-patients"
import { cn } from "@/lib/utils"
import { api } from "@/lib/axios"

interface FormErrors {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    password?: boolean
    dateOfBirth?: boolean
    cpf?: boolean
    phoneNumber?: boolean
}

interface DocumentUploadSectionProps {
    selectedFiles: File[]
    onFilesChange: (files: File[]) => void
}

const DocumentUploadSection = memo(({ selectedFiles, onFilesChange }: DocumentUploadSectionProps) => {
    const documentsInputRef = useRef<HTMLInputElement>(null)

    const handleDocumentsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            onFilesChange([...selectedFiles, ...newFiles])
        }
        if (e.target) e.target.value = ""
    }

    const handleRemoveDocument = (indexToRemove: number) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove)
        onFilesChange(updatedFiles)
    }

    const triggerFileInput = () => {
        documentsInputRef.current?.click()
    }

    return (
        <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-2">
                <Label className="block">Documentos Iniciais (Opcional)</Label>
                {selectedFiles.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={triggerFileInput}
                        className="h-8 text-xs"
                    >
                        <Paperclip className="w-3 h-3 mr-2" />
                        Adicionar
                    </Button>
                )}
            </div>

            <input
                type="file"
                ref={documentsInputRef}
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleDocumentsSelect}
            />

            <FieldSet>
                {selectedFiles.length === 0 ? (
                    <Empty className="border border-dashed py-6 mt-1 hover:bg-muted/30 transition-colors cursor-pointer" onClick={triggerFileInput}>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CloudDownload className="h-8 w-8 text-muted-foreground/60" />
                            </EmptyMedia>
                            <EmptyTitle className="text-base">Sem Documentos</EmptyTitle>
                            <EmptyTitle className="text-base font-normal text-muted-foreground">Arraste ou clique para selecionar</EmptyTitle>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                            >
                                Upload de Documentos
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <div className="space-y-2 border rounded-md p-2 mt-1 max-h-40 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 bg-muted/40 rounded-md border text-sm animate-in fade-in slide-in-from-bottom-1">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-8 w-8 rounded bg-background flex items-center justify-center border shrink-0 text-blue-500">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium truncate">{file.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                    onClick={() => handleRemoveDocument(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </FieldSet>
        </div>
    )
})
DocumentUploadSection.displayName = "DocumentUploadSection"

interface RegisterPatientsProps {
    onSuccess?: () => void
}

export function RegisterPatients({ onSuccess }: RegisterPatientsProps) {
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [date, setDate] = useState<Date | undefined>()
    const [cpf, setCpf] = useState("")
    const [phone, setPhone] = useState("")
    const [gender, setGender] = useState("FEMININE")
    const [isActive] = useState(true)

    const [showPassword, setShowPassword] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
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
            if (onSuccess) onSuccess()
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

    const handleFilesChange = useCallback((files: File[]) => {
        setSelectedFiles(files)
    }, [])

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

            // 1. Upload de Documentos para obter os IDs
            let attachmentIds: string[] = []
            if (selectedFiles.length > 0) {
                attachmentIds = await Promise.all(
                    selectedFiles.map(async (file) => {
                        const formData = new FormData()
                        formData.append('file', file)
                        const response = await api.post<{ attachmentId: string }>("/attachments", formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        })
                        return response.data.attachmentId
                    })
                )
            }

            // 2. Registro do Paciente com os IDs vinculados
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
                expertise: "OTHER" as any,
                profileImageUrl: previewImage || undefined,
                attachmentIds,
            }

            await registerPatientFn(data)

            form.reset()
            setCpf("")
            setPhone("")
            setDate(undefined)
            setGender("FEMININE")
            setPreviewImage(null)
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
                <DialogTitle>Novo Prontuário</DialogTitle>
                <DialogDescription>
                    Cadastre as informações básicas do paciente para iniciar o acompanhamento.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
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
                        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md group-hover:scale-110 transition-transform">
                            <Upload className="h-3 w-3" />
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Clique para adicionar foto</span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="border-t my-2" />

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
                </div>

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
                                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FEMININE"><div className="flex items-center gap-2"><Venus className="h-4 w-4 text-rose-500" /> Feminino</div></SelectItem>
                                    <SelectItem value="MASCULINE"><div className="flex items-center gap-2"><Mars className="h-4 w-4 text-blue-500" /> Masculino</div></SelectItem>
                                    <SelectItem value="OTHER"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" /> Outro</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email" className={cn(errors.email && "text-red-500")}>Email *</Label>
                            <Input id="email" name="email" type="email" placeholder="email@exemplo.com" className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="password" className={cn(errors.password && "text-red-500")}>Senha de Acesso *</Label>
                            <div className="relative">
                                <Input
                                    id="password" name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mínimo 6 caracteres"
                                    className={cn("pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                                />
                                <Button
                                    type="button" variant="ghost" size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <DocumentUploadSection selectedFiles={selectedFiles} onFilesChange={handleFilesChange} />

                <FieldSeparator />

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isPending || isUploading} className="cursor-pointer gap-2 w-full lg:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                        {(isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending || isUploading ? "Salvando..." : "Cadastrar Paciente"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}