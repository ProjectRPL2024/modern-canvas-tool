import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Monitor, Download } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { generateLaporanPDF } from "@/lib/pdfGenerator"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const LaporanMonitoring = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedRombel, setSelectedRombel] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])
  const [rombelOptions, setRombelOptions] = useState<string[]>([])
  const [teacherOptions, setTeacherOptions] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchOptions()
    // Set default dates
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  const fetchOptions = async () => {
    try {
      // Fetch rombel options
      const { data: rombelData } = await supabase
        .from('students')
        .select('rombel')
        .not('rombel', 'is', null)
      
      const uniqueRombel = [...new Set(rombelData?.map(item => item.rombel).filter(Boolean))]
      setRombelOptions(uniqueRombel)

      // Fetch teacher options
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('id, nama')
      
      setTeacherOptions(teacherData || [])
    } catch (error) {
      console.error('Error fetching options:', error)
    }
  }

  const loadReport = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('monitoring')
        .select(`
          *,
          students (nama, nis, rombel),
          teachers (nama),
          pkl_placements (
            companies (nama)
          )
        `)
        .gte('tanggal', startDate || '2025-01-01')
        .lte('tanggal', endDate || '2025-12-31')

      if (selectedTeacher) {
        query = query.eq('teacher_id', selectedTeacher)
      }

      const { data, error } = await query

      if (error) throw error

      let filteredData = data || []
      
      if (selectedRombel) {
        filteredData = filteredData.filter(item => 
          item.students?.rombel === selectedRombel
        )
      }

      setReportData(filteredData)
    } catch (error) {
      console.error('Error loading report:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laporan Rekap Monitoring</h1>
          <p className="text-muted-foreground">Laporan monitoring siswa PKL</p>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            LAPORAN REKAP MONITORING
          </CardTitle>
          <CardDescription>
            Filter berdasarkan tanggal, rombel, dan guru pembimbing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Mulai</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Akhir</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rombel</label>
              <Select value={selectedRombel} onValueChange={setSelectedRombel}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Rombel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Rombel</SelectItem>
                  {rombelOptions.map((rombel) => (
                    <SelectItem key={rombel} value={rombel}>
                      {rombel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Guru Pembimbing</label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Guru" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Guru</SelectItem>
                  {teacherOptions.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={loadReport}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Loading..." : "Load"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const doc = generateLaporanPDF(
                  "LAPORAN MONITORING PKL",
                  reportData,
                  ["Tanggal", "NIS", "Nama Siswa", "Rombel", "Perusahaan"]
                )
                doc.save("Laporan_Monitoring_PKL.pdf")
                toast({
                  title: "Sukses",
                  description: "Laporan Monitoring berhasil di-export ke PDF"
                })
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>

          {reportData.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Tanggal</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Rombel</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Guru Pembimbing</TableHead>
                    <TableHead>Jenis Monitoring</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Tindak Lanjut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell>{item.students?.nis}</TableCell>
                      <TableCell className="font-medium">{item.students?.nama}</TableCell>
                      <TableCell>{item.students?.rombel}</TableCell>
                      <TableCell>{item.pkl_placements?.companies?.nama || '-'}</TableCell>
                      <TableCell>{item.teachers?.nama}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.jenis_monitoring}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{item.catatan}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.tindak_lanjut}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {reportData.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Klik "Load" untuk menampilkan data monitoring
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LaporanMonitoring