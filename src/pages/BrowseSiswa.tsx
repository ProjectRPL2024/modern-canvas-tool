import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Eye, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { StudentCRUD, DeleteButton } from "@/components/StudentCRUD"

const BrowseSiswa = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStudent, setEditingStudent] = useState<any>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          pkl_placements (
            *,
            companies (nama),
            teachers (nama),
            pkl_periods (start_date, end_date)
          )
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
    student.nis.includes(searchTerm) ||
    student.rombel?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Browse Siswa PKL</h1>
          <p className="text-muted-foreground">Kelola data siswa praktik kerja lapangan</p>
        </div>
        <StudentCRUD 
          onDataChange={fetchStudents} 
          editingStudent={editingStudent}
          onEditCancel={() => setEditingStudent(null)}
        />
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                BROWSE SISWA PKL
              </CardTitle>
              <CardDescription>
                Data lengkap siswa praktik kerja lapangan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama siswa, NIS, atau rombel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border focus:border-primary focus:ring-primary w-full"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
            {/* Desktop Table View */}
            <div className="hidden lg:block border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">NIS</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">NAMA SISWA</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">ROMBEL</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">DI PERUSAHAAN</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">PERIODE</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">GURU PEMBIMBING</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => {
                      const placement = student.pkl_placements?.[0]
                      return (
                        <tr key={student.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                          <td className="py-3 px-4 border-r border-border">
                            <span className="font-mono text-sm">{student.nis}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-border">
                            <span className="font-medium text-foreground">{student.nama}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-border">
                            <Badge variant="outline">{student.rombel}</Badge>
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            {placement?.companies?.nama || "-"}
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            {placement ? `${placement.pkl_periods.start_date} - ${placement.pkl_periods.end_date}` : "-"}
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            {placement?.teachers?.nama || "-"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditingStudent(student)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <DeleteButton studentId={student.id} onDelete={fetchStudents} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredStudents.map((student) => {
                const placement = student.pkl_placements?.[0]
                return (
                  <Card key={student.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{student.nama}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{student.nis}</p>
                        </div>
                        <Badge variant="outline">{student.rombel}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Perusahaan: </span>
                          <span className="text-foreground">{placement?.companies?.nama || "-"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Periode: </span>
                          <span className="text-foreground">
                            {placement ? `${placement.pkl_periods.start_date} - ${placement.pkl_periods.end_date}` : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Guru Pembimbing: </span>
                          <span className="text-foreground">{placement?.teachers?.nama || "-"}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingStudent(student)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <DeleteButton studentId={student.id} onDelete={fetchStudents} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BrowseSiswa