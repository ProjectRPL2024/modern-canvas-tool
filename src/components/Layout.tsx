import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-secondary">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-card/50 backdrop-blur-sm px-4 sm:px-6">
            <SidebarTrigger className="mr-2 sm:mr-4" />
            <div className="flex-1">
              <h2 className="text-sm sm:text-lg font-semibold text-foreground">
                {isMobile ? "SMK Krian 1" : "SMK Krian 1 - Sistem Informasi PKL"}
              </h2>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}