-- CraftCV by Bot&Guy Standalone Database Migration Script

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Create Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  phone text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 3. Create Resumes Table
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'My Resume',
  content jsonb not null default '{
    "personalInfo": {"fullName": "", "email": "", "phone": "", "location": "", "website": "", "linkedIn": "", "jobTitle": "", "summary": ""},
    "experience": [],
    "education": [],
    "projects": [],
    "skills": [],
    "certifications": []
  }'::jsonb,
  template text not null default 'minimal',
  is_paid boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Resumes
alter table public.resumes enable row level security;

-- Resumes RLS Policies
create policy "Allow users to select their own resumes"
  on public.resumes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Allow users to insert their own resumes"
  on public.resumes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Allow users to update their own resumes"
  on public.resumes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Allow users to delete their own resumes"
  on public.resumes for delete
  to authenticated
  using (auth.uid() = user_id);

-- 4. Trigger to handle new user profile creation automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
