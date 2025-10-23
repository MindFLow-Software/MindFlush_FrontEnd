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
import { Skeleton } from "@/components/ui/skeleton"

type User = {
    name: string
    email: string
    avatar?: string
}

async function GetProfile(): Promise<User> {
    const response = await api.get("/session/profile") // ⚡ endpoint do usuário autenticado
    return response.data
}

export function NavUser() {
    const { isMobile } = useSidebar()

    const { data: user, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: GetProfile,
        retry: false,
    })

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            disabled={isLoading}
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {isLoading ? (
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                ) : user?.avatar ? (
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                ) : (
                                    <AvatarFallback className="rounded-lg">
                                        {user?.name?.[0] || "?"}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </>
                                ) : (
                                    <>
                                        <span className="truncate font-medium">{user?.name}</span>
                                        <span className="truncate text-xs">{user?.email}</span>
                                    </>
                                )}
                            </div>

                            {!isLoading && <ChevronsUpDown className="ml-auto size-4" />}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    {!isLoading && (
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {user?.avatar ? (
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                        ) : (
                                            <AvatarFallback className="rounded-lg">
                                                {user?.name?.[0] || "?"}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user?.name}</span>
                                        <span className="truncate text-xs">{user?.email}</span>
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
                    )}
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
