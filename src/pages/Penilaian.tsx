import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Edit } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { GradesCRUD, DeleteGradeButton } from "@/components/GradesCRUD"

const Penilaian = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedAspek, setSelectedAspek] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  useEffect(() => {
    fetchCompanies()
    fetchStudents()
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

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          pkl_placements (
            companies (nama)
          ),
          student_grades (aspek_penilaian, nilai)
        `)

      if (error) throw error
      setStudents(data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nis.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Penilaian Siswa PKL</h1>
          <p className="text-muted-foreground">Kelola penilaian siswa praktik kerja lapangan</p>
        </div>
        <GradesCRUD 
          onDataChange={fetchStudents}
          editingGrade={editingItem}
          onEditCancel={() => setEditingItem(null)}
        />
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                PENILAIAN
              </CardTitle>
              <CardDescription>
                Data penilaian siswa PKL berdasarkan aspek penilaian
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
            
            <Select value={selectedAspek} onValueChange={setSelectedAspek}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="PILIH ASPEK PENILAIAN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sikap">Sikap & Perilaku</SelectItem>
                <SelectItem value="kehadiran">Kehadiran</SelectItem>
                <SelectItem value="keterampilan">Keterampilan Teknis</SelectItem>
                <SelectItem value="komunikasi">Komunikasi</SelectItem>
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
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">NILAI</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">PREDIKAT</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">PREDIKAT</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">ASPEK PENILAIAN</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                          No data to display
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student, index) => {
                        const grade = student.student_grades?.[0]
                        const nilai = grade?.nilai || 0
                        const predikat = nilai >= 85 ? 'A' : nilai >= 75 ? 'B' : nilai >= 65 ? 'C' : 'D'
                        
                        return (
                          <tr key={student.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                            <td className="py-3 px-4 border-r border-border">
                              <span className="font-mono text-sm">{student.nis}</span>
                            </td>
                            <td className="py-3 px-4 border-r border-border">
                              <span className="font-medium text-foreground">{student.nama}</span>
                            </td>
                            <td className="py-3 px-4 border-r border-border text-center">
                              <Badge 
                                variant="outline" 
                                className={`${
                                  nilai >= 85 ? 'border-green-500 text-green-700' :
                                  nilai >= 75 ? 'border-yellow-500 text-yellow-700' :
                                  'border-red-500 text-red-700'
                                }`}
                              >
                                {nilai.toFixed(0)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 border-r border-border text-center">
                              <Badge 
                                variant="outline" 
                                className={`${
                                  predikat === 'A' ? 'border-green-500 text-green-700' :
                                  predikat === 'B' ? 'border-blue-500 text-blue-700' :
                                  predikat === 'C' ? 'border-yellow-500 text-yellow-700' :
                                  'border-red-500 text-red-700'
                                }`}
                              >
                                {predikat}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                              {grade?.aspek_penilaian || "Nilai Akhir"}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingItem(grade)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {grade?.id && (
                                  <DeleteGradeButton gradeId={grade.id} onDelete={fetchStudents} />
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })
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

export default Penilaian