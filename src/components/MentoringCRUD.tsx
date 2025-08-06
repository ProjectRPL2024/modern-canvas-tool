import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Mentoring {
  id?: string
  student_id: string
  teacher_id?: string
  placement_id?: string
  tanggal: string
  catatan_pembimbingan?: string
}

interface MentoringCRUDProps {
  onDataChange: () => void
  editingMentoring?: Mentoring | null
  onEditCancel?: () => void
}

export const MentoringCRUD = ({ onDataChange, editingMentoring, onEditCancel }: MentoringCRUDProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<Mentoring>({
    student_id: "",
    teacher_id: "",
    placement_id: "",
    tanggal: "",
    catatan_pembimbingan: ""
  })

  useEffect(() => {
    fetchDropdownData()
  }, [])

  useEffect(() => {
    if (editingMentoring) {
      setFormData(editingMentoring)
      setOpen(true)
    }
  }, [editingMentoring])

  const fetchDropdownData = async () => {
    try {
      const [studentsData, teachersData] = await Promise.all([
        supabase.from('students').select('id, nama, nis'),
        supabase.from('teachers').select('id, nama')
      ])

      if (studentsData.data) setStudents(studentsData.data)
      if (teachersData.data) setTeachers(teachersData.data)
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingMentoring?.id) {
        const { error } = await supabase
          .from('mentoring')
          .update(formData)
          .eq('id', editingMentoring.id)
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data pembimbingan berhasil diupdate" })
      } else {
        const { error } = await supabase
          .from('mentoring')
          .insert([formData])
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data pembimbingan berhasil ditambahkan" })
      }
      
      setOpen(false)
      setFormData({ 
        student_id: "", 
        teacher_id: "", 
        placement_id: "", 
        tanggal: "", 
        catatan_pembimbingan: "" 
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
        {!editingMentoring && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pembimbingan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingMentoring ? "Edit Pembimbingan" : "Tambah Pembimbingan Baru"}
          </DialogTitle>
          <DialogDescription>
            {editingMentoring ? "Ubah data pembimbingan yang sudah ada" : "Tambahkan data pembimbingan baru"}
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
              <Label htmlFor="teacher_id">Guru Pembimbing</Label>
              <Select 
                value={formData.teacher_id} 
                onValueChange={(value) => setFormData({...formData, teacher_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Guru" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="tanggal">Tanggal *</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="catatan_pembimbingan">Catatan Pembimbingan</Label>
              <Textarea
                id="catatan_pembimbingan"
                value={formData.catatan_pembimbingan}
                onChange={(e) => setFormData({...formData, catatan_pembimbingan: e.target.value})}
                rows={4}
                placeholder="Masukkan catatan pembimbingan..."
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
              {loading ? "Menyimpan..." : editingMentoring ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteMentoringButton = ({ mentoringId, onDelete }: { mentoringId: string, onDelete: () => void }) => {
  const { toast } = useToast()
  
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus data pembimbingan ini?")) return
    
    try {
      const { error } = await supabase
        .from('mentoring')
        .delete()
        .eq('id', mentoringId)
      
      if (error) throw error
      toast({ title: "Sukses", description: "Data pembimbingan berhasil dihapus" })
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