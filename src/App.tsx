import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Konfigurasi from "./pages/Konfigurasi";
import DataPKL from "./pages/DataPKL";
import BrowseSiswa from "./pages/BrowseSiswa";
import NilaiSiswa from "./pages/NilaiSiswa";
import CetakSertifikat from "./pages/CetakSertifikat";
import Pengantaran from "./pages/Pengantaran";
import Presensi from "./pages/Presensi";
import Penilaian from "./pages/Penilaian";
import Pembimbingan from "./pages/Pembimbingan";
import Monitoring from "./pages/Monitoring";
import LaporanRekapPKL from "./pages/LaporanRekapPKL";
import LaporanRekapSiswa from "./pages/LaporanRekapSiswa";
import RekapByKategori from "./pages/RekapByKategori";
import LaporanMonitoring from "./pages/LaporanMonitoring";
import LaporanPelanggaran from "./pages/LaporanPelanggaran";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/konfigurasi" element={<Layout><Konfigurasi /></Layout>} />
          <Route path="/data-pkl" element={<Layout><DataPKL /></Layout>} />
          <Route path="/browse-siswa" element={<Layout><BrowseSiswa /></Layout>} />
          <Route path="/nilai-siswa" element={<Layout><NilaiSiswa /></Layout>} />
          <Route path="/cetak-sertifikat" element={<Layout><CetakSertifikat /></Layout>} />
          <Route path="/pengantaran" element={<Layout><Pengantaran /></Layout>} />
          <Route path="/presensi" element={<Layout><Presensi /></Layout>} />
          <Route path="/penilaian" element={<Layout><Penilaian /></Layout>} />
          <Route path="/pembimbingan" element={<Layout><Pembimbingan /></Layout>} />
          <Route path="/monitoring" element={<Layout><Monitoring /></Layout>} />
          <Route path="/laporan-rekap-pkl" element={<Layout><LaporanRekapPKL /></Layout>} />
          <Route path="/laporan-rekap-siswa" element={<Layout><LaporanRekapSiswa /></Layout>} />
          <Route path="/rekap-by-kategori" element={<Layout><RekapByKategori /></Layout>} />
          <Route path="/laporan-monitoring" element={<Layout><LaporanMonitoring /></Layout>} />
          <Route path="/laporan-pelanggaran" element={<Layout><LaporanPelanggaran /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
