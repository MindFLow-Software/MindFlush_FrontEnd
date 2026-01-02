"use client"

import * as React from "react"
import {
  BrainCircuit,
  Clock,
  GalleryVerticalEnd,
  Home,
  Users2,
  Wallet,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getProfile, type GetProfileResponse } from "@/api/get-profile"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile, isLoading } = useQuery<GetProfileResponse | null>({
    queryKey: ["psychologist-profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos para performance
  })

  const projects = [
    { name: "Pomodoro", url: "#", icon: Clock },
    {
      name: "ChatBot MindFLush",
      url: "https://cdn.botpress.cloud/webchat/v3.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/11/24/22/20251124224302-TGJFOW69.json",
      icon: BrainCircuit,
    },
  ]

  const filteredNavMain = React.useMemo(() => {
    const baseNav = [
      {
        title: "Home",
        url: "#",
        icon: Home,
        items: [{ title: "Dashboard", url: "/dashboard" }],
      },
      {
        title: "Pacientes",
        url: "#",
        icon: Users2,
        items: [
          { title: "Cadastro de Pacientes", url: "/patients-list" },
          { title: "Docs de Pacientes", url: "/patients-list" },
        ],
      },
      {
        title: "Agendamentos",
        url: "#",
        icon: CalendarCheck,
        items: [
          { title: "Meus Agendamentos", url: "/appointment" },
          { title: "Horários de Atendimento", url: "/availability" },
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

    const userRole = (profile?.role as string)?.toUpperCase()

    if (userRole === "SUPER_ADMIN") {
      baseNav.push({
        title: "Administração",
        url: "#",
        icon: ShieldCheck,
        items: [
          { title: "Aprovações Pendentes", url: "/approvals" },
        ],
      })
    }

    return baseNav
  }, [profile])

  const teams = React.useMemo(() => {
    const baseProfile = profile || { firstName: "...", lastName: "...", email: "..." }
    const isRoot = (profile?.role as string)?.toUpperCase() === "SUPER_ADMIN"

    return [
      {
        name: "Clínica MindFlow",
        firstName: baseProfile.firstName,
        lastName: baseProfile.lastName,
        logo: GalleryVerticalEnd,
        plan: isRoot ? "Acesso Root" : "Plano Enterprise",
      },
    ]
  }, [profile])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} isLoading={isLoading} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}