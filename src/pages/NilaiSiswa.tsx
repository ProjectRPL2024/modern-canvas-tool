import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, GraduationCap, Edit } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

const NilaiSiswa = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('student_grades')
        .select(`
          *,
          students (nis, nama, rombel),
          pkl_placements (
            companies (nama)
          )
        `)

      if (error) throw error
      setGrades(data || [])
    } catch (error) {
      console.error('Error fetching grades:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGrades = grades.filter(grade =>
    grade.students?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.students?.nis.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nilai Siswa PKL</h1>
          <p className="text-muted-foreground">Kelola nilai siswa praktik kerja lapangan</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                NILAI SISWA
              </CardTitle>
              <CardDescription>
                Data nilai siswa PKL/Prakerin
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari NIS atau nama siswa..."
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
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">ROMBEL</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">DI PERUSAHAAN</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">NILAI RERATA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map((grade, index) => (
                      <tr key={grade.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                        <td className="py-3 px-4 border-r border-border">
                          <span className="font-mono text-sm">{grade.students?.nis}</span>
                        </td>
                        <td className="py-3 px-4 border-r border-border">
                          <span className="font-medium text-foreground">{grade.students?.nama}</span>
                        </td>
                        <td className="py-3 px-4 border-r border-border">
                          <Badge variant="outline">{grade.students?.rombel}</Badge>
                        </td>
                        <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                          {grade.pkl_placements?.companies?.nama || "PT. SO GOOD FOOD"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            variant="outline" 
                            className={`${
                              grade.nilai >= 85 ? 'border-green-500 text-green-700' :
                              grade.nilai >= 75 ? 'border-yellow-500 text-yellow-700' :
                              'border-red-500 text-red-700'
                            }`}
                          >
                            {grade.nilai.toFixed(2)}
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

export default NilaiSiswa