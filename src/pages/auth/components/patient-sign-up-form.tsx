"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Mail, Lock, User, Phone, Calendar, Fingerprint, Eye, EyeOff } from "lucide-react"
import { useState, useCallback } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/axios"

const patientSignUpSchema = z.object({
    firstName: z.string().min(2, "Nome é obrigatório"),
    lastName: z.string().min(2, "Sobrenome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    phoneNumber: z.string().min(10, "Telefone inválido"),
    cpf: z.string().min(11, "CPF inválido"),
    dateOfBirth: z.string().min(10, "Data de nascimento é obrigatória"),
    gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], {
        message: "Selecione seu gênero",
    }),
})

type PatientSignUpSchema = z.infer<typeof patientSignUpSchema>

export function PatientSignUpForm({ className, ...props }: React.ComponentProps<"form">) {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<PatientSignUpSchema>({
        resolver: zodResolver(patientSignUpSchema),
    })

    const { mutateAsync: registerPatient } = useMutation({
        mutationFn: async (data: PatientSignUpSchema) => {
            await api.post("/patients/public", data)
        },
    })

    const handleSignUp = useCallback(
        async (data: PatientSignUpSchema) => {
            try {
                await registerPatient(data)
                toast.success("Cadastro realizado! Agora você pode fazer login.")
                navigate("/sign-in")
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || "Erro ao criar conta."
                toast.error(errorMessage)
            }
        },
        [registerPatient, navigate],
    )

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    return (
        <form onSubmit={handleSubmit(handleSignUp)} className={cn("flex flex-col gap-4", className)} {...props}>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input id="firstName" className="pl-10" {...register("firstName")} />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" {...register("lastName")} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input id="email" type="email" className="pl-10" {...register("email")} />
                </div>
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Criar Senha</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">WhatsApp/Celular</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input id="phoneNumber" className="pl-10" {...register("phoneNumber")} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <div className="relative">
                        <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input id="cpf" className="pl-10" {...register("cpf")} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Nascimento</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input id="dateOfBirth" type="date" className="pl-10" {...register("dateOfBirth")} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Gênero</Label>
                    <Select onValueChange={(value) => setValue("gender", value as any)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MALE">Masculino</SelectItem>
                            <SelectItem value="FEMALE">Feminino</SelectItem>
                            <SelectItem value="OTHER">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
                </div>
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 mt-2 cursor-pointer">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Finalizar Cadastro"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
                Já tem uma conta?{" "}
                <Link to="/sign-in" className="text-blue-600 font-semibold hover:underline">
                    Fazer Login
                </Link>
            </p>
        </form>
    )
}