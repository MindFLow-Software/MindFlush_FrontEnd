"use client"

import { useCallback, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { ChevronDownIcon, Eye, EyeOff } from "lucide-react"
import { IMaskMixin } from "react-imask"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { registerPsychologist } from "@/api/create-user"

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
  <Input ref={inputRef} {...props} />
))

export const signUpFormSchema = z.object({
  firstName: z.string().min(1, "Primeiro nome é obrigatório"),
  lastName: z.string().min(1, "Último nome é obrigatório"),
  phoneNumber: z.string().min(1, "Telefone é obrigatório").max(15),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  dateOfBirth: z.date({
    message: "Data de nascimento é obrigatória"
  }),
  cpf: z.string().min(11, "CPF inválido").max(14),
  gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], {
    message: "Selecione seu gênero",
  }),
  expertise: z.enum([
    "OTHER",
    "SOCIAL",
    "INFANT",
    "CLINICAL",
    "JURIDICAL",
    "PSYCHOTHERAPIST",
    "NEUROPSYCHOLOGY",
  ], {
    message: "Selecione sua especialidade",
  }),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  })

  const { mutateAsync: registerPsychologistFn } = useMutation({
    mutationFn: registerPsychologist,
  })

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  async function handleSignUp(data: SignUpFormData) {
    try {
      await registerPsychologistFn({
        ...data,
        phoneNumber: data.phoneNumber.replace(/\D/g, ""),
        cpf: data.cpf.replace(/\D/g, ""),
        role: "PSYCHOLOGIST"
      })

      toast.success("Psicólogo cadastrado com sucesso!")
      navigate("/sign-in")
    } catch {
      toast.error("Erro ao cadastrar psicólogo.")
    }
  }


  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">Primeiro Nome</FieldLabel>
            <Input id="firstName" {...register("firstName")} placeholder="Jon" />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Último Nome</FieldLabel>
            <Input id="lastName" {...register("lastName")} placeholder="Doe" />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">E-mail profissional</FieldLabel>
          <Input id="email" type="email" {...register("email")} placeholder="exemplo@mindflush.com" />
        </Field>

        <Field className="relative">
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="phoneNumber">Telefone</FieldLabel>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { ref, ...fieldProps } }) => (
                <MaskedInput
                  {...fieldProps}
                  inputRef={ref}
                  mask="(00) 00000-0000"
                  placeholder="(99) 99999-9999"
                  id="phoneNumber"
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="cpf">CPF</FieldLabel>
            <Controller
              control={control}
              name="cpf"
              render={({ field: { ref, ...fieldProps } }) => (
                <MaskedInput
                  {...fieldProps}
                  inputRef={ref}
                  mask="000.000.000-00"
                  placeholder="123.456.789-00"
                  id="cpf"
                />
              )}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Data de Nascimento</FieldLabel>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? field.value.toLocaleDateString("pt-BR")
                      : "Selecione a data"}
                    <ChevronDownIcon className="size-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    onSelect={(date) => {
                      field.onChange(date)
                      setCalendarOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Gênero</FieldLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASCULINE">Masculino</SelectItem>
                    <SelectItem value="FEMININE">Feminino</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Especialidade</FieldLabel>
            <Controller
              name="expertise"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLINICAL">Clínica</SelectItem>
                    <SelectItem value="INFANT">Infantil</SelectItem>
                    <SelectItem value="NEUROPSYCHOLOGY">Neuropsicologia</SelectItem>
                    <SelectItem value="PSYCHOTHERAPIST">Psicoterapeuta</SelectItem>
                    <SelectItem value="JURIDICAL">Jurídica</SelectItem>
                    <SelectItem value="SOCIAL">Social</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <Button disabled={isSubmitting} className="cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-medium w-full" type="submit">
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>

        <FieldDescription className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">termos de serviço</a> e{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">políticas de privacidade</a>.
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}