import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Student {
  id?: string
  nis: string
  nama: string
  rombel: string
}

interface StudentCRUDProps {
  onDataChange: () => void
  editingStudent?: Student | null
  onEditCancel?: () => void
}

export const StudentCRUD = ({ onDataChange, editingStudent, onEditCancel }: StudentCRUDProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<Student>({
    nis: "",
    nama: "",
    rombel: ""
  })

  useEffect(() => {
    if (editingStudent) {
      setFormData(editingStudent)
      setOpen(true)
    }
  }, [editingStudent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingStudent?.id) {
        // Update
        const { error } = await supabase
          .from('students')
          .update(formData)
          .eq('id', editingStudent.id)
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data siswa berhasil diupdate" })
      } else {
        // Create
        const { error } = await supabase
          .from('students')
          .insert([formData])
        
        if (error) throw error
        toast({ title: "Sukses", description: "Siswa baru berhasil ditambahkan" })
      }
      
      setOpen(false)
      setFormData({ nis: "", nama: "", rombel: "" })
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

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      toast({ title: "Sukses", description: "Siswa berhasil dihapus" })
      onDataChange()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!editingStudent && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Siswa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingStudent ? "Edit Siswa" : "Tambah Siswa Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nis">NIS</Label>
            <Input
              id="nis"
              value={formData.nis}
              onChange={(e) => setFormData({...formData, nis: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="rombel">Rombel</Label>
            <Select 
              value={formData.rombel} 
              onValueChange={(value) => setFormData({...formData, rombel: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Rombel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XII RPL 1">XII RPL 1</SelectItem>
                <SelectItem value="XII RPL 2">XII RPL 2</SelectItem>
                <SelectItem value="XII TKJ 1">XII TKJ 1</SelectItem>
                <SelectItem value="XII TKJ 2">XII TKJ 2</SelectItem>
                <SelectItem value="XII MM 1">XII MM 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => {
              setOpen(false)
              if (onEditCancel) onEditCancel()
            }}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : editingStudent ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteButton = ({ studentId, onDelete }: { studentId: string, onDelete: () => void }) => {
  const { toast } = useToast()
  
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)
      
      if (error) throw error
      toast({ title: "Sukses", description: "Siswa berhasil dihapus" })
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