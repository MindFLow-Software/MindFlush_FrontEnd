import { api } from '@/lib/axios'

export interface SignInBody {
     email: string
     password: string
}

export async function signIn({ email, password }: SignInBody) {
     const response = await api.post('/session', { email, password })
     const { access_token } = response.data

     localStorage.setItem('token', access_token)

     api.defaults.headers.common.Authorization = `Bearer ${access_token}`

     return response.data
}
