create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.profiles is 'Public user profiles extending Supabase auth. Contains username, display info, and privacy settings.';

alter table public.profiles enable row level security;
