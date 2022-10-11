
drop table if exists profiles;

create table profiles (
  id uuid references auth.users not null,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  username text unique NOT NULL,
  avatar_url text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profiles
    OWNER to supabase_admin;

ALTER TABLE IF EXISTS public.profiles
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.profiles TO anon;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO postgres;

GRANT ALL ON TABLE public.profiles TO service_role;

GRANT ALL ON TABLE public.profiles TO supabase_admin;


drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user;

-- inserts a row into public.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- POLICY: Enable select for authenticated users

drop policy if exists "Enable select for authenticated users" on public.profiles;

create policy "Enable select for authenticated users"
    on public.profiles
    as PERMISSIVE
    FOR select
    to authenticated
    using (true);

-- POLICY: Enable update for authenticated users on user_id

drop policy if exists "Enable update for authenticated users on user_id" on public.profiles;

create policy "Enable update for authenticated users on user_id"
    on public.profiles
    as PERMISSIVE
    FOR update
    to authenticated
    using ((id = auth.uid()))
    with check ((id = auth.uid()));