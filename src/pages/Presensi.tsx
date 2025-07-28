import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

const Presensi = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
    fetchAttendance()
  }, [])

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')

      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students (nis, nama, rombel),
          pkl_placements (
            companies (nama)
          )
        `)

      if (error) throw error
      setAttendance(data || [])
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAttendance = attendance.filter(item =>
    item.students?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.students?.nis.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Presensi Siswa PKL</h1>
          <p className="text-muted-foreground">Kelola presensi siswa praktik kerja lapangan</p>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                PRESENSI
              </CardTitle>
              <CardDescription>
                Data presensi siswa PKL di perusahaan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="PILIH PERUSAHAAN/PRAKERIN" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="PILIH TANGGAL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-01-28">28 Januari 2025</SelectItem>
                <SelectItem value="2025-01-29">29 Januari 2025</SelectItem>
                <SelectItem value="2025-01-30">30 Januari 2025</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">NIS</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">NAMA SISWA</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">STATUS</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">TERLAMBAT</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">DATANG</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">PULANG</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">KETERANGAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                          No data to display
                        </td>
                      </tr>
                    ) : (
                      filteredAttendance.map((item, index) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                          <td className="py-3 px-4 border-r border-border">
                            <span className="font-mono text-sm">{item.students?.nis}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-border">
                            <span className="font-medium text-foreground">{item.students?.nama}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-border">
                            <Badge 
                              variant="outline" 
                              className={`${
                                item.status === 'HADIR' ? 'border-green-500 text-green-700' :
                                item.status === 'SAKIT' ? 'border-yellow-500 text-yellow-700' :
                                item.status === 'IZIN' ? 'border-blue-500 text-blue-700' :
                                'border-red-500 text-red-700'
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            -
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            -
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            -
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {item.keterangan || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Presensi