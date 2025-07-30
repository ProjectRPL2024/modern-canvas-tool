
import { Home, Settings, Database, FileText, Users, Monitor, GraduationCap, Award, Truck, Calendar, ClipboardList, UserCheck, BarChart3 } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Data PKL", url: "/data-pkl", icon: FileText },
  { title: "Browse Siswa", url: "/browse-siswa", icon: Users },
  { title: "Nilai Siswa", url: "/nilai-siswa", icon: GraduationCap },
  { title: "Cetak Sertifikat", url: "/cetak-sertifikat", icon: Award },
  { title: "Pengantaran", url: "/pengantaran", icon: Truck },
  { title: "Presensi", url: "/presensi", icon: Calendar },
  { title: "Penilaian", url: "/penilaian", icon: ClipboardList },
  { title: "Pembimbingan", url: "/pembimbingan", icon: UserCheck },
  { title: "Monitoring", url: "/monitoring", icon: Monitor },
  { title: "Rekap PKL", url: "/laporan-rekap-pkl", icon: BarChart3 },
  { title: "Rekap Siswa", url: "/laporan-rekap-siswa", icon: BarChart3 },
  { title: "By Kategori", url: "/rekap-by-kategori", icon: BarChart3 },
  { title: "Lap. Monitoring", url: "/laporan-monitoring", icon: BarChart3 },
  { title: "Lap. Pelanggaran", url: "/laporan-pelanggaran", icon: BarChart3 },
  { title: "Konfigurasi", url: "/konfigurasi", icon: Database },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"
  const isMobile = useIsMobile()

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-primary font-semibold shadow-sm" : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  return (
    <Sidebar
      className={`bg-gradient-sidebar border-r border-sidebar-border transition-all duration-300`}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      <SidebarContent className="pt-6">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            {(!collapsed || isMobile) && (
              <div>
                <h2 className="text-base sm:text-lg font-bold text-sidebar-foreground">SMK KRIAN 1</h2>
                <p className="text-xs sm:text-sm text-sidebar-foreground/70">Sistem Informasi PKL</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-4 mb-2">
            {(!collapsed || isMobile) && "MENU UTAMA"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg transition-all duration-200">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-lg ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      {(!collapsed || isMobile) && <span className="font-medium text-sm sm:text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(!collapsed || isMobile) && (
          <div className="mt-auto p-4">
            <div className="bg-sidebar-accent/30 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-sidebar-foreground">Achyar Nur Sahid</p>
                  <p className="text-xs text-sidebar-foreground/70">Admin</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}