import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, FileText, Filter } from "lucide-react"

const DataPKL = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const pklData = [
    { id: 1, jenis: "REGULER", nama: "Achyar Nur Sahid", periode: "04/02/2025 - 30/06/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 1 },
    { id: 2, jenis: "REGULER", nama: "Achyar Nur Sahid", periode: "31/01/2025 - 31/05/2025", guru: "Achyar Nur Sahid", jumlahSiswa: 1 },
    { id: 3, jenis: "REGULER", nama: "Hadi Purnomo", periode: "28/01/2025 - 31/05/2025", guru: "Hadi Purnomo", jumlahSiswa: 1 },
    { id: 4, jenis: "REGULER", nama: "Muhammad S.Sos, M.Pd", periode: "20/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 1 },
    { id: 5, jenis: "REGULER", nama: "Ahmad Ridho, S.Kom", periode: "06/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 2 },
    { id: 6, jenis: "REGULER", nama: "Dian Maharani, S.Pd", periode: "02/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 2 },
    { id: 7, jenis: "REGULER", nama: "Siti Aminah", periode: "02/01/2025 - 31/05/2025", guru: "Hadi Purnomo", jumlahSiswa: 1 },
    { id: 8, jenis: "REGULER", nama: "Budi Santoso", periode: "02/01/2025 - 31/05/2025", guru: "Hadi Purnomo", jumlahSiswa: 2 },
    { id: 9, jenis: "REGULER", nama: "Dewi Sartika", periode: "02/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 1 },
    { id: 10, jenis: "REGULER", nama: "Rudi Hartono", periode: "02/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 1 },
    { id: 11, jenis: "REGULER", nama: "Maya Sari", periode: "02/01/2025 - 31/05/2025", guru: "Achyar Nur Sahid", jumlahSiswa: 4 },
    { id: 12, jenis: "REGULER", nama: "Andi Wijaya", periode: "02/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 4 },
    { id: 13, jenis: "REGULER", nama: "Linda Kusuma", periode: "02/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 4 },
    { id: 14, jenis: "REGULER", nama: "Toni Setiawan", periode: "02/01/2025 - 31/05/2025", guru: "Achyar Nur Sahid", jumlahSiswa: 4 },
    { id: 15, jenis: "REGULER", nama: "Rina Melati", periode: "02/01/2025 - 31/05/2025", guru: "Hadi Purnomo", jumlahSiswa: 6 },
    { id: 16, jenis: "REGULER", nama: "Joko Susilo", periode: "02/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 3 },
    { id: 17, jenis: "REGULER", nama: "Sri Wahyuni", periode: "02/01/2025 - 31/05/2025", guru: "Hadi Purnomo", jumlahSiswa: 7 },
    { id: 18, jenis: "REGULER", nama: "Bambang Utomo", periode: "02/01/2025 - 31/05/2025", guru: "Mohrus, S.Sos., M.Pd", jumlahSiswa: 6 },
    { id: 19, jenis: "REGULER", nama: "Fitri Handayani", periode: "02/01/2025 - 31/05/2025", guru: "Hadi Purnomo", jumlahSiswa: 6 },
    { id: 20, jenis: "REGULER", nama: "Agus Prasetyo", periode: "02/01/2025 - 31/05/2025", guru: "Hadi Purnomo", jumlahSiswa: 2 },
  ]

  const filteredData = pklData.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.guru.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const itemsPerPage = 20
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data PKL/PRAKERIN</h1>
          <p className="text-muted-foreground">Kelola data siswa praktik kerja lapangan</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                DATA PKL/PRAKERIN
              </CardTitle>
              <CardDescription>
                (** SEMUA JENIS PKL) (*** SEMUA AREA/KECAMATAN ***)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Del
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama siswa atau guru pembimbing..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border focus:border-primary focus:ring-primary"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">JENIS PKL</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">NAM</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">PERIODE</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm border-r border-border">GURU PEMBIMBING</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">JML SISWA</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.map((item, index) => (
                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
                      <td className="py-3 px-4 border-r border-border">
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          {item.jenis}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 border-r border-border">
                        <span className="font-medium text-foreground">{item.nama}</span>
                      </td>
                      <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                        {item.periode}
                      </td>
                      <td className="py-3 px-4 border-r border-border text-sm text-muted-foreground">
                        {item.guru}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="border-primary text-primary">
                          {item.jumlahSiswa}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Displaying 1 - {Math.min(itemsPerPage, filteredData.length)} of {filteredData.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataPKL