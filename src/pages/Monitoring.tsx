import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, Plus, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

const Monitoring = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [monitoring, setMonitoring] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
    fetchMonitoring()
  }, [])

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase.from('companies').select('*')
      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const fetchMonitoring = async () => {
    try {
      const { data, error } = await supabase
        .from('monitoring')
        .select(`*, students (nis, nama), teachers (nama)`)
      if (error) throw error
      setMonitoring(data || [])
    } catch (error) {
      console.error('Error fetching monitoring:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMonitoring = monitoring.filter(item =>
    item.students?.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Monitoring & Pelanggaran</h1>
          <p className="text-muted-foreground">Kelola monitoring dan pelanggaran siswa PKL</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add</Button>
          <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" />Edit</Button>
          <Button variant="outline" size="sm"><Trash2 className="w-4 h-4 mr-2" />Del</Button>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            MONITORING & PELANGGARAN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="PILIH PERUSAHAAN/PRAKERIN" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">TANGGAL</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">NAMA GURU PEMBIMBING</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">PELANGGARAN</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">MONITORING KEGIATAN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMonitoring.length === 0 ? (
                    <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No data to display</td></tr>
                  ) : (
                    filteredMonitoring.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                        <td className="py-3 px-4">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                        <td className="py-3 px-4">{item.teachers?.nama || "-"}</td>
                        <td className="py-3 px-4">{item.jenis_monitoring === 'PELANGGARAN' ? item.catatan : "-"}</td>
                        <td className="py-3 px-4">{item.jenis_monitoring === 'MONITORING' ? item.catatan : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Monitoring