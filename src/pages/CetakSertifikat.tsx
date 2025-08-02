import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Printer, Calendar, Download } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { generateSertifikatPDF } from "@/lib/pdfGenerator"
import { useToast } from "@/hooks/use-toast"

const CetakSertifikat = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("28/07/2024")
  const { toast } = useToast()

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
            companies (nama)
          ),
          student_grades (nilai)
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

  const generateSertifikat = (student: any) => {
    const placement = student.pkl_placements?.[0]
    const grade = student.student_grades?.[0]
    
    const studentData = {
      nama: student.nama,
      nis: student.nis,
      rombel: student.rombel,
      companyName: placement?.companies?.nama || "PT. SO GOOD FOOD",
      periode: "Juli - September 2024",
      nilai: grade?.nilai || 80
    }
    
    const doc = generateSertifikatPDF(studentData)
    doc.save(`Sertifikat_${student.nama.replace(/\s+/g, '_')}.pdf`)
    
    toast({
      title: "Sukses",
      description: `Sertifikat untuk ${student.nama} berhasil di-generate`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cetak Sertifikat PKL</h1>
          <p className="text-muted-foreground">Kelola dan cetak sertifikat siswa PKL</p>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                CETAK SERTIFIKAT
              </CardTitle>
              <CardDescription>
                Cetak sertifikat PKL untuk siswa yang telah menyelesaikan program
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Printer className="w-4 h-4 mr-2" />
                Cetak Hal Depan
              </Button>
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Printer className="w-4 h-4 mr-2" />
                Cetak Hal Belakang
              </Button>
              <div className="flex items-center gap-2 ml-4">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Tgl Cetak: {selectedDate}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama siswa atau NIS..."
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
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">NILAI RERATA</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => {
                      const placement = student.pkl_placements?.[0]
                      const grade = student.student_grades?.[0]
                      
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
                            {placement?.companies?.nama || "PT. SO GOOD FOOD"}
                          </td>
                          <td className="py-3 px-4 border-r border-border text-center">
                            <Badge 
                              variant="outline" 
                              className={`${
                                (grade?.nilai || 80) >= 85 ? 'border-green-500 text-green-700' :
                                (grade?.nilai || 80) >= 75 ? 'border-yellow-500 text-yellow-700' :
                                'border-red-500 text-red-700'
                              }`}
                            >
                              {(grade?.nilai || 80).toFixed(2)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => generateSertifikat(student)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
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

export default CetakSertifikat