"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { Brain } from "@phosphor-icons/react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

interface TeamSwitcherTeam {
    name: string
    firstName: string
    lastName: string
    logo: React.ElementType
    plan: string
}

interface TeamSwitcherProps {
    teams: TeamSwitcherTeam[]
    isLoading: boolean
}

export function TeamSwitcher({ teams, isLoading }: TeamSwitcherProps) {
    const { isMobile } = useSidebar()
    // 1. Inicializa o estado com o primeiro item (o placeholder)
    const [activeTeam, setActiveTeam] = React.useState(teams[0]) 
    
    // 2. 🔑 SINCRONIZAÇÃO: Atualiza o time ativo quando o prop 'teams' muda.
    React.useEffect(() => {
        if (teams && teams.length > 0) {
            setActiveTeam(teams[0])
        }
    }, [teams]) 

    if (!activeTeam) {
        return null
    }

    if (isLoading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <Skeleton className="w-full h-14 rounded-xl" />
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    const fullName = `${activeTeam.firstName} ${activeTeam.lastName}`

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Brain size={32} className="text-blue-500" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{fullName}</span>
                                <span className="truncate text-xs">{activeTeam.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Equipes
                        </DropdownMenuLabel>
                        {teams.map((team, index) => (
                            <DropdownMenuItem
                                key={team.name}
                                onClick={() => setActiveTeam(team)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <team.logo className="size-3.5 shrink-0" />
                                </div>
                                {team.firstName} {team.lastName}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="text-muted-foreground font-medium">Adicionar equipe</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}