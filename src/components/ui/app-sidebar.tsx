"use client"

import * as React from "react"
import {
    BrainCircuit,
    Clock,
    GalleryVerticalEnd,
    Home,
    Map,
    Users2,
    Wallet,
    CalendarCheck,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "./sidebar"
import { useQuery } from "@tanstack/react-query"
import { getProfile, type GetProfileResponse } from "@/api/get-profile"

const navMain = [
    {
        title: "Home",
        url: "#",
        icon: Home,
        items: [
            { title: "Dashboard", url: "/dashboard" },
        ],
    },
    {
        title: "Pacientes",
        url: "#",
        icon: Users2,
        items: [
            { title: "Cadastro de Pacientes", url: "/patients-list" },
            { title: "Documentos de Pacientes", url: "/patients-list" },
        ],
    },
    {
        title: "Agendamentos",
        url: "#",
        icon: CalendarCheck,
        items: [
            { title: "Meus Agendamentos", url: "/appointment" },
            { title: "Sala de Atendimento", url: "/video-room" },
            { title: "Histórico de Sessões", url: "#" },
        ],
    },
    {
        title: "Financeiro",
        url: "#",
        icon: Wallet,
        items: [
            { title: "Pagamentos", url: "/dashboard-finance" },
            { title: "Cobrança", url: "#" },
            { title: "Cupons", url: "#" },
            { title: "Saques", url: "#" },
        ],
    },
]

const projects = [
    { name: "Pomodoro", url: "#", icon: Clock },
    {
        name: "ChatBot MindFLush",
        url: "https://cdn.botpress.cloud/webchat/v3.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/10/13/22/20251013223819-5VEK1PGJ.json",
        icon: BrainCircuit,
    },
    { name: "Travel", url: "#", icon: Map },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    
    const { data: profile, isLoading } = useQuery<GetProfileResponse | null>({
        queryKey: ["psychologist-profile"],
        queryFn: getProfile,
        retry: false,
    })

    const teams = React.useMemo(() => {
        const baseProfile = profile || { firstName: "...", lastName: "...", email: "..." };

        return [
            {
                name: "Clínica MindFlow", 
                firstName: baseProfile.firstName,
                lastName: baseProfile.lastName,
                logo: GalleryVerticalEnd,
                plan: "Plano Enterprise",
            },
        ]
    }, [profile])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} isLoading={isLoading} />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navMain} />
                <NavProjects projects={projects} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}