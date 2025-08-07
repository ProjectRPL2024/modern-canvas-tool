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

interface Monitoring {
  id?: string
  student_id: string
  teacher_id?: string
  placement_id?: string
  tanggal: string
  jenis_monitoring?: string
  catatan?: string
  tindak_lanjut?: string
}

interface MonitoringCRUDProps {
  onDataChange: () => void
  editingMonitoring?: Monitoring | null
  onEditCancel?: () => void
}

export const MonitoringCRUD = ({ onDataChange, editingMonitoring, onEditCancel }: MonitoringCRUDProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<Monitoring>({
    student_id: "",
    teacher_id: "",
    placement_id: "",
    tanggal: "",
    jenis_monitoring: "MONITORING",
    catatan: "",
    tindak_lanjut: ""
  })

  useEffect(() => {
    fetchDropdownData()
  }, [])

  useEffect(() => {
    if (editingMonitoring) {
      setFormData(editingMonitoring)
      setOpen(true)
    }
  }, [editingMonitoring])

  const fetchDropdownData = async () => {
    try {
      const [studentsData, teachersData, placementsData] = await Promise.all([
        supabase.from('students').select('id, nama, nis'),
        supabase.from('teachers').select('id, nama'),
        supabase.from('pkl_placements').select('id, students(nama), companies(nama)')
      ])

      if (studentsData.data) setStudents(studentsData.data)
      if (teachersData.data) setTeachers(teachersData.data)
      if (placementsData.data) setPlacements(placementsData.data)
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean up formData - remove empty placement_id if not needed
      const cleanFormData = {
        ...formData,
        placement_id: formData.placement_id || null
      }

      if (editingMonitoring?.id) {
        const { error } = await supabase
          .from('monitoring')
          .update(cleanFormData)
          .eq('id', editingMonitoring.id)
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data monitoring berhasil diupdate" })
      } else {
        const { error } = await supabase
          .from('monitoring')
          .insert([cleanFormData])
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data monitoring berhasil ditambahkan" })
      }
      
      setOpen(false)
      setFormData({ 
        student_id: "", 
        teacher_id: "", 
        placement_id: "", 
        tanggal: "", 
        jenis_monitoring: "MONITORING", 
        catatan: "", 
        tindak_lanjut: "" 
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
        {!editingMonitoring && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Monitoring
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMonitoring ? "Edit Monitoring" : "Tambah Monitoring Baru"}
          </DialogTitle>
          <DialogDescription>
            {editingMonitoring ? "Ubah data monitoring yang sudah ada" : "Tambahkan data monitoring baru"}
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
            <div>
              <Label htmlFor="jenis_monitoring">Jenis Monitoring</Label>
              <Select 
                value={formData.jenis_monitoring} 
                onValueChange={(value) => setFormData({...formData, jenis_monitoring: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONITORING">Monitoring</SelectItem>
                  <SelectItem value="PELANGGARAN">Pelanggaran</SelectItem>
                  <SelectItem value="KUNJUNGAN">Kunjungan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                rows={3}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="tindak_lanjut">Tindak Lanjut</Label>
              <Textarea
                id="tindak_lanjut"
                value={formData.tindak_lanjut}
                onChange={(e) => setFormData({...formData, tindak_lanjut: e.target.value})}
                rows={3}
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
              {loading ? "Menyimpan..." : editingMonitoring ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteMonitoringButton = ({ monitoringId, onDelete }: { monitoringId: string, onDelete: () => void }) => {
  const { toast } = useToast()
  
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus data monitoring ini?")) return
    
    try {
      const { error } = await supabase
        .from('monitoring')
        .delete()
        .eq('id', monitoringId)
      
      if (error) throw error
      toast({ title: "Sukses", description: "Data monitoring berhasil dihapus" })
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