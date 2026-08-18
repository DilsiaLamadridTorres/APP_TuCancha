-- TuCancha · primera tabla de perfiles de usuario (Supabase / PostgreSQL)
-- Ejecuta este archivo completo en Supabase: SQL Editor > New query > Run.
-- Las contraseñas NO se guardan aquí: Supabase Auth las almacena de forma segura.

create table if not exists public.usuarios (
    id uuid primary key references auth.users (id) on delete cascade,
    nombre_completo varchar(120) not null check (char_length(trim(nombre_completo)) >= 3),
    correo varchar(255) not null unique check (correo = lower(correo)),
    telefono varchar(20),
    creado_en timestamptz not null default now(),
    actualizado_en timestamptz not null default now()
);

alter table public.usuarios enable row level security;

drop policy if exists "Usuarios pueden ver su propio perfil" on public.usuarios;
create policy "Usuarios pueden ver su propio perfil"
on public.usuarios for select
to authenticated
using ((select auth.uid()) = id);

create or replace function public.crear_perfil_usuario()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.usuarios (id, nombre_completo, correo, telefono)
    values (
        new.id,
        trim(coalesce(new.raw_user_meta_data ->> 'nombre_completo', '')),
        lower(new.email),
        nullif(trim(coalesce(new.raw_user_meta_data ->> 'telefono', '')), '')
    );
    return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
    after insert on auth.users
    for each row execute procedure public.crear_perfil_usuario();
