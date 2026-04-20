-- ============================================================
-- AniTrack – Complete Supabase Schema Setup
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROFILES (extended auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  username    text unique,
  avatar_url  text,
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Only create trigger if it doesn't exist
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end $$;

-- 2. ANIME LIST (core tracking table)
drop table if exists public.anime_list cascade;

create table public.anime_list (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users on delete cascade not null,
  anime_id         integer not null,
  anime_title      text not null,
  anime_image_url  text,
  genres           text[] default '{}',
  status           text not null default 'plan_to_watch',
  episodes_watched integer not null default 0,
  total_episodes   integer,
  score            integer,
  updated_at       timestamptz default now(),

  unique(user_id, anime_id)
);

alter table public.anime_list enable row level security;

drop policy if exists "Users can view own anime list" on public.anime_list;
create policy "Users can view own anime list"
  on public.anime_list for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own anime list" on public.anime_list;
create policy "Users can insert own anime list"
  on public.anime_list for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own anime list" on public.anime_list;
create policy "Users can update own anime list"
  on public.anime_list for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own anime list" on public.anime_list;
create policy "Users can delete own anime list"
  on public.anime_list for delete using (auth.uid() = user_id);

-- 3. ACTIVITIES (social feed)
create table if not exists public.activities (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users on delete cascade not null,
  anime_id     integer not null,
  anime_title  text not null,
  action_type  text not null,
  details      text,
  created_at   timestamptz default now()
);

alter table public.activities enable row level security;

drop policy if exists "Activities are viewable by everyone" on public.activities;
create policy "Activities are viewable by everyone"
  on public.activities for select using (true);

drop policy if exists "Users can insert own activities" on public.activities;
create policy "Users can insert own activities"
  on public.activities for insert with check (auth.uid() = user_id);

-- 4. FOLLOWS (social graph)
create table if not exists public.follows (
  id           uuid default gen_random_uuid() primary key,
  follower_id  uuid references auth.users on delete cascade not null,
  following_id uuid references auth.users on delete cascade not null,
  created_at   timestamptz default now(),

  unique(follower_id, following_id)
);

alter table public.follows enable row level security;

drop policy if exists "Follows are viewable by everyone" on public.follows;
create policy "Follows are viewable by everyone"
  on public.follows for select using (true);

drop policy if exists "Users can manage own follows" on public.follows;
create policy "Users can manage own follows"
  on public.follows for insert with check (auth.uid() = follower_id);

drop policy if exists "Users can unfollow" on public.follows;
create policy "Users can unfollow"
  on public.follows for delete using (auth.uid() = follower_id);

-- 5. MAL CREDENTIALS (OAuth tokens)
create table if not exists public.mal_credentials (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users on delete cascade not null unique,
  access_token  text not null,
  refresh_token text not null,
  expires_at    timestamptz not null,
  updated_at    timestamptz default now()
);

alter table public.mal_credentials enable row level security;

drop policy if exists "Users can view own MAL credentials" on public.mal_credentials;
create policy "Users can view own MAL credentials"
  on public.mal_credentials for select using (auth.uid() = user_id);

drop policy if exists "Users can upsert own MAL credentials" on public.mal_credentials;
create policy "Users can upsert own MAL credentials"
  on public.mal_credentials for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own MAL credentials" on public.mal_credentials;
create policy "Users can update own MAL credentials"
  on public.mal_credentials for update using (auth.uid() = user_id);

-- ============================================================
-- Done! Reload the Supabase schema cache:
--   Settings → API → Reload schema cache
-- ============================================================
