-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nis VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  rombel VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create companies table (DU/DI)
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  alamat TEXT,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  nip VARCHAR(30),
  position VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PKL periods table
CREATE TABLE public.pkl_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  tahun_ajaran VARCHAR(20),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PKL placements table
CREATE TABLE public.pkl_placements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES public.pkl_periods(id) ON DELETE CASCADE,
  mentor_teacher_id UUID REFERENCES public.teachers(id),
  jenis_pkl VARCHAR(20) DEFAULT 'REGULER',
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student grades table
CREATE TABLE public.student_grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  placement_id UUID REFERENCES public.pkl_placements(id) ON DELETE CASCADE,
  aspek_penilaian VARCHAR(100),
  nilai DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  placement_id UUID REFERENCES public.pkl_placements(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- HADIR, SAKIT, IZIN, ALPHA
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentoring table
CREATE TABLE public.mentoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  placement_id UUID REFERENCES public.pkl_placements(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id),
  tanggal DATE NOT NULL,
  catatan_pembimbingan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monitoring/violations table
CREATE TABLE public.monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  placement_id UUID REFERENCES public.pkl_placements(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id),
  tanggal DATE NOT NULL,
  jenis_monitoring VARCHAR(50), -- MONITORING, PELANGGARAN
  catatan TEXT,
  tindak_lanjut TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pickup/delivery table
CREATE TABLE public.pickup_delivery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES public.pkl_periods(id) ON DELETE CASCADE,
  kelompok VARCHAR(10),
  guru_pendamping_id UUID REFERENCES public.teachers(id),
  tanggal_pengantaran DATE,
  tanggal_penjemputan DATE,
  status VARCHAR(20) DEFAULT 'PLANNED', -- PLANNED, DELIVERED, PICKED_UP
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  placement_id UUID REFERENCES public.pkl_placements(id) ON DELETE CASCADE,
  nomor_sertifikat VARCHAR(50),
  tanggal_terbit DATE,
  template_type VARCHAR(20), -- DEPAN, BELAKANG
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkl_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkl_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create public access policies (since this is a school management system)
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all operations on companies" ON public.companies FOR ALL USING (true);
CREATE POLICY "Allow all operations on teachers" ON public.teachers FOR ALL USING (true);
CREATE POLICY "Allow all operations on pkl_periods" ON public.pkl_periods FOR ALL USING (true);
CREATE POLICY "Allow all operations on pkl_placements" ON public.pkl_placements FOR ALL USING (true);
CREATE POLICY "Allow all operations on student_grades" ON public.student_grades FOR ALL USING (true);
CREATE POLICY "Allow all operations on attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow all operations on mentoring" ON public.mentoring FOR ALL USING (true);
CREATE POLICY "Allow all operations on monitoring" ON public.monitoring FOR ALL USING (true);
CREATE POLICY "Allow all operations on pickup_delivery" ON public.pickup_delivery FOR ALL USING (true);
CREATE POLICY "Allow all operations on certificates" ON public.certificates FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pkl_periods_updated_at BEFORE UPDATE ON public.pkl_periods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pkl_placements_updated_at BEFORE UPDATE ON public.pkl_placements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_grades_updated_at BEFORE UPDATE ON public.student_grades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentoring_updated_at BEFORE UPDATE ON public.mentoring FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_monitoring_updated_at BEFORE UPDATE ON public.monitoring FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pickup_delivery_updated_at BEFORE UPDATE ON public.pickup_delivery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.teachers (nama, nip, position) VALUES
('Mohrus, S.Sos., M.Pd', '196801011990031001', 'Guru Pembimbing'),
('Achyar Nur Sahid', '197205152005011003', 'Guru Pembimbing'),
('Hadi Purnomo', '198203102010011002', 'Guru Pembimbing');

INSERT INTO public.companies (nama, alamat, contact_person, phone) VALUES
('PT. SO GOOD FOOD', 'Sidoarjo', 'Manager HR', '031-8945678'),
('PT. TUNAS ABADI', 'Surabaya', 'Kepala Personalia', '031-7654321'),
('PT. ESDEKA PUTRA', 'Gresik', 'HRD Manager', '031-9876543'),
('PT. MERAKINDO', 'Sidoarjo', 'Staff HRD', '031-5432109'),
('CV. DWI PUTRI', 'Mojokerto', 'Koordinator', '0321-234567'),
('CV. SENTOSA', 'Surabaya', 'Manager', '031-8765432'),
('BENGKEL LUKMAN', 'Krian', 'Pemilik', '0321-876543'),
('CV. ADI JAYA', 'Sidoarjo', 'Supervisor', '031-3456789'),
('CV. LESTARI TECH', 'Gresik', 'HRD', '031-2345678');

INSERT INTO public.pkl_periods (nama, start_date, end_date, tahun_ajaran, is_active) VALUES
('PKL Semester Genap 2024/2025', '2025-01-02', '2025-05-31', '2024/2025', true);

INSERT INTO public.students (nis, nama, rombel) VALUES
('18318', 'DAVID ALEXANDER', 'XII-RPL-1'),
('18434', 'WIDIANT KARIN', 'XII-BR-1'),
('18463', 'AHMAD SAIFUL', 'XII-TTL-1'),
('18483', 'BAYU ATI PRATAMA', 'XII-TTL-1'),
('18679', 'ACHMAD ZAFAR', 'XII-TPM-1'),
('18764', 'BUDI TRIANTO', 'XII-TPM-2'),
('19000', 'MUHAMMAD HASAN', 'XII-TPM-6'),
('19092', 'RYAN FAJAR H.', 'XII-TPM-8'),
('19547', 'AINUL YAKIN', 'XII-TPM-1'),
('19555', 'ALDAN DIAS', 'XII-TPM-1'),
('19590', 'BOBBY EDO FERNANDA', 'XII-TPM-2'),
('19651', 'GALANG RAMADHANI', 'XII-TPM-3'),
('19687', 'LUCKY PIBRANY', 'XII-TPM-4'),
('19695', 'M. FADIL KHUSNUL', 'XII-TPM-4'),
('19697', 'M. HIDAYATUL', 'XII-TPM-4'),
('19752', 'MOCHAMMAD', 'XII-TPM-5'),
('19769', 'MOH. FIRMAN', 'XII-TPM-5');