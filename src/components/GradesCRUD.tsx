import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Plus, Edit, Trash2 } from "lucide-react"

interface StudentGrade {
  id?: string
  student_id: string
  placement_id?: string
  aspek_penilaian?: string
  nilai?: number
}

interface GradesCRUDProps {
  onDataChange: () => void
  editingGrade?: StudentGrade | null
  onEditCancel?: () => void
}

export const GradesCRUD = ({ onDataChange, editingGrade, onEditCancel }: GradesCRUDProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<StudentGrade>({
    student_id: "",
    placement_id: "",
    aspek_penilaian: "",
    nilai: 0
  })

  useEffect(() => {
    fetchDropdownData()
  }, [])

  useEffect(() => {
    if (editingGrade) {
      setFormData(editingGrade)
      setOpen(true)
    }
  }, [editingGrade])

  const fetchDropdownData = async () => {
    try {
      const [studentsData, placementsData] = await Promise.all([
        supabase.from('students').select('id, nama, nis'),
        supabase.from('pkl_placements').select('id, students(nama), companies(nama)')
      ])

      if (studentsData.data) setStudents(studentsData.data)
      if (placementsData.data) setPlacements(placementsData.data)
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingGrade?.id) {
        const { error } = await supabase
          .from('student_grades')
          .update(formData)
          .eq('id', editingGrade.id)
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data nilai berhasil diupdate" })
      } else {
        const { error } = await supabase
          .from('student_grades')
          .insert([formData])
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data nilai berhasil ditambahkan" })
      }
      
      setOpen(false)
      setFormData({ 
        student_id: "", 
        placement_id: "", 
        aspek_penilaian: "", 
        nilai: 0 
      })
      onDataChange()
      if (onEditCancel) onEditCancel()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!editingGrade && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Nilai
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingGrade ? "Edit Nilai" : "Tambah Nilai Baru"}
          </DialogTitle>
          <DialogDescription>
            {editingGrade ? "Ubah data nilai yang sudah ada" : "Tambahkan data nilai siswa PKL"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_id">Siswa *</Label>
              <Select 
                value={formData.student_id} 
                onValueChange={(value) => setFormData({...formData, student_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.nama} - {student.nis}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="aspek_penilaian">Aspek Penilaian</Label>
              <Select 
                value={formData.aspek_penilaian} 
                onValueChange={(value) => setFormData({...formData, aspek_penilaian: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Aspek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sikap & Perilaku">Sikap & Perilaku</SelectItem>
                  <SelectItem value="Kehadiran">Kehadiran</SelectItem>
                  <SelectItem value="Keterampilan Teknis">Keterampilan Teknis</SelectItem>
                  <SelectItem value="Komunikasi">Komunikasi</SelectItem>
                  <SelectItem value="Tanggung Jawab">Tanggung Jawab</SelectItem>
                  <SelectItem value="Kreativitas">Kreativitas</SelectItem>
                  <SelectItem value="Nilai Akhir">Nilai Akhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="nilai">Nilai (0-100)</Label>
              <Input
                id="nilai"
                type="number"
                min="0"
                max="100"
                value={formData.nilai || ""}
                onChange={(e) => setFormData({...formData, nilai: Number(e.target.value)})}
                placeholder="Masukkan nilai (0-100)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => {
              setOpen(false)
              if (onEditCancel) onEditCancel()
            }}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : editingGrade ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteGradeButton = ({ gradeId, onDelete }: { gradeId: string, onDelete: () => void }) => {
  const { toast } = useToast()
  
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus data nilai ini?")) return
    
    try {
      const { error } = await supabase
        .from('student_grades')
        .delete()
        .eq('id', gradeId)
      
      if (error) throw error
      toast({ title: "Sukses", description: "Data nilai berhasil dihapus" })
      onDelete()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete}>
      <Trash2 className="w-4 h-4 mr-2" />
      Hapus
    </Button>
  )
}