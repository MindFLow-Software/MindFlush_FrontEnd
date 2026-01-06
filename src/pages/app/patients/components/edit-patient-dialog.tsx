"use client"

import { useState, useRef, useCallback, memo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
    CloudUpload,
    Paperclip,
    FileText,
    Trash,
    ArrowDownToLine
} from "lucide-react"
import { toast } from "sonner"

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
import { updatePatient, type UpdatePatientData } from "@/api/upadate-patient"
import { FieldSet } from "@/components/ui/field"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { api } from "@/lib/axios"

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

interface Attachment {
    id: string
    filename: string
    url: string
    size: number
    uploadedAt: string
}

interface EditPatientProps {
    patient: UpdatePatientData
    onClose?: () => void
}

const DocumentUploadSection = memo(({ selectedFiles, onFilesChange }: { selectedFiles: File[], onFilesChange: (files: File[]) => void }) => {
    const documentsInputRef = useRef<HTMLInputElement>(null)

    const handleDocumentsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            onFilesChange([...selectedFiles, ...newFiles])
        }
        if (e.target) e.target.value = ""
    }

    const handleRemoveDocument = (indexToRemove: number) => {
        onFilesChange(selectedFiles.filter((_, index) => index !== indexToRemove))
    }

    const triggerFileInput = () => documentsInputRef.current?.click()

    return (
        <div className="pt-2 border-t mt-4">
            <div className="flex items-center justify-between mb-2">
                <Label className="block font-medium">Novos Documentos (Opcional)</Label>
                {selectedFiles.length > 0 && (
                    <Button variant="outline" size="sm" type="button" onClick={triggerFileInput} className="h-8 text-xs">
                        <Paperclip className="w-3 h-3 mr-2" />
                        Adicionar
                    </Button>
                )}
            </div>

            <input type="file" ref={documentsInputRef} className="hidden" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handleDocumentsSelect} />

            <FieldSet>
                {selectedFiles.length === 0 ? (
                    <Empty className="border border-dashed py-6 mt-1 hover:bg-muted/30 transition-colors cursor-pointer" onClick={triggerFileInput}>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CloudUpload className="h-8 w-8 text-muted-foreground/60" />
                            </EmptyMedia>
                            <EmptyTitle className="text-base font-medium text-foreground text-center">Adicionar Arquivos</EmptyTitle>
                            <EmptyDescription className="text-sm text-center">Clique para subir novos anexos</EmptyDescription>
                        </EmptyHeader>
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
                                        <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50" onClick={() => handleRemoveDocument(index)}>
                                    <Trash className="h-4 w-4" />
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

export function EditPatient({ patient, onClose }: EditPatientProps) {
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [date, setDate] = useState<Date | undefined>(patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined)
    const [cpf, setCpf] = useState(patient.cpf ? formatCPF(patient.cpf) : "")
    const [phone, setPhone] = useState(patient.phoneNumber ? formatPhone(patient.phoneNumber) : "")
    const [gender, setGender] = useState(patient.gender || "FEMININE")

    const [showPassword, setShowPassword] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(patient.profileImageUrl || null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [errors, setErrors] = useState<FormErrors>({})
    const [isUploading, setIsUploading] = useState(false)

    // QUERY: Busca anexos já existentes vinculados ao paciente
    const { data: existingAttachments, isLoading: isLoadingAttachments } = useQuery({
        queryKey: ["attachments", patient.id],
        queryFn: async () => {
            const response = await api.get<{ attachments: Attachment[] }>(`/attachments/patient/${patient.id}`)
            return response.data.attachments
        }
    })

    // MUTATION: Remove anexo existente (Soft Delete)
    const { mutateAsync: deleteAttachmentFn } = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/attachments/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attachments", patient.id] })
            toast.success("Documento removido com sucesso!")
        },
        onError: () => {
            toast.error("Erro ao remover documento.")
        }
    })

    const { mutateAsync: updatePatientFn, isPending } = useMutation({
        mutationFn: updatePatient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
            queryClient.invalidateQueries({ queryKey: ["attachments", patient.id] })
            toast.success("Dados atualizados com sucesso!")
            onClose?.()
        },
        onError: (err: any) => {
            let errorMessage = "Erro ao atualizar paciente."
            if (err.response) {
                const apiMessage = err.response.data?.message || err.response.data?.error
                errorMessage = apiMessage || errorMessage
            }
            toast.error(errorMessage)
        },
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

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename; // Força o nome do arquivo no download
            document.body.appendChild(link);
            link.click();

            // Limpeza
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            toast.error("Erro ao baixar o arquivo. Tente abrir em uma nova aba.");
            window.open(url, '_blank'); // Fallback caso o fetch falhe (ex: CORS)
        }
    };

    const handleRemoveExistingFile = async (id: string) => {
        if (confirm("Deseja realmente remover este documento do prontuário?")) {
            await deleteAttachmentFn(id)
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
        if (!firstName) newErrors.firstName = true
        if (!lastName) newErrors.lastName = true
        if (!email) newErrors.email = true
        if (password && password.length < 6) newErrors.password = true
        if (!date) newErrors.dateOfBirth = true
        if (rawCpf.length < 11) newErrors.cpf = true
        if (rawPhone.length < 10) newErrors.phoneNumber = true

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Verifique os campos destacados.")
            return
        }

        try {
            setIsUploading(true)

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

            const data: UpdatePatientData & { attachmentIds?: string[] } = {
                id: patient.id,
                firstName,
                lastName,
                email: email || undefined,
                password: password || undefined,
                phoneNumber: rawPhone,
                profileImageUrl: previewImage || undefined,
                dateOfBirth: date!,
                cpf: rawCpf,
                gender: gender as any,
                attachmentIds,
            }

            await updatePatientFn(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl">
            <DialogHeader>
                <DialogTitle>Editar Paciente</DialogTitle>
                <DialogDescription>
                    Atualize as informações do prontuário de {patient.firstName}.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
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
                    <span className="text-xs text-muted-foreground">Clique para alterar foto</span>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="border-t my-2" />

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className={cn(errors.firstName && "text-red-500")}>Nome *</Label>
                            <Input id="firstName" name="firstName" defaultValue={patient.firstName} className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className={cn(errors.lastName && "text-red-500")}>Sobrenome *</Label>
                            <Input id="lastName" name="lastName" defaultValue={patient.lastName} className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cpf" className={cn(errors.cpf && "text-red-500")}>CPF *</Label>
                            <Input id="cpf" name="cpf" maxLength={14} value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} className={cn(errors.cpf && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label className={cn(errors.dateOfBirth && "text-red-500")}>Data de Nascimento *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", errors.dateOfBirth && "border-red-500 text-red-500")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : <span>Selecione</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        selected={date}
                                        onSelect={setDate}
                                        locale={ptBR}
                                        fromYear={1900}
                                        toYear={new Date().getFullYear()}
                                        classNames={{ caption_dropdowns: "flex gap-2" }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2 border-t">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">Contato e Acesso</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className={cn(errors.phoneNumber && "text-red-500")}>Telefone *</Label>
                            <Input id="phoneNumber" name="phoneNumber" maxLength={15} value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} className={cn(errors.phoneNumber && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Gênero</Label>
                            <Select value={gender} onValueChange={(val) => setGender(val as any)}>
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
                            <Input id="email" name="email" type="email" defaultValue={patient.email} className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="password" className={cn(errors.password && "text-red-500")}>Senha (Opcional)</Label>
                            <div className="relative">
                                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Deixe em branco para manter a atual" className={cn("pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")} />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SEÇÃO DE DOCUMENTOS ATUAIS (JÁ SALVOS) --- */}
                <div className="pt-2 border-t">
                    <Label className="mb-2 block font-medium">Documentos no Prontuário</Label>
                    <FieldSet>
                        {isLoadingAttachments ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : existingAttachments?.length === 0 ? (
                            <Empty className="border border-dashed py-6 mt-1">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <FileText className="h-8 w-8 text-muted-foreground/40" />
                                    </EmptyMedia>
                                    <EmptyTitle className="text-base font-medium">Nenhum documento salvo</EmptyTitle>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <div className="space-y-2 border rounded-md p-2 mt-1 max-h-48 overflow-y-auto bg-blue-50/10">
                                {existingAttachments?.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-2 bg-background rounded-md border text-sm transition-all hover:border-blue-200">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0 text-blue-600">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium truncate">{file.filename}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    Salvo em {format(new Date(file.uploadedAt), "dd/MM/yyyy")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                type="button"
                                                className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                onClick={() => handleDownload(file.url, file.filename)}
                                                title="Baixar arquivo"
                                            >
                                                <ArrowDownToLine className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                type="button"
                                                className="cursor-pointer h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                onClick={() => handleRemoveExistingFile(file.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </FieldSet>
                </div>

                <DocumentUploadSection selectedFiles={selectedFiles} onFilesChange={handleFilesChange} />

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isPending || isUploading} className="cursor-pointer gap-2 w-full lg:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                        {(isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending || isUploading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}