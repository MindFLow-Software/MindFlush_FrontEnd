"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Moon,
  Sun,
  Laptop,
  Palette
} from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"

import { signOut } from "@/api/sign-out"
import { getProfile, type GetProfileResponse } from "@/api/get-profile"
import { useTheme } from "../theme/theme-provider"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<GetProfileResponse | null>({
    queryKey: ["psychologist-profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: Infinity,
  })

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()

      toast.success('Logout realizado com sucesso!', { duration: 4000 })
      navigate("/sign-in", { replace: true })
    },
    onError: (error) => {
      console.error("Erro ao fazer logout:", error)
      localStorage.removeItem('isAuthenticated')
      navigate("/sign-in", { replace: true })
    }
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
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
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
                    <Sparkles className="mr-2 h-4 w-4" />
                    Planos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Tema</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Claro</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Escuro</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>Sistema</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem asChild>
                  <Link to="/account" className="cursor-pointer">
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Conta
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/pagamentos" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pagamentos
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                asChild
                disabled={isSigningOut}
                className="text-red-500 dark:text-red-400 focus:text-red-500 focus:bg-red-100 dark:focus:bg-red-900/20"
              >
                <button
                  className="w-full text-left cursor-pointer flex items-center"
                  onClick={() => signOutFn()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}