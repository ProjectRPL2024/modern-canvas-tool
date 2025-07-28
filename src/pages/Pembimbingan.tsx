import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Eye } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

const Pembimbingan = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [mentoring, setMentoring] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
    fetchMentoring()
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

  const fetchMentoring = async () => {
    try {
      const { data, error } = await supabase
        .from('mentoring')
        .select(`
          *,
          students (nis, nama),
          teachers (nama)
        `)

      if (error) throw error
      setMentoring(data || [])
    } catch (error) {
      console.error('Error fetching mentoring:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMentoring = mentoring.filter(item =>
    item.students?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.students?.nis.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pembimbingan Siswa PKL</h1>
          <p className="text-muted-foreground">Kelola pembimbingan siswa praktik kerja lapangan</p>
        </div>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                PEMBIMBINGAN
              </CardTitle>
              <CardDescription>
                Data pembimbingan siswa PKL di perusahaan
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
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">CATATAN PEMBIMBINGAN</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">TANGGAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMentoring.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-muted-foreground">
                          No data to display
                        </td>
                      </tr>
                    ) : (
                      filteredMentoring.map((item, index) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                          <td className="py-3 px-4 border-r border-border">
                            <span className="font-mono text-sm">{item.students?.nis}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-border">
                            <span className="font-medium text-foreground">{item.students?.nama}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            {item.catatan_pembimbingan || "Belum ada catatan"}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(item.tanggal).toLocaleDateString('id-ID')}
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

export default Pembimbingan