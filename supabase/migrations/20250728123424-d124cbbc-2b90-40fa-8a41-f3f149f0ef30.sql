-- Fix search path for the update function by replacing it properly
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add sample PKL placements
INSERT INTO public.pkl_placements (student_id, company_id, period_id, mentor_teacher_id, start_date, end_date) 
SELECT 
  s.id,
  c.id,
  p.id,
  t.id,
  '2025-01-02'::date,
  '2025-05-31'::date
FROM public.students s
CROSS JOIN (SELECT id FROM public.companies LIMIT 1) c
CROSS JOIN (SELECT id FROM public.pkl_periods WHERE is_active = true LIMIT 1) p
CROSS JOIN (SELECT id FROM public.teachers LIMIT 1) t
LIMIT 17;

-- Add sample grades
INSERT INTO public.student_grades (student_id, placement_id, aspek_penilaian, nilai)
SELECT 
  s.id,
  pl.id,
  'Nilai Akhir',
  80.0 + (RANDOM() * 20)
FROM public.students s
JOIN public.pkl_placements pl ON s.id = pl.student_id;