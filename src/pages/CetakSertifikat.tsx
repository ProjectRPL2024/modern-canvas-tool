import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Printer, Calendar, Download, Settings } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { generateSertifikatPDF } from "@/lib/pdfGenerator"
import { useToast } from "@/hooks/use-toast"
import { TemplateProcessor } from "@/lib/templateProcessor"

const CetakSertifikat = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('id-ID'))
  const [config, setConfig] = useState<any>({})
  const [printMode, setPrintMode] = useState<'front' | 'back' | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
    loadConfiguration()
  }, [])

  const loadConfiguration = () => {
    try {
      const storedConfig = localStorage.getItem('pkl-config')
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig))
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    }
  }

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

  const generateSertifikat = async (student: any) => {
    const placement = student.pkl_placements?.[0]
    const grade = student.student_grades?.[0]
    
    // Get certificate number from config
    const certificateNumber = config.penomoran?.sertifikat_format 
      ? `${config.penomoran.sertifikat_format}/${new Date().getFullYear()}/${String(Date.now()).slice(-4)}`
      : `CERT/${new Date().getFullYear()}/${String(Date.now()).slice(-4)}`
    
    const studentData = {
      nama: student.nama,
      nis: student.nis,
      rombel: student.rombel,
      companyName: placement?.companies?.nama || "Belum Ditempatkan",
      periode: placement ? `${placement.start_date || 'TBD'} - ${placement.end_date || 'TBD'}` : "Periode TBD",
      nilai: grade?.nilai || 0,
      certificateNumber,
      issueDate: selectedDate
    }

    try {
      // Check if Word template is configured
      const templateConfig = config.templates?.sertifikat
      if (templateConfig && templateConfig.file) {
        // Recreate File object from stored data
        const templateFile = new File(
          [Uint8Array.from(atob(templateConfig.file.data), c => c.charCodeAt(0))],
          templateConfig.file.name,
          { type: templateConfig.file.type }
        )
        
        // Use Word template with certificate-specific variables
        const templateData = {
          KOTA: 'Sidoarjo',
          TANGGAL: selectedDate,
          NOMORSURAT: certificateNumber,
          NAMAPERUSAHAAN: studentData.companyName,
          ALAMATPERUSAHAAN: '', // You might want to get this from company data
          COL_NO: '',
          COL_NAMA: studentData.nama,
          COL_KELAS: studentData.rombel,
          COL_HP: '',
          // Additional certificate data
          NAMA_SISWA: studentData.nama,
          NIS: studentData.nis,
          ROMBEL: studentData.rombel,
          NAMA_PERUSAHAAN: studentData.companyName,
          PERIODE: studentData.periode,
          NILAI: studentData.nilai.toString(),
          NOMOR_SERTIFIKAT: certificateNumber,
          TANGGAL_TERBIT: selectedDate
        }
        
        const blob = await TemplateProcessor.processWordTemplate(templateFile, templateData)
        
        // Download the processed document
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Sertifikat_${student.nama.replace(/\s+/g, '_')}.docx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        // Fallback to PDF
        const doc = generateSertifikatPDF(studentData)
        doc.save(`Sertifikat_${student.nama.replace(/\s+/g, '_')}.pdf`)
      }
      
      toast({
        title: "Sukses",
        description: `Sertifikat untuk ${student.nama} berhasil di-generate`
      })
    } catch (error) {
      console.error('Error generating certificate:', error)
      toast({
        title: "Error",
        description: "Gagal generate sertifikat. Silakan coba lagi.",
        variant: "destructive"
      })
    }
  }

  const printAllCertificates = (mode: 'front' | 'back') => {
    setPrintMode(mode)
    const studentsToProcess = filteredStudents.length > 0 ? filteredStudents : students
    
    if (studentsToProcess.length === 0) {
      toast({
        title: "Peringatan",
        description: "Tidak ada data siswa untuk dicetak",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Memproses...",
      description: `Mencetak ${mode === 'front' ? 'halaman depan' : 'halaman belakang'} untuk ${studentsToProcess.length} sertifikat`
    })

    // Process each certificate
    studentsToProcess.forEach((student, index) => {
      setTimeout(() => {
        generateSertifikat(student)
      }, index * 100) // Small delay to prevent overwhelming
    })

    setPrintMode(null)
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
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => printAllCertificates('front')}
                disabled={printMode === 'front'}
              >
                <Printer className="w-4 h-4 mr-2" />
                {printMode === 'front' ? 'Mencetak...' : 'Cetak Hal Depan'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => printAllCertificates('back')}
                disabled={printMode === 'back'}
              >
                <Printer className="w-4 h-4 mr-2" />
                {printMode === 'back' ? 'Mencetak...' : 'Cetak Hal Belakang'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/konfigurasi'}
                className="border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="w-4 h-4 mr-2" />
                Template
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
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Tidak ditemukan siswa yang sesuai dengan pencarian' : 'Belum ada data siswa'}
            </div>
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
                             {placement?.companies?.nama || "Belum Ditempatkan"}
                           </td>
                           <td className="py-3 px-4 border-r border-border text-center">
                             <Badge 
                               variant="outline" 
                               className={`${
                                 (grade?.nilai || 0) >= 85 ? 'border-green-500 text-green-700' :
                                 (grade?.nilai || 0) >= 75 ? 'border-yellow-500 text-yellow-700' :
                                 (grade?.nilai || 0) >= 60 ? 'border-orange-500 text-orange-700' :
                                 'border-red-500 text-red-700'
                               }`}
                             >
                               {grade?.nilai ? grade.nilai.toFixed(2) : '0.00'}
                             </Badge>
                           </td>
                           <td className="py-3 px-4 text-center">
                             <Button 
                               variant="outline" 
                               size="sm"
                               onClick={() => generateSertifikat(student)}
                               disabled={!placement}
                               title={!placement ? "Siswa belum ditempatkan PKL" : "Generate sertifikat"}
                             >
                               <Download className="w-4 h-4 mr-2" />
                               {config.templates?.sertifikat ? 'DOCX' : 'PDF'}
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