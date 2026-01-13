"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { SignInForm } from "./components/sign-in-form"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/axios"

export function SignIn() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuthentication() {
      try {
        await api.get('/psychologist/me')
          .then(() => navigate('/dashboard'))
          .catch(() => setIsChecking(false))

        if (isMounted) {
          navigate('/dashboard', { replace: true })
        }
      } catch (error) {
        console.error('Erro capturado:', error)
        if (isMounted) {
          setIsChecking(false)
        }
      } finally {
        if (isMounted) {
          setTimeout(() => setIsChecking(false), 1000)
        }
      }
    }

    checkAuthentication()

    return () => {
      isMounted = false
    }
  }, [navigate])

  if (isChecking) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    )
  }

  return (
    <>
      <Helmet title="Entrar no MindFlush" />
      <div className="flex min-h-svh justify-center p-4 sm:p-8">
        <Button
          variant={"link"}
          asChild
          className="absolute right-4 top-4 sm:right-8 sm:top-8 cursor-pointer"
        >
          <Link to="/sign-up">Criar Conta</Link>
        </Button>

        <div className="flex w-full max-w-[450px] flex-col justify-center gap-6 pt-16">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bem-vindo(a) ao <span className="text-blue-700">MindFlush</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Faça login para acessar seu painel e acompanhar seus pacientes com
              mais clareza e conexão.
            </p>
          </div>

          <SignInForm />
        </div>
      </div>
    </>
  )
}