# Database Setup – Pet Health Companion

## Agent Task
You must create the database schema for a pet health web app using Supabase (PostgreSQL). Authentication is handled by Clerk – all user references are Clerk IDs stored as `text`. User roles (`pet_owner`, `support`, `admin`) come from Clerk’s JWT via a `app_role` claim.

## What to Do
1. Update the migration file `supabase/migrations/20260711183216_initial_schema.sql` with the exact SQL provided below.
2. Create a seed file `supabase/seed.sql` with the breed insert statements provided.

## Migration SQL
```sql
-- ============================================================
-- Initial schema for Pet Health Companion
-- ============================================================

-- Helper: extract user role from Clerk JWT
create or replace function public.get_my_role()
returns text
language sql stable
as $$
  select coalesce(auth.jwt() ->> 'app_role', 'pet_owner');
$$;

-- Breeds (reference table, public read)
create table public.breeds (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  species text not null check (species in ('dog','cat')),
  care_food text not null,
  care_exercise text not null,
  care_sleep text not null,
  care_health_notes text not null
);

-- Pets
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  name text not null,
  species text not null check (species in ('dog','cat','other')),
  breed_id uuid references public.breeds(id) on delete set null,
  age real,
  age_unit text check (age_unit in ('years','months')),
  weight_kg real,
  photo_url text,
  created_at timestamptz not null default now()
);
create index idx_pets_owner on public.pets(owner_id);

-- Health Scans
create table public.health_scans (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  scan_type text not null check (scan_type in ('initial','health_check','manual')),
  photo_url text not null,
  raw_response jsonb not null,
  primary_breed_id uuid references public.breeds(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_health_scans_pet on public.health_scans(pet_id);

-- Pet Events
create table public.pet_events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  title text not null,
  description text,
  event_type text not null check (event_type in ('play','bath','vaccination','vet_visit','grooming','feeding','custom')),
  scheduled_at timestamptz not null,
  is_ai_generated boolean not null default false,
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_pet_events_pet on public.pet_events(pet_id);
create index idx_pet_events_scheduled on public.pet_events(scheduled_at);

-- Tickets
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  description text not null,
  status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  created_by text not null,
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_tickets_created_by on public.tickets(created_by);
create index idx_tickets_assigned_to on public.tickets(assigned_to);
create index idx_tickets_status on public.tickets(status);

-- Auto-update updated_at
create or replace function public.update_modified_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_timestamp
  before update on public.tickets
  for each row execute function public.update_modified_column();

-- Ticket Messages
create table public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  sender_id text not null,
  content text not null,
  created_at timestamptz not null default now()
);
create index idx_ticket_messages_ticket on public.ticket_messages(ticket_id);

-- Vets
create table public.vets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  address text,
  rating real check (rating >= 0 and rating <= 5),
  specialization text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Enable RLS
-- ============================================================
alter table public.pets enable row level security;
alter table public.health_scans enable row level security;
alter table public.pet_events enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.vets enable row level security;

-- ============================================================
-- Policies
-- ============================================================

-- Pets
create policy "Owners can view their pets" on public.pets
  for select using ( owner_id = auth.uid() );
create policy "Support and admins can view all pets" on public.pets
  for select using ( get_my_role() in ('support', 'admin') );
create policy "Owners can insert pets" on public.pets
  for insert with check ( owner_id = auth.uid() );
create policy "Owners can update their pets" on public.pets
  for update using ( owner_id = auth.uid() ) with check ( owner_id = auth.uid() );
create policy "Owners can delete their pets" on public.pets
  for delete using ( owner_id = auth.uid() );

-- Health Scans
create policy "Owners can view scans" on public.health_scans
  for select using (
    exists ( select 1 from public.pets where pets.id = health_scans.pet_id and pets.owner_id = auth.uid() )
  );
create policy "Support and admins can view all scans" on public.health_scans
  for select using ( get_my_role() in ('support', 'admin') );
create policy "Owners can insert scans" on public.health_scans
  for insert with check (
    exists ( select 1 from public.pets where pets.id = health_scans.pet_id and pets.owner_id = auth.uid() )
  );

-- Pet Events
create policy "Owners can manage events" on public.pet_events
  for all using (
    exists ( select 1 from public.pets where pets.id = pet_events.pet_id and pets.owner_id = auth.uid() )
  ) with check (
    exists ( select 1 from public.pets where pets.id = pet_events.pet_id and pets.owner_id = auth.uid() )
  );
create policy "Support and admins can view all events" on public.pet_events
  for select using ( get_my_role() in ('support', 'admin') );

-- Tickets
create policy "Users can view own tickets" on public.tickets
  for select using ( created_by = auth.uid() );
create policy "Support can view assigned or open tickets" on public.tickets
  for select using (
    get_my_role() in ('support', 'admin') and (assigned_to = auth.uid() or status = 'open')
  );
create policy "Users can create tickets" on public.tickets
  for insert with check ( created_by = auth.uid() );
create policy "Users can update own tickets" on public.tickets
  for update using ( created_by = auth.uid() ) with check ( created_by = auth.uid() );
create policy "Support can update assigned tickets" on public.tickets
  for update using (
    get_my_role() in ('support', 'admin') and (assigned_to = auth.uid() or get_my_role() = 'admin')
  );

-- Ticket Messages
create policy "Participants can view messages" on public.ticket_messages
  for select using (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_messages.ticket_id
        and (tickets.created_by = auth.uid() or tickets.assigned_to = auth.uid())
    ) or get_my_role() = 'admin'
  );
create policy "Participants can insert messages" on public.ticket_messages
  for insert with check (
    sender_id = auth.uid() and (
      exists (
        select 1 from public.tickets
        where tickets.id = ticket_messages.ticket_id
          and (tickets.created_by = auth.uid() or tickets.assigned_to = auth.uid())
      ) or get_my_role() = 'admin'
    )
  );

-- Vets
create policy "All users can view vets" on public.vets
  for select using ( auth.role() = 'authenticated' );
create policy "Admins can manage vets" on public.vets
  for all using ( get_my_role() = 'admin' ) with check ( get_my_role() = 'admin' );