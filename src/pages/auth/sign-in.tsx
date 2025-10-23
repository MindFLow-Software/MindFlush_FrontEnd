import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/api/sign-in'

const signInSchema = z.object({
    email: z.string().email({ message: 'E-mail inválido' }),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignIn() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: searchParams.get('email') ?? '',
            password: '',
        },
    })

    const { mutateAsync: authenticate } = useMutation({
        mutationFn: signIn,
    })

    async function handleSignIn(data: SignInSchema) {
        try {
            const response = await authenticate(data)

            localStorage.setItem('token', response.jwt)
            toast.success('Login realizado com sucesso! 👋', { duration: 4000 })

            navigate('/dashboard')
        } catch (error: any) {
            console.error('❌ Erro no login:', error)

            if (error?.response?.status === 401) {
                toast.error('Credenciais inválidas. Verifique e tente novamente.')
            } else if (error?.response?.status === 500) {
                toast.error('Erro no servidor. Tente novamente mais tarde.')
            } else {
                toast.error('Ocorreu um erro inesperado. Tente novamente.')
            }
        }
    }

    return (
        <>
            <Helmet title="Entrar no MindFlush" />
            <div className="p-4 sm:p-8">
                <Button variant={"link"} asChild className="absolute right-4 top-4 sm:right-8 sm:top-8">


                    <Link to="/sign-up">Criar Conta</Link>
                </Button>

                <div className="flex w-[360px] flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Bem-vindo(a) ao <span className="text-blue-700">MindFlush</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Faça login para acessar seu painel e acompanhar seus pacientes com mais
                            clareza e conexão.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail profissional</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="exemplo@mindflush.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="exemploMindflush123"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            type="submit"
                        >
                            {isSubmitting ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}
