import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Download } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const LaporanRekapPKL = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])

  const loadReport = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pkl_placements')
        .select(`
          *,
          students (nama, nis, rombel),
          companies (nama, kategori, kecamatan),
          teachers (nama),
          pkl_periods (nama, start_date, end_date)
        `)
        .gte('start_date', startDate || '2025-01-01')
        .lte('end_date', endDate || '2025-12-31')

      if (error) throw error
      setReportData(data || [])
    } catch (error) {
      console.error('Error loading report:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Set default dates
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 1) // January 1st
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laporan Rekap PRAKERIN/PKL</h1>
          <p className="text-muted-foreground">Laporan rekap data siswa praktik kerja lapangan</p>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            LAPORAN REKAP PRAKERIN/PKL
          </CardTitle>
          <CardDescription>
            Filter berdasarkan periode tanggal untuk melihat data PKL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tanggal:</span>
            </div>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
            <span className="text-muted-foreground">s/d</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
            <Button 
              onClick={loadReport}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Loading..." : "Load"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {reportData.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Rombel</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Kecamatan</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.students?.nis}</TableCell>
                      <TableCell className="font-medium">{item.students?.nama}</TableCell>
                      <TableCell>{item.students?.rombel}</TableCell>
                      <TableCell>{item.companies?.nama}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.companies?.kategori}</Badge>
                      </TableCell>
                      <TableCell>{item.companies?.kecamatan}</TableCell>
                      <TableCell className="text-sm">
                        {item.start_date} - {item.end_date}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {reportData.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Klik "Load" untuk menampilkan data laporan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LaporanRekapPKL