import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Settings, Database } from "lucide-react"

const stats = [
  {
    title: "Total Siswa PKL",
    value: "184",
    description: "Siswa aktif prakerin",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Dokumen Dibuat",
    value: "97",
    description: "Template tergenerate",
    icon: FileText,
    color: "text-green-600"
  },
  {
    title: "Konfigurasi",
    value: "12",
    description: "Template tersedia",
    icon: Settings,
    color: "text-purple-600"
  },
  {
    title: "Data Perusahaan",
    value: "45",
    description: "Mitra PKL aktif",
    icon: Database,
    color: "text-orange-600"
  }
]

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Sistem Informasi PKL SMK Krian 1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-soft bg-gradient-to-br from-card to-card/80 hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Data PKL Terbaru
            </CardTitle>
            <CardDescription>
              Siswa yang baru mendaftar PKL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Achyar Nur Sahid", company: "PT. Tech Solutions", period: "01/02/2025 - 31/05/2025" },
                { name: "Hadi Purnomo", company: "CV. Digital Creative", period: "01/02/2025 - 31/05/2025" },
                { name: "Muhammad S.Sos, M.Pd", company: "PT. Education Tech", period: "01/02/2025 - 31/05/2025" },
              ].map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{student.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Statistik Sistem
            </CardTitle>
            <CardDescription>
              Ringkasan penggunaan sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Template Dokumen</span>
                <span className="font-medium">12 template</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wallpaper Tersedia</span>
                <span className="font-medium">4 wallpaper</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">User Aktif</span>
                <span className="font-medium">3 admin</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Periode PKL</span>
                <span className="font-medium">2023/2024 (GASAL)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard