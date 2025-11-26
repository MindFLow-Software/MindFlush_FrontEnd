import { Bell, Slash } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import { useHeaderStore } from "@/hooks/use-header-store"

export function Header() {
  const { title } = useHeaderStore()

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">

      {/* Lado Esquerdo: Navegação e Título */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground hidden sm:inline-block">MindFlush</span>
          <Slash className="h-4 w-4 text-muted-foreground hidden sm:inline-block" />
          <span className="font-semibold text-foreground animate-in fade-in slide-in-from-left-1 duration-300">
            {title}
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 border-2 border-background"></span>
          <span className="sr-only">Notificações</span>
        </Button>
      </div>
    </header>
  )
}