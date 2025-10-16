import { Header } from '@/components/header'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
    return (
        <div className='flex min-h-screen flex-col antialiased'>
            <Header />

            <div className='flex flex-1 flex-col gap-4 p- pt-16'>
                <Outlet />
            </div>
        </div>
    )
}