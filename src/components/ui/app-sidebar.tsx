"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    BrainCircuit,
    Clock,
    Command,
    GalleryVerticalEnd,
    Home,
    Map,
    Settings2,
    Users2,
    Wallet,
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

const teams = [
    {
        name: "MindFlush",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
    },
    {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
    },
    {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
    },
]

const navMain = [
    {
        title: "Home",
        url: "#",
        icon: Home,
        isActive: true,
        items: [
            { title: "Dashboard", url: "/" },
            { title: "Starred", url: "#" },
            { title: "Settings", url: "#" },
        ],
    },
    {
        title: "Pacientes",
        url: "#",
        icon: Users2,
        items: [
            { title: "Lista de Pacientes", url: "/patients-list" },
            { title: "Prontuários", url: "#" },
        ],
    },
    {
        title: "Consultas",
        url: "#",
        icon: BookOpen,
        items: [
            { title: "Agendar Consultas", url: "#" },
            { title: "Video Conferência", url: "#" },
            { title: "Histórico de Sessões", url: "#" },
        ],
    },
    {
        title: "Financeiro",
        url: "#",
        icon: Wallet,
        items: [
            { title: "Pagamentos", url: "#" },
            { title: "Planos e Assinaturas", url: "#" },
            { title: "Saques", url: "#" },
            { title: "Cobrança", url: "#" },
        ],
    },
    {
        title: "Configurações",
        url: "#",
        icon: Settings2,
        items: [
            { title: "Perfil", url: "#" },
            { title: "Dados", url: "#" },
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
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
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
