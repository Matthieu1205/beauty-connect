-- =============================================
-- BeautyConnect — Schéma Supabase
-- Coller dans : Supabase > SQL Editor > New query
-- =============================================

-- Profils utilisateurs (extension de auth.users)
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  nom         text not null,
  telephone   text,
  role        text not null default 'cliente' check (role in ('cliente', 'salon', 'admin')),
  created_at  timestamptz default now()
);

-- Salons
create table public.salons (
  id          bigint primary key generated always as identity,
  nom         text not null,
  commune     text not null,
  quartier    text not null,
  description text,
  lat         double precision,
  lng         double precision,
  c1          text default '#6E1E33',
  c2          text default '#C9A24B',
  note        numeric(3,1) default 0,
  nb_avis     integer default 0,
  prix_min    integer default 0,
  types       text[] default '{}',
  owner_id    uuid references public.profiles(id),
  valide      boolean default false,
  created_at  timestamptz default now()
);

-- Services / Prestations par salon
create table public.services (
  id          bigint primary key generated always as identity,
  salon_id    bigint not null references public.salons(id) on delete cascade,
  nom         text not null,
  prix        integer not null,
  duree       text not null,
  actif       boolean default true
);

-- Réservations
create table public.bookings (
  id          bigint primary key generated always as identity,
  salon_id    bigint not null references public.salons(id),
  service_id  bigint references public.services(id),
  client_id   uuid not null references public.profiles(id),
  date_rdv    date not null,
  heure_rdv   time not null,
  statut      text default 'en_attente' check (statut in ('en_attente', 'confirme', 'annule', 'termine')),
  montant     integer,
  created_at  timestamptz default now()
);

-- Avis clients
create table public.reviews (
  id          bigint primary key generated always as identity,
  salon_id    bigint not null references public.salons(id) on delete cascade,
  client_id   uuid not null references public.profiles(id),
  booking_id  bigint references public.bookings(id),
  note        integer not null check (note between 1 and 5),
  commentaire text,
  created_at  timestamptz default now(),
  unique (booking_id)
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

alter table public.profiles  enable row level security;
alter table public.salons     enable row level security;
alter table public.services   enable row level security;
alter table public.bookings   enable row level security;
alter table public.reviews    enable row level security;

-- Profiles : chacun voit et modifie son propre profil
create policy "Lecture profil perso"   on public.profiles for select using (auth.uid() = id);
create policy "Mise à jour profil"     on public.profiles for update using (auth.uid() = id);
create policy "Création profil"        on public.profiles for insert with check (auth.uid() = id);
-- Gérant peut lire les profils de ses clientes (pour afficher nom/tel dans le dashboard)
create policy "Profiles lecture par gerant" on public.profiles for select
  using (exists (
    select 1 from public.bookings b
    join public.salons s on s.id = b.salon_id
    where b.client_id = profiles.id and s.owner_id = auth.uid()
  ));

-- Salons : lecture publique, écriture réservée au propriétaire
create policy "Salons lecture publique"  on public.salons for select using (true);
create policy "Salon modif owner"        on public.salons for update using (auth.uid() = owner_id);
create policy "Salon insert owner"       on public.salons for insert with check (auth.uid() = owner_id);

-- Services : lecture publique, écriture par le propriétaire du salon
create policy "Services lecture publique" on public.services for select using (true);
create policy "Services modif"            on public.services for all
  using (exists (select 1 from public.salons where id = salon_id and owner_id = auth.uid()));

-- Réservations : visible par le client ou le salon concerné
create policy "Booking client"  on public.bookings for select using (auth.uid() = client_id);
create policy "Booking salon"   on public.bookings for select
  using (exists (select 1 from public.salons where id = salon_id and owner_id = auth.uid()));
create policy "Booking create"  on public.bookings for insert with check (auth.uid() = client_id);
create policy "Booking update"        on public.bookings for update using (auth.uid() = client_id);
create policy "Booking update salon"  on public.bookings for update
  using (exists (select 1 from public.salons where id = salon_id and owner_id = auth.uid()));

-- Avis : lecture publique, écriture par le client
create policy "Reviews lecture" on public.reviews for select using (true);
create policy "Reviews insert"  on public.reviews for insert with check (auth.uid() = client_id);

-- =============================================
-- Accès admin (role = 'admin')
-- Utiliser une fonction security definer pour éviter la récursion RLS sur profiles
-- =============================================

create or replace function public.is_admin()
returns boolean language plpgsql security definer as $$
begin
  return exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
end;
$$;

-- Admin voit tous les profils
create policy "Admin profiles select" on public.profiles for select using (public.is_admin());
-- Admin voit toutes les réservations
create policy "Admin bookings select" on public.bookings for select using (public.is_admin());
-- Admin peut modifier toutes les réservations
create policy "Admin bookings update" on public.bookings for update using (public.is_admin());
-- Admin peut modifier tous les salons (valider/refuser)
create policy "Admin salons update"   on public.salons for update using (public.is_admin());
-- Admin peut supprimer un salon (refus définitif)
create policy "Admin salons delete"   on public.salons for delete using (public.is_admin());

-- =============================================
-- Trigger : créer un profil automatiquement à l'inscription
-- =============================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, nom, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nom', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'cliente')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- Trigger : recalculer la note du salon après un avis
-- =============================================

create or replace function public.update_salon_note()
returns trigger language plpgsql as $$
begin
  update public.salons set
    note     = (select round(avg(note)::numeric, 1) from public.reviews where salon_id = new.salon_id),
    nb_avis  = (select count(*) from public.reviews where salon_id = new.salon_id)
  where id = new.salon_id;
  return new;
end;
$$;

create trigger after_review_insert
  after insert on public.reviews
  for each row execute function public.update_salon_note();

-- =============================================
-- Données de démo (6 salons initiaux)
-- =============================================

insert into public.salons (nom, commune, quartier, description, lat, lng, c1, c2, note, nb_avis, prix_min, types, valide)
values
  ('Maison Awa',    'Cocody',     'Riviera Golf',  'Institut haut de gamme spécialisé dans les tresses fines et les soins capillaires premium.', 5.3599, -3.9803, '#6E1E33', '#C9A24B', 4.9, 214, 3000,  array['Tresses','Locks','Coupe','Coloration'], true),
  ('Studio Nappy',  'Marcory',    'Zone 4',        'Spécialiste du cheveu naturel et des locks entretenus avec produits bio.',                    5.3002, -3.9950, '#872A42', '#D7B968', 4.7, 168, 2500,  array['Braids','Locks','Défrisage'],          true),
  ('Belle Époque',  'Plateau',    'Centre',        'Salon élégant au cœur du Plateau, expert en colorations et poses de perruques.',              5.3247, -4.0218, '#511325', '#E7D29A', 4.8, 301, 4000,  array['Coloration','Coupe','Perruques'],      true),
  ('Tresses & Co',  'Yopougon',   'Selmer',        'Le rendez-vous des tresses africaines, rapide et soigné, à prix accessible.',                 5.3450, -4.0850, '#3D0E1C', '#C9A24B', 4.6, 142, 2000,  array['Tresses','Braids','Défrisage'],        true),
  ('Salon Royal',   'Cocody',     'Angré',         'Expérience luxe : perruques sur mesure et colorations signature.',                            5.3960, -3.9840, '#511325', '#D7B968', 4.9, 256, 5000,  array['Perruques','Coloration','Coupe'],      true),
  ('Afro Glam',     'Bingerville','Centre-ville',  'Ambiance chaleureuse et coiffures afro tendance pour toute occasion.',                        5.3550, -3.8860, '#872A42', '#C9A24B', 4.5,  98, 2500,  array['Locks','Tresses','Coupe'],             true);

insert into public.services (salon_id, nom, prix, duree)
values
  (1, 'Tresses',    10000, '2h'),    (1, 'Locks',      15000, '3h'),    (1, 'Coupe',   3000, '30 min'), (1, 'Coloration', 14000, '2h'),
  (2, 'Braids',     12000, '2h30'),  (2, 'Locks',      15000, '3h'),    (2, 'Défrisage', 7000, '1h'),
  (3, 'Coloration', 14000, '2h'),    (3, 'Coupe',       3000, '30 min'),(3, 'Perruques', 18000, '1h30'),
  (4, 'Tresses',    10000, '2h'),    (4, 'Braids',     12000, '2h30'),  (4, 'Défrisage', 7000, '1h'),
  (5, 'Perruques',  18000, '1h30'),  (5, 'Coloration', 14000, '2h'),    (5, 'Coupe',   3000, '30 min'),
  (6, 'Locks',      15000, '3h'),    (6, 'Tresses',    10000, '2h'),    (6, 'Coupe',   3000, '30 min');
