import { Helmet } from "react-helmet-async" // Importação necessária
import { Link } from "react-router-dom"
import { SignUpForm } from "./components/sign-up-form"
import { Button } from "@/components/ui/button" // Importação necessária

export function SignUp() {
  return (
    <>
      <Helmet title="Criar conta | MindFlush" />

      {/* 1. Layout de página padronizado (igual ao SignIn) */}
      <div className="flex min-h-svh justify-center p-4 sm:p-8">
        {/* 2. Botão flutuante padronizado (agora leva para /sign-in) */}
        <Button
          variant={"link"}
          asChild
          className="absolute right-4 top-4 sm:right-8 sm:top-8"
        >
          <Link to="/">Fazer Login</Link>
        </Button>

        {/* 3. Wrapper de conteúdo padronizado (max-w-[450px] e pt-16) */}
        <div className="flex w-full max-w-[450px] flex-col justify-center gap-6 pt-16">
          {/* 4. Cabeçalho de texto (específico do SignUp) */}
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Crie sua conta no MindFlush
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cadastre seu e-mail profissional para começar a usar a plataforma.
            </p>
          </div>

          <SignUpForm />
        </div>
      </div>
    </>
  )
}