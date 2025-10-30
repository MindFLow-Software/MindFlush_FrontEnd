import { env } from '@/env'
import axios from 'axios'

export const api = axios.create({
    baseURL: env.VITE_API_URL,
    withCredentials: false
})

api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 700))

    const token = localStorage.getItem('mindflush:token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})