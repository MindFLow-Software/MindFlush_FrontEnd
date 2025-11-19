"use client"

import { Helmet } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator, // Importado do exemplo
} from "@/components/ui/field"
import { signIn } from "@/api/sign-in"

const signInSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type SignInSchema = z.infer<typeof signInSchema>

// Note que agora é "SignInForm" e não "SignIn"
export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(data: SignInSchema) {
    // ... sua lógica de login
    try {
      const response = await authenticate(data)
      localStorage.setItem("token", response.jwt)
      toast.success("Login realizado com sucesso!", { duration: 4000 })
      navigate("/dashboard")
    } catch (error: any) {
      console.error("❌ Erro no login:", error)
      if (error?.response?.status === 401) {
        toast.error("Credenciais inválidas. Verifique e tente novamente.")
      } else {
        toast.error("Ocorreu um erro inesperado. Tente novamente.")
      }
    }
  }

  return (
    <>
      <Helmet title="Entrar no MindFlush" />
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className={cn("flex flex-col gap-6", className)} // Padrão do exemplo
        {...props}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">E-mail profissional</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@mindflush.com"
              {...register("email")}
            />
            {errors.email && (
              <FieldDescription className="text-red-500">
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <a
                href="#" // Link de "Esqueci a senha"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <FieldDescription className="text-red-500">
                {errors.password.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </Field>
          
          <FieldSeparator>Ou</FieldSeparator>
          
          <Field>
            <FieldDescription className="text-center">
              Não tem uma conta?{" "}
              <Link
                to="/sign-up"
                className="font-semibold text-blue-700 underline-offset-4 hover:underline"
              >
                Criar conta
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </>
  )
}