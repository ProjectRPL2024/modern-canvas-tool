import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Download } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
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

const LaporanRekapSiswa = () => {
  const [selectedRombel, setSelectedRombel] = useState("")
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])
  const [rombelOptions, setRombelOptions] = useState<string[]>([])

  useEffect(() => {
    fetchRombelOptions()
  }, [])

  const fetchRombelOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('rombel')
        .not('rombel', 'is', null)
      
      if (error) throw error
      
      const uniqueRombel = [...new Set(data?.map(item => item.rombel).filter(Boolean))]
      setRombelOptions(uniqueRombel)
    } catch (error) {
      console.error('Error fetching rombel options:', error)
    }
  }

  const loadReport = async () => {
    if (!selectedRombel) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          pkl_placements (
            *,
            companies (nama, kategori, kecamatan),
            teachers (nama),
            pkl_periods (nama, start_date, end_date)
          )
        `)
        .eq('rombel', selectedRombel)

      if (error) throw error
      setReportData(data || [])
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
          <h1 className="text-3xl font-bold text-foreground">Laporan Rekap Siswa PKL</h1>
          <p className="text-muted-foreground">Laporan rekap siswa berdasarkan rombongan belajar</p>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            LAPORAN REKAP SISWA PKL
          </CardTitle>
          <CardDescription>
            Pilih rombongan belajar untuk melihat data siswa PKL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Rombel:</span>
            <Select value={selectedRombel} onValueChange={setSelectedRombel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih Rombel" />
              </SelectTrigger>
              <SelectContent>
                {rombelOptions.map((rombel) => (
                  <SelectItem key={rombel} value={rombel}>
                    {rombel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={loadReport}
              disabled={loading || !selectedRombel}
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
              <div className="bg-muted/50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Rombel: {selectedRombel}</h3>
                  <Badge variant="outline">
                    Total: {reportData.length} siswa
                  </Badge>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Guru Pembimbing</TableHead>
                    <TableHead>Periode PKL</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((student) => {
                    const placement = student.pkl_placements?.[0]
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{student.nis}</TableCell>
                        <TableCell className="font-medium">{student.nama}</TableCell>
                        <TableCell>{placement?.companies?.nama || '-'}</TableCell>
                        <TableCell>{placement?.teachers?.nama || '-'}</TableCell>
                        <TableCell className="text-sm">
                          {placement ? `${placement.start_date} - ${placement.end_date}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={placement ? 'default' : 'secondary'}>
                            {placement ? placement.status : 'Belum Ditempatkan'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {reportData.length === 0 && !loading && selectedRombel && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data siswa untuk rombel {selectedRombel}
            </div>
          )}

          {!selectedRombel && (
            <div className="text-center py-8 text-muted-foreground">
              Pilih rombel untuk menampilkan data laporan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LaporanRekapSiswa