import { Header } from "@/components/header"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
