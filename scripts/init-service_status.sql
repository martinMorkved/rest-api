-- Run this in Supabase SQL Editor (API-drift-status project)
-- Creates the single-row service_status table and optional updated_at trigger

create table if not exists public.service_status (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'ok' check (status in ('ok', 'maintenance', 'outage')),
  message text not null default '',
  expected_downtime text,
  updated_at timestamptz not null default now()
);

-- Trigger to auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists service_status_updated_at on public.service_status;
create trigger service_status_updated_at
  before update on public.service_status
  for each row execute function public.set_updated_at();

-- Insert the single global status row (fixed id so API can always update this row)
insert into public.service_status (id, status, message, expected_downtime)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'ok', 'Alt fungerer som normalt.', null)
on conflict (id) do nothing;
