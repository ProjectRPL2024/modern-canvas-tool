import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, Download } from "lucide-react"
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

const LaporanPelanggaran = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])
  const [teacherOptions, setTeacherOptions] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchTeacherOptions()
    // Set default dates
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  const fetchTeacherOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, nama')
      
      if (error) throw error
      setTeacherOptions(data || [])
    } catch (error) {
      console.error('Error fetching teacher options:', error)
    }
  }

  const loadReport = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('violations')
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

      if (selectedTeacher && selectedTeacher !== "all") {
        query = query.eq('teacher_id', selectedTeacher)
      }

      const { data, error } = await query

      if (error) throw error
      setReportData(data || [])
    } catch (error) {
      console.error('Error loading report:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN': return 'destructive'
      case 'RESOLVED': return 'default'
      case 'PENDING': return 'secondary'
      default: return 'secondary'
    }
  }

  const getViolationSeverity = (jenis: string) => {
    switch (jenis) {
      case 'Keterlambatan': return 'Ringan'
      case 'Tidak Hadir': return 'Sedang'
      case 'Pelanggaran Tata Tertib': return 'Berat'
      default: return 'Sedang'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laporan Rekap Pelanggaran Siswa PKL</h1>
          <p className="text-muted-foreground">Laporan pelanggaran siswa selama PKL</p>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            LAPORAN REKAP PELANGGARAN SISWA PKL
          </CardTitle>
          <CardDescription>
            Filter berdasarkan tanggal dan guru pembimbing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="text-sm font-medium">Guru Pembimbing</label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Guru" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Guru</SelectItem>
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
                  "LAPORAN PELANGGARAN SISWA PKL",
                  reportData,
                  ["Tanggal", "NIS", "Nama", "Rombel", "Perusahaan", "Jenis", "Status"]
                )
                doc.save("Laporan_Pelanggaran_PKL.pdf")
                toast({
                  title: "Sukses",
                  description: "Laporan Pelanggaran berhasil di-export ke PDF"
                })
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>

          {reportData.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-destructive">
                      {reportData.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Pelanggaran</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-500">
                      {reportData.filter(item => item.status === 'OPEN').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Belum Ditangani</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-500">
                      {reportData.filter(item => item.status === 'RESOLVED').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Sudah Ditangani</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-500">
                      {[...new Set(reportData.map(item => item.student_id))].length}
                    </div>
                    <p className="text-xs text-muted-foreground">Siswa Terlibat</p>
                  </CardContent>
                </Card>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Tanggal</TableHead>
                      <TableHead>NIS</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Rombel</TableHead>
                      <TableHead>Perusahaan</TableHead>
                      <TableHead>Jenis Pelanggaran</TableHead>
                      <TableHead>Tingkat</TableHead>
                      <TableHead>Sanksi</TableHead>
                      <TableHead>Guru Pembimbing</TableHead>
                      <TableHead>Status</TableHead>
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
                        <TableCell>
                          <Badge variant="outline">{item.jenis_pelanggaran}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              getViolationSeverity(item.jenis_pelanggaran) === 'Berat' ? 'destructive' :
                              getViolationSeverity(item.jenis_pelanggaran) === 'Sedang' ? 'secondary' : 'default'
                            }
                          >
                            {getViolationSeverity(item.jenis_pelanggaran)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{item.sanksi}</TableCell>
                        <TableCell>{item.teachers?.nama}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {reportData.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Klik "Load" untuk menampilkan data pelanggaran
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LaporanPelanggaran