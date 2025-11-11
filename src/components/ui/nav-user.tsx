"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { getProfile, type GetProfileResponse } from "@/api/get-profile"
import { Link } from "react-router-dom" 

export function NavUser() {
  const { isMobile } = useSidebar()

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<GetProfileResponse | null>({
    queryKey: ["psychologist-profile"],
    queryFn: getProfile,
    retry: false,
  })

  const name = profile
    ? `${profile.firstName} ${profile.lastName}`
    : isError
    ? "Erro ao carregar"
    : "Carregando..."

  const avatar = profile?.profileImageUrl
  const initials = profile?.firstName?.[0]?.toUpperCase() || "?"

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
                ) : avatar ? (
                  <AvatarImage src={avatar} alt={name} />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    {initials}
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
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {profile?.email || "Sem e-mail"}
                    </span>
                  </>
                )}
              </div>

              {!isLoading && <ChevronsUpDown className="ml-auto size-4" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {!isLoading && profile && (
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    {avatar ? (
                      <AvatarImage src={avatar} alt={name} />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/planos" className="cursor-pointer"> 
                    <Sparkles />
                    Planos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/account" className="cursor-pointer">
                    <BadgeCheck />
                    Conta
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/pagamentos" className="cursor-pointer">
                    <CreditCard />
                    Pagamentos
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Bell />
                  Notificações
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <LogOut />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}