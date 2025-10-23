"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

type User = {
    name: string
    email: string
    avatar?: string
}

async function GetProfile(): Promise<User> {
    const response = await api.get("/session/profile") // ⚡ endpoint que retorna o usuário autenticado
    return response.data
}

export function NavUser() {
    const { isMobile } = useSidebar()

    const { data: user, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: GetProfile,
        retry: false,
    })

    if (isLoading || !user) {
        // fallback simples enquanto carrega
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" disabled>
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback className="rounded-lg">--</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">Carregando...</span>
                            <span className="truncate text-xs">...</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {user.avatar ? (
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                ) : (
                                    <AvatarFallback className="rounded-lg">
                                        {user.name[0]}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {user.avatar ? (
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                    ) : (
                                        <AvatarFallback className="rounded-lg">
                                            {user.name[0]}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Planos
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Conta
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Pagamentos
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notificações
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="text-red-500" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
