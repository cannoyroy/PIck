-- A disposable engineering check, not a mentor/domain data model.
begin;

create table public.foundation_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  content text not null check (char_length(btrim(content)) between 1 and 200),
  created_at timestamptz not null default now()
);

create index foundation_checks_user_created_idx
  on public.foundation_checks (user_id, created_at desc);

alter table public.foundation_checks enable row level security;
revoke all on table public.foundation_checks from public, anon, authenticated;
grant select, insert, delete on table public.foundation_checks to authenticated;

create policy "Read own check records"
  on public.foundation_checks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Create own check records"
  on public.foundation_checks for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Delete own check records"
  on public.foundation_checks for delete to authenticated
  using ((select auth.uid()) = user_id);

-- No UPDATE grant or policy: even the owner cannot change a record's ownership.
commit;
