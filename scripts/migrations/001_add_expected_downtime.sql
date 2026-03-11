-- Kjør i Supabase SQL Editor hvis tabellen allerede finnes
-- Legger til kolonne for forventet nedetid (fri tekst, f.eks. "21:00–22:00" eller "Inntil 23:00")

alter table public.service_status
  add column if not exists expected_downtime text;
