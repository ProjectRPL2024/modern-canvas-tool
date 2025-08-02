import jsPDF from 'jspdf';

export const generateSuratPengajuanPDF = (companyName: string, companyAddress?: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SURAT PENGAJUAN PKL", pageWidth / 2, 30, { align: "center" });
  
  doc.setFontSize(14);
  doc.text("SMK KRIAN 1", pageWidth / 2, 45, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Jl. Kyai Mojo, Krian, Sidoarjo", pageWidth / 2, 55, { align: "center" });
  doc.text("Telp. (031) 8961234", pageWidth / 2, 65, { align: "center" });
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 75, pageWidth - 20, 75);
  
  // Date
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });
  doc.text(`Sidoarjo, ${currentDate}`, pageWidth - 20, 90, { align: "right" });
  
  // Address
  doc.text("Kepada Yth.", 20, 110);
  doc.text(`Pimpinan ${companyName}`, 20, 120);
  if (companyAddress) {
    doc.text(companyAddress, 20, 130);
  }
  
  // Content
  doc.text("Dengan Hormat,", 20, 150);
  
  const content = [
    "Kami sampaikan, bahwa pelaksanaan Praktik Kerja Lapangan (PKL) siswa SMK Krian 1",
    "Sidoarjo akan dilaksanakan dalam 3 (tiga) bulan. Berkaitan dengan hal di atas, dengan ini",
    "kami ajukan permohonan izin Program Praktik Kerja Lapangan di perusahaan yang Bapak/Ibu",
    "pimpin.",
    "",
    "Adapun ketentuan pelaksanaan PKL adalah sebagai berikut:",
    "1. Waktu pelaksanaan: 3 bulan",
    "2. Jumlah siswa: akan ditentukan kemudian",
    "3. Bidang keahlian: sesuai dengan program studi siswa",
    "",
    "Untuk melaksanakan PKL di perusahaan ini, atas perhatian dan kerjasamanya kami",
    "sampaikan terima kasih."
  ];
  
  let yPosition = 165;
  content.forEach((line) => {
    doc.text(line, 20, yPosition);
    yPosition += 10;
  });
  
  // Signature
  doc.text("Kepala SMK Krian 1", pageWidth - 60, yPosition + 30, { align: "center" });
  doc.text("Dian Maharani, S.Pd., M.MPd", pageWidth - 60, yPosition + 70, { align: "center" });
  
  doc.text("Ketua Pokja PKL", 60, yPosition + 30, { align: "center" });
  doc.text("Ahmad Ridho, S.Kom", 60, yPosition + 70, { align: "center" });
  
  return doc;
};

export const generateSuratTugasPDF = (companyName: string, teacherName?: string, teacherNip?: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SURAT TUGAS", pageWidth / 2, 30, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("SMK KRIAN 1", pageWidth / 2, 45, { align: "center" });
  doc.text("Nomor: 463.2/76 (N)/404.3.9/SMK KRIAN 1/R", pageWidth / 2, 55, { align: "center" });
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 65, pageWidth - 20, 65);
  
  // Content
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("MENUGASKAN:", 20, 85);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Nama: ${teacherName || '[NAMA GURU]'}`, 20, 100);
  doc.text(`NIP: ${teacherNip || '[NIP GURU]'}`, 20, 110);
  doc.text("Jabatan: Guru Pembimbing PKL", 20, 120);
  
  doc.setFont("helvetica", "bold");
  doc.text("UNTUK:", 20, 140);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Melaksanakan pembimbingan siswa PKL di ${companyName}`, 20, 155);
  doc.text("Periode: [TANGGAL MULAI] s/d [TANGGAL SELESAI]", 20, 165);
  doc.text("Dengan ketentuan:", 20, 180);
  doc.text("1. Melakukan monitoring dan evaluasi siswa PKL", 30, 190);
  doc.text("2. Memberikan bimbingan sesuai dengan bidang keahlian", 30, 200);
  doc.text("3. Membuat laporan hasil pembimbingan", 30, 210);
  
  // Date and signature
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });
  doc.text(`Sidoarjo, ${currentDate}`, pageWidth - 20, 240, { align: "right" });
  doc.text("Kepala SMK Krian 1", pageWidth - 60, 260, { align: "center" });
  doc.text("Dian Maharani, S.Pd., M.MPd", pageWidth - 60, 280, { align: "center" });
  
  return doc;
};

export const generateSertifikatPDF = (studentData: {
  nama: string;
  nis: string;
  rombel: string;
  companyName: string;
  periode: string;
  nilai?: number;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Background border
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  doc.setLineWidth(1);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
  
  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SERTIFIKAT", pageWidth / 2, 50, { align: "center" });
  doc.text("PRAKTIK KERJA LAPANGAN", pageWidth / 2, 70, { align: "center" });
  
  doc.setFontSize(14);
  doc.text("SMK KRIAN 1 SIDOARJO", pageWidth / 2, 90, { align: "center" });
  
  // Content
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Diberikan kepada:", pageWidth / 2, 120, { align: "center" });
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(studentData.nama, pageWidth / 2, 140, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`NIS: ${studentData.nis}`, pageWidth / 2, 155, { align: "center" });
  doc.text(`Kelas: ${studentData.rombel}`, pageWidth / 2, 170, { align: "center" });
  
  doc.text("Yang telah menyelesaikan Praktik Kerja Lapangan di", pageWidth / 2, 190, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text(studentData.companyName, pageWidth / 2, 205, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.text(`Periode: ${studentData.periode}`, pageWidth / 2, 220, { align: "center" });
  
  if (studentData.nilai) {
    doc.text(`Dengan nilai: ${studentData.nilai.toFixed(2)}`, pageWidth / 2, 235, { align: "center" });
  }
  
  // Date and signature
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });
  
  doc.text(`Sidoarjo, ${currentDate}`, pageWidth - 40, 260, { align: "right" });
  doc.text("Kepala SMK Krian 1", pageWidth - 40, 275, { align: "right" });
  doc.text("Dian Maharani, S.Pd., M.MPd", pageWidth - 40, 290, { align: "right" });
  
  return doc;
};

export const generateLaporanPDF = (title: string, data: any[], columns: string[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, pageWidth / 2, 30, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("SMK KRIAN 1 SIDOARJO", pageWidth / 2, 45, { align: "center" });
  
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });
  doc.text(`Tanggal: ${currentDate}`, pageWidth / 2, 60, { align: "center" });
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 70, pageWidth - 20, 70);
  
  // Table headers
  let yPosition = 85;
  const columnWidth = (pageWidth - 40) / columns.length;
  
  doc.setFont("helvetica", "bold");
  columns.forEach((column, index) => {
    doc.text(column, 20 + (index * columnWidth), yPosition);
  });
  
  // Table data
  doc.setFont("helvetica", "normal");
  yPosition += 10;
  
  data.forEach((row, rowIndex) => {
    if (yPosition > 250) { // New page if needed
      doc.addPage();
      yPosition = 30;
    }
    
    columns.forEach((column, colIndex) => {
      const cellData = row[column.toLowerCase().replace(/\s+/g, '_')] || '';
      doc.text(String(cellData).substring(0, 20), 20 + (colIndex * columnWidth), yPosition);
    });
    
    yPosition += 10;
  });
  
  return doc;
};