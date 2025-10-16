import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInForm = z.object({
    email: z.string().email(),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignInForm>()

    async function handleSignIn(data: SignInForm) {
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))

            toast.success('Enviamos um link de autenticação para seu e-mail.', {
                action: {
                    label: 'Reenviar',
                    onClick: () => {
                        handleSignIn(data)
                    },
                },
            })
        } catch (error) {
            toast.error('Credenciais inválidas.')
        }
    }

    return (
        <>
            <Helmet title="Entrar no MindFlush" />

            <div className="p-8">
                <div className="flex w-[350px] flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Bem-vindo(a) ao MindFlush
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Faça login para acessar seu painel e acompanhar seus pacientes com mais clareza e conexão.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail profissional</Label>
                            <Input id="email" type="email" {...register('email')} placeholder="exemplo@mindflush.com" />
                        </div>

                        <Button disabled={isSubmitting} className="w-full cursor-pointer hover:bg-blue-700" type="submit">
                            Entrar
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}
