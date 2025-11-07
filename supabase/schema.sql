create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.search_conditions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  city_id text not null,
  station_id text,
  rent_max numeric,
  area_min integer,
  area_max integer,
  madori text,
  walk_minutes integer,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.real_estate_agents (
  id uuid primary key,
  company_name text not null,
  email text not null unique,
  is_approved boolean default false,
  service_city_ids text[],
  service_station_ids text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  search_condition_id uuid references public.search_conditions(id) on delete cascade,
  agent_id uuid references public.real_estate_agents(id) on delete cascade,
  is_viewed boolean default false,
  viewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_search_conditions_user on public.search_conditions(user_id);
create index if not exists idx_leads_agent on public.leads(agent_id);
create index if not exists idx_leads_condition on public.leads(search_condition_id);
