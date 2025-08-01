import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Truck, Edit, FileText, Calendar, Plus, Download, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PickupDelivery {
  id?: string
  company_id: string
  period_id: string
  guru_pendamping_id?: string
  tanggal_penjemputan?: string
  tanggal_pengantaran?: string
  status: string
  kelompok?: string
}

const Pengantaran = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [pengantaran, setPengantaran] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PickupDelivery | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<PickupDelivery>({
    company_id: "",
    period_id: "",
    guru_pendamping_id: "",
    tanggal_penjemputan: "",
    tanggal_pengantaran: "",
    status: "PLANNED",
    kelompok: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [deliveryData, companiesData, periodsData, teachersData] = await Promise.all([
        supabase.from('pickup_delivery').select(`
          *,
          companies (nama, alamat),
          pkl_periods (nama, start_date, end_date),
          teachers (nama)
        `),
        supabase.from('companies').select('id, nama'),
        supabase.from('pkl_periods').select('id, nama, start_date, end_date'),
        supabase.from('teachers').select('id, nama')
      ])

      if (deliveryData.data) setPengantaran(deliveryData.data)
      if (companiesData.data) setCompanies(companiesData.data)
      if (periodsData.data) setPeriods(periodsData.data)
      if (teachersData.data) setTeachers(teachersData.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (editingItem?.id) {
        const { error } = await supabase
          .from('pickup_delivery')
          .update(formData)
          .eq('id', editingItem.id)
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data pengantaran berhasil diupdate" })
      } else {
        const { error } = await supabase
          .from('pickup_delivery')
          .insert([formData])
        
        if (error) throw error
        toast({ title: "Sukses", description: "Data pengantaran berhasil ditambahkan" })
      }
      
      setDialogOpen(false)
      setEditingItem(null)
      resetForm()
      fetchData()
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

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      company_id: item.company_id || "",
      period_id: item.period_id || "",
      guru_pendamping_id: item.guru_pendamping_id || "",
      tanggal_penjemputan: item.tanggal_penjemputan || "",
      tanggal_pengantaran: item.tanggal_pengantaran || "", 
      status: item.status || "PLANNED",
      kelompok: item.kelompok || ""
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data pengantaran ini?")) return
    
    try {
      const { error } = await supabase
        .from('pickup_delivery')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      toast({ title: "Sukses", description: "Data pengantaran berhasil dihapus" })
      fetchData()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      company_id: "",
      period_id: "",
      guru_pendamping_id: "",
      tanggal_penjemputan: "",
      tanggal_pengantaran: "",
      status: "PLANNED",
      kelompok: ""
    })
  }

  const generateSuratPengajuan = (companyName: string) => {
    const template = `
SURAT PENGAJUAN PKL
SMK KRIAN 1
Jl. Kyai Mojo, Krian, Sidoarjo

Kepada Yth. Pimpinan
${companyName}

Dengan Hormat,
Kami sampaikan, bahwa pelaksanaan Praktik Kerja Lapangan (PKL) siswa SMK Krian 1 Sidoarjo akan dilaksanakan dalam 3 (tiga) bulan. Berkaitan dengan hal di atas, dengan ini kami ajukan permohonan izin Program Praktik Kerja Lapangan.

Untuk melaksanakan PKL di perusahaan ini, atas perhatian dan kerjasamanya kami sampaikan terimakasih.

Kepala SMK Krian 1
Dian Maharani, S.Pd., M.MPd

Ketua Pokja PKL  
Ahmad Ridho, S.Kom
`
    
    const element = document.createElement("a")
    const file = new Blob([template], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `Surat_Pengajuan_${companyName.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    toast({
      title: "Sukses",
      description: "Surat Pengajuan berhasil di-generate"
    })
  }

  const generateSuratTugas = (companyName: string, teacherName?: string) => {
    const template = `
SURAT TUGAS
SMK KRIAN 1
Nomor: 463.2/76 (N)/404.3.9/SMK KRIAN 1/R

MENUGASKAN:
Nama: ${teacherName || '[NAMA GURU]'}
NIP: [NIP GURU]  
Jabatan: Guru Pembimbing PKL

UNTUK:
Melaksanakan pembimbingan siswa PKL di ${companyName}
Periode: [TANGGAL MULAI] s/d [TANGGAL SELESAI]

Kepala SMK Krian 1
Dian Maharani, S.Pd., M.MPd
`
    
    const element = document.createElement("a")
    const file = new Blob([template], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `Surat_Tugas_${companyName.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    toast({
      title: "Sukses", 
      description: "Surat Tugas berhasil di-generate"
    })
  }

  const filteredData = pengantaran.filter(item =>
    item.companies?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kelompok?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pengantaran Siswa PKL</h1>
          <p className="text-muted-foreground">Kelola pengantaran siswa ke perusahaan</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingItem(null)
                resetForm()
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pengantaran
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Pengantaran" : "Tambah Pengantaran Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_id">Perusahaan *</Label>
                    <Select 
                      value={formData.company_id} 
                      onValueChange={(value) => setFormData({...formData, company_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Perusahaan" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="period_id">Periode *</Label>
                    <Select 
                      value={formData.period_id} 
                      onValueChange={(value) => setFormData({...formData, period_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Periode" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period.id} value={period.id}>
                            {period.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="guru_pendamping_id">Guru Pendamping</Label>
                    <Select 
                      value={formData.guru_pendamping_id} 
                      onValueChange={(value) => setFormData({...formData, guru_pendamping_id: value})}
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
                    <Label htmlFor="kelompok">Kelompok</Label>
                    <Input
                      id="kelompok"
                      value={formData.kelompok}
                      onChange={(e) => setFormData({...formData, kelompok: e.target.value})}
                      placeholder="Nama kelompok"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tanggal_penjemputan">Tanggal Penjemputan</Label>
                    <Input
                      id="tanggal_penjemputan"
                      type="date"
                      value={formData.tanggal_penjemputan}
                      onChange={(e) => setFormData({...formData, tanggal_penjemputan: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tanggal_pengantaran">Tanggal Pengantaran</Label>
                    <Input
                      id="tanggal_pengantaran"
                      type="date"
                      value={formData.tanggal_pengantaran}
                      onChange={(e) => setFormData({...formData, tanggal_pengantaran: e.target.value})}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLANNED">Direncanakan</SelectItem>
                        <SelectItem value="IN_PROGRESS">Sedang Berlangsung</SelectItem>
                        <SelectItem value="COMPLETED">Selesai</SelectItem>
                        <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : editingItem ? "Update" : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                PENGANTARAN
              </CardTitle>
              <CardDescription>
                Data pengantaran siswa ke perusahaan mitra
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama perusahaan atau kelompok..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border focus:border-primary focus:ring-primary"
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
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">PERUSAHAAN</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">PERIODE</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">GURU PENDAMPING</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">KELOMPOK</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">STATUS</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                          <td className="py-3 px-4 border-r border-border">
                            <span className="font-medium text-foreground">{item.companies?.nama}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            {item.pkl_periods?.nama}
                            <p className="text-xs">{item.pkl_periods?.start_date} - {item.pkl_periods?.end_date}</p>
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            {item.teachers?.nama || "-"}
                          </td>
                          <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                            {item.kelompok || "-"}
                          </td>
                          <td className="py-3 px-4 border-r border-border">
                            <Badge variant={
                              item.status === 'COMPLETED' ? 'default' : 
                              item.status === 'IN_PROGRESS' ? 'secondary' : 
                              item.status === 'CANCELLED' ? 'destructive' : 'outline'
                            }>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => generateSuratPengajuan(item.companies?.nama)}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => generateSuratTugas(item.companies?.nama, item.teachers?.nama)}
                              >
                                <Calendar className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredData.map((item) => (
                  <Card key={item.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{item.companies?.nama}</h3>
                          <p className="text-sm text-muted-foreground">{item.pkl_periods?.nama}</p>
                        </div>
                        <Badge variant={
                          item.status === 'COMPLETED' ? 'default' : 
                          item.status === 'IN_PROGRESS' ? 'secondary' : 
                          item.status === 'CANCELLED' ? 'destructive' : 'outline'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Guru Pendamping: </span>
                          <span className="text-foreground">{item.teachers?.nama || "-"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Kelompok: </span>
                          <span className="text-foreground">{item.kelompok || "-"}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(item)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateSuratPengajuan(item.companies?.nama)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateSuratTugas(item.companies?.nama, item.teachers?.nama)}
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada data pengantaran. Klik "Tambah Pengantaran" untuk menambah data.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Pengantaran