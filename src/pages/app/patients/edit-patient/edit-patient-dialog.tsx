"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2, Eye, EyeOff, Venus, Mars, Users } from "lucide-react"
import { toast } from "sonner"
import { IMaskMixin } from "react-imask"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { updatePatient, type UpdatePatientData } from "@/api/upadate-patient"
import { api } from "@/lib/axios"
import { cn } from "@/lib/utils"
import { AttachmentsList } from "./attachments-list"
import { UploadZone } from "./upload-zone"
import { PatientAvatarUpload } from "./patient-avatar-upload"

interface FormErrors {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    dateOfBirth?: boolean
    cpf?: boolean
    phoneNumber?: boolean
}

interface EditPatientProps {
    patient: UpdatePatientData
    onClose?: () => void
}

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
    <Input ref={inputRef} {...props} />
))

export function EditPatient({ patient, onClose }: EditPatientProps) {
    const queryClient = useQueryClient()
    const [date, setDate] = useState<Date | undefined>(patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined)
    const [cpf, setCpf] = useState(patient.cpf ? formatCPF(patient.cpf) : "")
    const [phone, setPhone] = useState(patient.phoneNumber ? formatPhone(patient.phoneNumber) : "")
    const [gender, setGender] = useState(patient.gender || "FEMININE")
    const [showPassword, setShowPassword] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [errors, setErrors] = useState<FormErrors>({})
    const [isUploading, setIsUploading] = useState(false)

    const { mutateAsync: updatePatientFn, isPending } = useMutation({
        mutationFn: updatePatient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
            queryClient.invalidateQueries({ queryKey: ["attachments", patient.id] })
            toast.success("Dados atualizados com sucesso!")
            onClose?.()
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Erro ao atualizar paciente."),
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const rawCpf = cpf.replace(/\D/g, "")
        const rawPhone = phone.replace(/\D/g, "")

        const newErrors: FormErrors = {}
        if (!fd.get("firstName")) newErrors.firstName = true
        if (!fd.get("lastName")) newErrors.lastName = true
        if (!date) newErrors.dateOfBirth = true
        if (rawCpf.length < 11) newErrors.cpf = true
        if (rawPhone.length < 10) newErrors.phoneNumber = true

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return toast.error("Verifique os campos obrigatórios.")
        }

        try {
            setIsUploading(true)
            let profileImageUrl = patient.profileImageUrl
            if (avatarFile) {
                const avatarData = new FormData()
                avatarData.append('file', avatarFile)
                const res = await api.post<{ url: string }>("/attachments", avatarData)
                profileImageUrl = res.data.url
            }

            const attachmentIds = selectedFiles.length > 0
                ? await Promise.all(selectedFiles.map(async (file) => {
                    const data = new FormData()
                    data.append('file', file)
                    const res = await api.post<{ attachmentId: string }>("/attachments", data)
                    return res.data.attachmentId
                }))
                : []

            await updatePatientFn({
                id: patient.id,
                firstName: fd.get("firstName") as string,
                lastName: fd.get("lastName") as string,
                email: (fd.get("email") as string) || undefined,
                password: (fd.get("password") as string) || undefined,
                phoneNumber: rawPhone,
                profileImageUrl,
                dateOfBirth: date!,
                cpf: rawCpf,
                gender: gender as any,
                attachmentIds,
            })
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
                <DialogDescription>Atualize as informações do prontuário de {patient.firstName}.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                <PatientAvatarUpload defaultValue={patient.profileImageUrl} onFileSelect={setAvatarFile} />
                <div className="border-t border-muted/40 my-2" />

                <div className="space-y-4">
                    <h3 className="text-[13px] font-bold uppercase tracking-wide text-foreground/70 px-1">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className={cn(errors.firstName && "text-red-500")}>Nome *</Label>
                            <Input id="firstName" name="firstName" defaultValue={patient.firstName} className={cn(errors.firstName && "border-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className={cn(errors.lastName && "text-red-500")}>Sobrenome *</Label>
                            <Input id="lastName" name="lastName" defaultValue={patient.lastName} className={cn(errors.lastName && "border-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cpf" className={cn(errors.cpf && "text-red-500")}>CPF *</Label>
                            <MaskedInput
                                id="cpf"
                                name="cpf"
                                mask="000.000.000-00"
                                value={cpf}
                                onAccept={(val: string) => setCpf(val)}
                                className={cn(errors.cpf && "border-red-500")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={cn(errors.dateOfBirth && "text-red-500")}>Data de Nascimento *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", errors.dateOfBirth && "border-red-500")}>
                                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                        {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : <span>Selecione</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" captionLayout="dropdown" selected={date} onSelect={setDate} locale={ptBR} fromYear={1900} toYear={new Date().getFullYear()} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-muted/40">
                    <h3 className="text-[13px] font-bold uppercase tracking-wide text-foreground/70 px-1">Contato e Acesso</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className={cn(errors.phoneNumber && "text-red-500")}>Telefone *</Label>
                            <MaskedInput
                                id="phoneNumber"
                                name="phoneNumber"
                                mask="(00) 00000-0000"
                                value={phone}
                                onAccept={(val: string) => setPhone(val)}
                                className={cn(errors.phoneNumber && "border-red-500")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Gênero</Label>
                            <Select value={gender} onValueChange={(val) => setGender(val as any)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FEMININE"><div className="flex items-center gap-2"><Venus className="h-4 w-4 text-rose-500" /> Feminino</div></SelectItem>
                                    <SelectItem value="MASCULINE"><div className="flex items-center gap-2"><Mars className="h-4 w-4 text-blue-500" /> Masculino</div></SelectItem>
                                    <SelectItem value="OTHER"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" /> Outro</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email" className={cn(errors.email && "text-red-500")}>Email *</Label>
                            <Input id="email" name="email" type="email" defaultValue={patient.email} className={cn(errors.email && "border-red-500")} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="password">Senha (Opcional)</Label>
                            <div className="relative">
                                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Manter atual" className="pr-10" />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground/60" /> : <Eye className="h-4 w-4 text-muted-foreground/60" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2"><AttachmentsList patientId={patient.id} /></div>
                <UploadZone selectedFiles={selectedFiles} onFilesChange={setSelectedFiles} />

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isPending || isUploading} className="cursor-pointer w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                        {(isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending || isUploading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}