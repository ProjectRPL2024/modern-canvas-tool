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

interface Attendance {
  id?: string
  student_id: string
  placement_id?: string
  tanggal: string
  status: string
  keterangan?: string
}

interface AttendanceCRUDProps {
  onDataChange: () => void
  editingAttendance?: Attendance | null
  onEditCancel?: () => void
}

export const AttendanceCRUD = ({ onDataChange, editingAttendance, onEditCancel }: AttendanceCRUDProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<Attendance>({
    student_id: "",
    placement_id: "",
    tanggal: "",
    status: "HADIR",
    keterangan: ""
  })

  useEffect(() => {
    fetchDropdownData()
  }, [])

  useEffect(() => {
    if (editingAttendance) {
      setFormData(editingAttendance)
      setOpen(true)
    }
  }, [editingAttendance])

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
      if (editingAttendance?.id) {
        const { error } = await supabase
          .from('attendance')
          .update(formData)
          .eq('id', editingAttendance.id)
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data presensi berhasil diupdate" })
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert([formData])
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data presensi berhasil ditambahkan" })
      }
      
      setOpen(false)
      setFormData({ 
        student_id: "", 
        placement_id: "", 
        tanggal: "", 
        status: "HADIR", 
        keterangan: "" 
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
        {!editingAttendance && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Presensi
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingAttendance ? "Edit Presensi" : "Tambah Presensi Baru"}
          </DialogTitle>
          <DialogDescription>
            {editingAttendance ? "Ubah data presensi yang sudah ada" : "Tambahkan data presensi baru"}
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
              <Label htmlFor="status">Status Kehadiran</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HADIR">Hadir</SelectItem>
                  <SelectItem value="SAKIT">Sakit</SelectItem>
                  <SelectItem value="IZIN">Izin</SelectItem>
                  <SelectItem value="ALPHA">Alpha</SelectItem>
                  <SelectItem value="TERLAMBAT">Terlambat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                rows={3}
                placeholder="Masukkan keterangan jika diperlukan..."
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
              {loading ? "Menyimpan..." : editingAttendance ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteAttendanceButton = ({ attendanceId, onDelete }: { attendanceId: string, onDelete: () => void }) => {
  const { toast } = useToast()
  
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus data presensi ini?")) return
    
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', attendanceId)
      
      if (error) throw error
      toast({ title: "Sukses", description: "Data presensi berhasil dihapus" })
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