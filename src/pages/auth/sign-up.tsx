import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'

const signUpForm = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignUpForm>()

    async function handleSignUp(data: SignUpForm) {
        try {

            console.log(data)

            await new Promise((resolve) => setTimeout(resolve, 2000))

            toast.success('Enviamos um link de confirmação para seu e-mail.', {
                action: {
                    label: 'Login',
                    onClick: () => {
                        navigate('/sign-in')
                    },
                },
            })
        } catch (error) {
            toast.error('Erro ao criar conta. Tente novamente.')
        }
    }

    return (
        <>
            <Helmet title="Criar conta | MindFlush" />

            <div className="p-8">
                <Button variant={'link'} asChild className='absolute right-8 top-8'>
                    <Link to="/sign-in">
                        Fazer Login
                    </Link>
                </Button>

                <div className="flex w-[350px] flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Crie sua conta no MindFlush
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Cadastre seu e-mail profissional para começar a usar a plataforma e
                            oferecer uma experiência terapêutica mais conectada.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail profissional</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="exemplo@mindflush.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do profissional</Label>
                            <Input id="name" type="name" {...register('name')} placeholder="Jon Doe Exemplo" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" {...register('password')} placeholder="exemploMindflush123" />
                        </div>

                        <Button
                            disabled={isSubmitting}
                            className="w-full cursor-pointer hover:bg-blue-700"
                            type="submit"
                        >
                            Criar conta
                        </Button>

                        <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                            Ao continuar, você concorda com nossos{' '}
                            <a href="" className="underline underline-offset-4">
                                termos de serviço
                            </a>{' '}
                            e{' '}
                            <a href="" className="underline underline-offset-4">
                                políticas de privacidade
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
