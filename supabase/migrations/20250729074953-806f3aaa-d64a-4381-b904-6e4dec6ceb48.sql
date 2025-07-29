-- Add category field to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS kategori character varying;

-- Add violations table for student violations
CREATE TABLE IF NOT EXISTS public.violations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL,
  placement_id uuid,
  teacher_id uuid,
  tanggal date NOT NULL,
  jenis_pelanggaran character varying,
  deskripsi text,
  sanksi text,
  status character varying DEFAULT 'OPEN',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on violations table
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;

-- Create policy for violations
CREATE POLICY "Allow all operations on violations" 
ON public.violations 
FOR ALL 
USING (true);

-- Add trigger for violations updated_at
CREATE TRIGGER update_violations_updated_at
  BEFORE UPDATE ON public.violations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add district/kecamatan field to companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS kecamatan character varying;

-- Update sample companies with categories and districts
UPDATE public.companies 
SET kategori = CASE 
  WHEN random() < 0.33 THEN 'Teknologi'
  WHEN random() < 0.66 THEN 'Manufaktur'
  ELSE 'Perdagangan'
END,
kecamatan = CASE 
  WHEN random() < 0.5 THEN 'Krian'
  ELSE 'Sidoarjo'
END;

-- Insert sample violations
INSERT INTO public.violations (student_id, placement_id, teacher_id, tanggal, jenis_pelanggaran, deskripsi, sanksi)
SELECT 
  s.id,
  pl.id,
  pl.mentor_teacher_id,
  CURRENT_DATE - INTERVAL '5 days',
  CASE 
    WHEN random() < 0.33 THEN 'Keterlambatan'
    WHEN random() < 0.66 THEN 'Tidak Hadir'
    ELSE 'Pelanggaran Tata Tertib'
  END,
  'Deskripsi pelanggaran siswa',
  CASE 
    WHEN random() < 0.5 THEN 'Teguran Lisan'
    ELSE 'Teguran Tertulis'
  END
FROM public.students s
JOIN public.pkl_placements pl ON s.id = pl.student_id
WHERE random() < 0.3
LIMIT 5;