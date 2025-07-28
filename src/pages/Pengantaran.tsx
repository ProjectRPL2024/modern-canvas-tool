import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Truck, Edit, FileText, Calendar } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

const Pengantaran = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [pengantaran, setPengantaran] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPengantaran()
  }, [])

  const fetchPengantaran = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          pickup_delivery (
            *,
            teachers (nama),
            pkl_periods (start_date, end_date)
          )
        `)

      if (error) throw error
      setPengantaran(data || [])
    } catch (error) {
      console.error('Error fetching pengantaran:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredData = pengantaran.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengantaran Siswa PKL</h1>
          <p className="text-muted-foreground">Kelola pengantaran siswa ke perusahaan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Surat Pengajuan
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Generate Surat Tugas
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                PENGANTARAN
              </CardTitle>
              <CardDescription>
                Data pengantaran siswa ke perusahaan mitra
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama perusahaan..."
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
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">NAMA PERUSAHAAN</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">PERIODE</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">SURAT TUGAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                        <td className="py-3 px-4 border-r border-border">
                          <span className="font-medium text-foreground">{item.nama}</span>
                        </td>
                        <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                          31/01/2025 - 31/05/2025
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          <Badge variant="outline" className="border-primary text-primary">
                            Available
                          </Badge>
                        </td>
                      </tr>
                    ))}
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

export default Pengantaran