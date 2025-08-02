import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Download } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const RekapByKategori = () => {
  const [selectedKategori, setSelectedKategori] = useState("")
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState("rombel")
  const { toast } = useToast()

  useEffect(() => {
    fetchKategoriOptions()
  }, [])

  const fetchKategoriOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('kategori')
        .not('kategori', 'is', null)
      
      if (error) throw error
      
      const uniqueKategori = [...new Set(data?.map(item => item.kategori).filter(Boolean))]
      setKategoriOptions(uniqueKategori)
    } catch (error) {
      console.error('Error fetching kategori options:', error)
    }
  }

  const loadReport = async () => {
    if (!selectedKategori) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pkl_placements')
        .select(`
          *,
          students (nama, nis, rombel),
          companies!inner (nama, kategori, kecamatan),
          teachers (nama),
          pkl_periods (nama, start_date, end_date)
        `)
        .eq('companies.kategori', selectedKategori)

      if (error) throw error
      setReportData(data || [])
    } catch (error) {
      console.error('Error loading report:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupedData = () => {
    if (groupBy === "rombel") {
      const grouped = reportData.reduce((acc, item) => {
        const key = item.students?.rombel || 'Tidak Ada Rombel'
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
      }, {})
      return grouped
    } else {
      const grouped = reportData.reduce((acc, item) => {
        const key = item.companies?.kecamatan || 'Tidak Ada Kecamatan'
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
      }, {})
      return grouped
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rekap Siswa PKL by Kategori Perusahaan</h1>
          <p className="text-muted-foreground">Laporan rekap siswa berdasarkan kategori perusahaan</p>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            REKAP SISWA PKL BY KATEGORI PERUSAHAAN
          </CardTitle>
          <CardDescription>
            Pilih kategori perusahaan untuk melihat data siswa PKL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Kategori:</span>
            <Select value={selectedKategori} onValueChange={setSelectedKategori}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                {kategoriOptions.map((kategori) => (
                  <SelectItem key={kategori} value={kategori}>
                    {kategori}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={loadReport}
              disabled={loading || !selectedKategori}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Loading..." : "Load"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const doc = generateLaporanPDF(
                  `REKAP SISWA PKL - ${selectedKategori}`,
                  reportData,
                  ["NIS", "Nama", "Rombel", "Perusahaan", "Kecamatan", "Status"]
                )
                doc.save(`Rekap_By_Kategori_${selectedKategori}.pdf`)
                toast({
                  title: "Sukses",
                  description: "Rekap by Kategori berhasil di-export ke PDF"
                })
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>

          {reportData.length > 0 && (
            <Tabs value={groupBy} onValueChange={setGroupBy} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rombel">by ROMBEL</TabsTrigger>
                <TabsTrigger value="kecamatan">by KECAMATAN</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rombel" className="space-y-4">
                {Object.entries(groupedData()).map(([group, items]: [string, any[]]) => (
                  <div key={group} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Rombel: {group}</h3>
                        <Badge variant="outline">
                          {items.length} siswa
                        </Badge>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>NIS</TableHead>
                          <TableHead>Nama Siswa</TableHead>
                          <TableHead>Perusahaan</TableHead>
                          <TableHead>Kecamatan</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.students?.nis}</TableCell>
                            <TableCell className="font-medium">{item.students?.nama}</TableCell>
                            <TableCell>{item.companies?.nama}</TableCell>
                            <TableCell>{item.companies?.kecamatan}</TableCell>
                            <TableCell>
                              <Badge variant="default">{item.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="kecamatan" className="space-y-4">
                {Object.entries(groupedData()).map(([group, items]: [string, any[]]) => (
                  <div key={group} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Kecamatan: {group}</h3>
                        <Badge variant="outline">
                          {items.length} siswa
                        </Badge>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>NIS</TableHead>
                          <TableHead>Nama Siswa</TableHead>
                          <TableHead>Rombel</TableHead>
                          <TableHead>Perusahaan</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.students?.nis}</TableCell>
                            <TableCell className="font-medium">{item.students?.nama}</TableCell>
                            <TableCell>{item.students?.rombel}</TableCell>
                            <TableCell>{item.companies?.nama}</TableCell>
                            <TableCell>
                              <Badge variant="default">{item.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}

          {reportData.length === 0 && !loading && selectedKategori && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data siswa untuk kategori {selectedKategori}
            </div>
          )}

          {!selectedKategori && (
            <div className="text-center py-8 text-muted-foreground">
              Pilih kategori untuk menampilkan data laporan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RekapByKategori