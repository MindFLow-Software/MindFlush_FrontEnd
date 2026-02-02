"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Home,
  Users2,
  Wallet,
  CalendarCheck,
  ShieldCheck,
  HeartPlus,
  Inbox,
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
import { NavUser } from "./nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile, isLoading } = useQuery<GetProfileResponse | null>({
    queryKey: ["psychologist-profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const filteredNavMain = React.useMemo(() => {
    const roleValue = typeof profile?.role === 'object' && profile?.role !== null
      ? (profile.role as { name: string }).name
      : profile?.role

    const userRole = String(roleValue).toUpperCase()
    const isSuperAdmin = userRole === "SUPER_ADMIN"

    // 1. Itens que AMBOS veem (mas com URLs diferentes no dashboard)
    const baseNav = [
      {
        title: "Home",
        url: "#",
        icon: Home,
        items: [
          {
            title: "Dashboard",
            url: isSuperAdmin ? "/admin-dashboard" : "/dashboard"
          }
        ],
      },
    ]

    // 2. Itens exclusivos do PSICÓLOGO
    if (!isSuperAdmin) {
      baseNav.push(
        {
          title: "Pacientes",
          url: "#",
          icon: Users2,
          items: [
            { title: "Cadastro de Pacientes", url: "/patients-list" },
            { title: "Docs de Pacientes", url: "/patients-docs" },
          ],
        },
        {
          title: "Agendamentos",
          url: "#",
          icon: CalendarCheck,
          items: [
            { title: "Meus Agendamentos", url: "/appointment" },
            { title: "Horários de Atendimento", url: "/availability" },
            { title: "Histórico de Sessões", url: "#" },
          ],
        },
        {
          title: "Atendimento",
          url: "#",
          icon: HeartPlus,
          items: [
            { title: "Sala de Atendimento", url: "/video-room" },
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
        {
          title: "Sugestões e Feedback",
          url: "#",
          icon: Inbox,
          items: [
            { title: "Enviar Sugestão", url: "/suggestion" },
          ],
        }
      )
    }

    // 3. Itens exclusivos do ADMIN
    if (isSuperAdmin) {
      baseNav.push({
        title: "Administração",
        url: "#",
        icon: ShieldCheck,
        items: [
          { title: "Solicitações", url: "/approvals" },
          { title: "Visão Geral Admin", url: "/admin-dashboard" },
        ],
      })

      baseNav.push({
        title: "Gestão de Usuários",
        url: "#",
        icon: Users2,
        items: [
          { title: "Todos os Psicólogos", url: "/admin/psychologists" },
          { title: "Todos os Pacientes", url: "/admin/patients" },
        ],
      })

      baseNav.push({
        title: "Financeiro MindFlush",
        url: "#",
        icon: Wallet,
        items: [
          { title: "Assinaturas Ativas", url: "/admin/subscriptions" },
          { title: "Relatório de Repasses", url: "/admin/payouts" },
        ],
      })

      baseNav.push({
        title: "Plataforma",
        url: "#",
        icon: Inbox,
        items: [
          { title: "Sugestões Recebidas", url: "admin-suggestions" },
          { title: "Controle de Sugestões", url: "menagement-suggestions" },
        ],
      })
    }

    return baseNav
  }, [profile])

  const teams = React.useMemo(() => {
    const baseProfile = profile || { firstName: "...", lastName: "...", email: "..." }

    const roleValue = typeof profile?.role === 'object' && profile?.role !== null
      ? (profile.role as { name: string }).name
      : profile?.role

    const isRoot = String(roleValue).toUpperCase() === "SUPER_ADMIN"

    return [
      {
        name: isRoot ? "MindFlow Admin" : "Clínica MindFlow",
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
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}