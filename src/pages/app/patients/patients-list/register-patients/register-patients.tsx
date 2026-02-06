"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, isValid, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, CalendarIcon, Venus, Mars, Users, ShieldCheck, Contact, UserRoundCheck } from "lucide-react"
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
import { updatePatients } from "@/api/upadate-patient"
import { cn } from "@/lib/utils"

import { UploadZone } from "./upload-zone"
import { PatientAvatarUpload } from "./patient-avatar-upload"
import { AttachmentsList } from "./attachments-list"
import { uploadAttachment } from "@/api/attachments"

function isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, "")
    if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false
    let sum = 0, remainder
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false
    sum = 0
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false
    return true
}

const patientSchema = z.object({
    firstName: z.string()
        .min(1, "Obrigatório")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Apenas letras são permitidas"),
    lastName: z.string()
        .min(1, "Obrigatório")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Apenas letras são permitidas"),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.date()
        .nullable()
        .optional()
        .refine((date) => !date || date <= new Date(), {
            message: "Data de nascimento inválida",
        }),
    cpf: z.string().optional().or(z.literal("")).refine((val) => {
        if (!val) return true
        return isValidCPF(val)
    }, {
        message: "CPF inválido",
    }),
    gender: z.enum(["FEMININE", "MASCULINE", "OTHER"]),
})

type PatientFormData = z.infer<typeof patientSchema>

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
    <Input ref={inputRef} {...props} />
))

interface RegisterPatientsProps {
    patient?: any
    onSuccess?: () => void
}

export function RegisterPatients({ patient, onSuccess }: RegisterPatientsProps) {
    const isEditMode = !!patient
    const queryClient = useQueryClient()
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            firstName: patient?.firstName ?? "",
            lastName: patient?.lastName ?? "",
            phoneNumber: patient?.phoneNumber ?? "",
            cpf: patient?.cpf ?? "",
            gender: patient?.gender ?? "FEMININE",
            dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth) : null,
        }
    })

    const { mutateAsync: savePatientFn, isPending } = useMutation({
        mutationFn: (data: any) => isEditMode ? updatePatients(data) : registerPatients(data),
        onError: (err) => {
            let errorMessage = "Erro ao processar solicitação."
            if (err instanceof AxiosError && err.response) {
                errorMessage = err.response.data?.message || "Erro na comunicação com o servidor."
            }
            toast.error(errorMessage)
        }
    })

    async function onSubmit(data: PatientFormData) {
        try {
            setIsUploading(true)

            const patientResponse = await savePatientFn({
                ...data,
                id: patient?.id,
                phoneNumber: data.phoneNumber ? data.phoneNumber.replace(/\D/g, "") : undefined,
                dateOfBirth: data.dateOfBirth || undefined,
                cpf: data.cpf ? data.cpf.replace(/\D/g, "") : undefined,
                gender: data.gender as any,
                role: "PATIENT" as any,
                isActive: true,
                expertise: "OTHER" as any,
            })

            const targetId = isEditMode ? patient.id : (patientResponse.id || patientResponse.patientId)

            if (avatarFile && targetId) {
                await uploadAttachment(avatarFile, targetId)
            }

            if (selectedFiles.length > 0 && targetId) {
                await Promise.all(
                    selectedFiles.map((file) => uploadAttachment(file, targetId))
                )
            }

            await queryClient.invalidateQueries({ queryKey: ["patients"] })

            if (targetId) {
                await queryClient.invalidateQueries({ queryKey: ["patient", targetId] })
                await queryClient.invalidateQueries({ queryKey: ["attachments", targetId] })
            }

            toast.success(isEditMode ? "Prontuário atualizado!" : "Paciente cadastrado com sucesso!")
            onSuccess?.()

            if (!isEditMode) {
                reset()
                setAvatarFile(null)
                setSelectedFiles([])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto sm:rounded-xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                    {isEditMode ? "Editar Prontuário" : "Novo Prontuário"}
                </DialogTitle>
                <DialogDescription>
                    {isEditMode
                        ? `Atualize as informações do prontuário de ${patient.firstName}.`
                        : "Inicie o acompanhamento apenas com o nome. Você pode completar os demais dados depois…"
                    }
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                    <section aria-label="Foto de perfil" className="shrink-0">
                        <PatientAvatarUpload
                            onFileSelect={setAvatarFile}
                            defaultValue={patient?.profileImageUrl}
                        />
                    </section>

                    <fieldset className="flex-1 w-full space-y-4">
                        <legend className="text-sm font-semibold text-foreground flex items-center gap-2 px-1 mb-2">
                            <Contact className="size-4 text-blue-500" aria-hidden="true" />
                            Dados Principais
                        </legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className={cn(errors.firstName && "text-red-500")}>Nome *</Label>
                                <Input
                                    id="firstName"
                                    {...register("firstName")}
                                    placeholder="Ex: Ana…"
                                    autoComplete="given-name"
                                    className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
                                />
                                {errors.firstName && <p role="alert" className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className={cn(errors.lastName && "text-red-500")}>Sobrenome *</Label>
                                <Input
                                    id="lastName"
                                    {...register("lastName")}
                                    placeholder="Ex: Silva…"
                                    autoComplete="family-name"
                                    className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")}
                                />
                                {errors.lastName && <p role="alert" className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.lastName.message}</p>}
                            </div>
                        </div>
                    </fieldset>
                </div>

                <fieldset className="space-y-4">
                    <legend className="text-sm font-semibold text-foreground flex items-center gap-2 pt-2 border-t w-full">
                        <ShieldCheck className="size-4 text-blue-500" aria-hidden="true" />
                        Informações Complementares
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf" className={cn(errors.cpf && "text-red-500")}>CPF</Label>
                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field: { ref, onChange, value, ...f } }) => (
                                    <MaskedInput
                                        {...f}
                                        id="cpf"
                                        inputRef={ref}
                                        value={value}
                                        onAccept={(v: string) => onChange(v)}
                                        mask="000.000.000-00"
                                        placeholder="000.000.000-00"
                                        spellCheck={false}
                                        className={cn("tabular-nums", errors.cpf && "border-red-500 focus-visible:ring-red-500")}
                                    />
                                )}
                            />
                            {errors.cpf && <p role="alert" className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.cpf.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Celular</Label>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field: { ref, onChange, value, ...f } }) => (
                                    <MaskedInput
                                        {...f}
                                        id="phoneNumber"
                                        inputRef={ref}
                                        value={value}
                                        onAccept={(v: string) => onChange(v)}
                                        mask="(00) 00000-0000"
                                        placeholder="(00) 00000-0000"
                                        type="tel"
                                        autoComplete="tel"
                                        className="tabular-nums"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth" className={cn(errors.dateOfBirth && "text-red-500")}>Nascimento</Label>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({ field }) => {
                                    const [inputValue, setInputValue] = useState(field.value ? format(field.value, "dd/MM/yyyy") : "")
                                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                        let val = e.target.value.replace(/\D/g, "")
                                        if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2)
                                        if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 10)
                                        setInputValue(val)
                                        if (val.length === 10) {
                                            const parsedDate = parse(val, "dd/MM/yyyy", new Date())
                                            if (isValid(parsedDate)) field.onChange(parsedDate)
                                            else field.onChange(null)
                                        } else if (val.length === 0) field.onChange(null)
                                    }

                                    return (
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <div className="relative w-full">
                                                <Input
                                                    id="dateOfBirth"
                                                    placeholder="DD/MM/AAAA"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    maxLength={10}
                                                    autoComplete="off"
                                                    spellCheck={false}
                                                    className={cn("pr-10 tabular-nums", errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        aria-label="Abrir calendário"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer text-muted-foreground flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-500 outline-none rounded-r-md"
                                                    >
                                                        <CalendarIcon className="size-4" aria-hidden="true" />
                                                    </button>
                                                </PopoverTrigger>
                                            </div>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="center" sideOffset={8}>
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    captionLayout="dropdown"
                                                    fromYear={1900}
                                                    toYear={new Date().getFullYear()}
                                                    disabled={(date) => date > new Date()}
                                                    onSelect={(date) => {
                                                        field.onChange(date)
                                                        if (date) setInputValue(format(date, "dd/MM/yyyy"))
                                                        setCalendarOpen(false)
                                                    }}
                                                    locale={ptBR}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )
                                }}
                            />
                            {errors.dateOfBirth && <p role="alert" className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.dateOfBirth.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Gênero</Label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FEMININE" className="cursor-pointer">
                                                <div className="flex items-center gap-2"><Venus className="h-4 w-4 text-rose-500" aria-hidden="true" /> Feminino</div>
                                            </SelectItem>
                                            <SelectItem value="MASCULINE" className="cursor-pointer">
                                                <div className="flex items-center gap-2"><Mars className="h-4 w-4 text-blue-500" aria-hidden="true" /> Masculino</div>
                                            </SelectItem>
                                            <SelectItem value="OTHER" className="cursor-pointer">
                                                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" aria-hidden="true" /> Outro</div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {isEditMode && (
                            <div className="bg-muted/30 rounded-lg p-2 border border-dashed h-full">
                                <AttachmentsList patientId={patient.id} />
                            </div>
                        )}
                        <div>
                            <UploadZone
                                selectedFiles={selectedFiles}
                                onFilesChange={setSelectedFiles}
                            />
                        </div>
                    </div>
                </fieldset>

                <div className="flex justify-end pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isPending || isUploading}
                        className="cursor-pointer gap-2 w-full lg:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                    >
                        <UserRoundCheck className="h-4 w-4" />
                        {(isPending || isUploading) && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                        <span aria-live="polite">
                            {isPending || isUploading ? "Salvando…" : (isEditMode ? "Salvar Alterações" : "Cadastrar Paciente")}
                        </span>
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}