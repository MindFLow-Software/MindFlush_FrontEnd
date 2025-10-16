import { BrainIcon } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
    return (
        <div className="grid min-h-screen grid-cols-2 antialiased">
            <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
                <div className="flex items-center gap-3 text-lg text-foreground">
                    <BrainIcon className="h-7 w-7 text-blue-600" />
                    <span className="font-semibold">MindFlush</span>
                </div>

                <footer className="text-sm">
                    Painel central &copy; MindFLush - {new Date().getFullYear()}
                </footer>
            </div>

            <div className="flex flex-col items-center justify-center relative">
                <Outlet />
            </div>
        </div>
    )
}