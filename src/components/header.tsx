import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-6 border-b px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex flex-1 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">MindFlush</span>
        </div>
      </div>
    </header>
  )
}