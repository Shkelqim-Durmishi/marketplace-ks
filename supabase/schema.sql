create type public.user_role as enum (
  'BUYER',
  'SELLER',
  'DEALER',
  'BUSINESS',
  'ADMIN',
  'SUPER_ADMIN'
);

create type public.listing_status as enum (
  'ACTIVE',
  'PAUSED',
  'SOLD',
  'DRAFT'
);

create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text,
  role public.user_role not null default 'BUYER',
  password_hash text not null,
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.password_reset_tokens (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_verification_tokens (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id text primary key,
  seller_id text not null references public.users(id) on delete cascade,
  title text not null,
  category text not null,
  price integer not null check (price >= 0),
  location text not null,
  year integer not null,
  transmission text,
  image text,
  gallery_json text not null default '[]',
  specs_json text not null default '{}',
  description text not null,
  status public.listing_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id text primary key,
  listing_id text not null references public.listings(id) on delete cascade,
  buyer_id text not null references public.users(id) on delete cascade,
  seller_id text not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, buyer_id, seller_id)
);

create table if not exists public.messages (
  id text primary key,
  conversation_id text not null references public.conversations(id) on delete cascade,
  sender_id text not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users(email);
create index if not exists password_reset_tokens_user_id_idx on public.password_reset_tokens(user_id);
create index if not exists password_reset_tokens_token_hash_idx on public.password_reset_tokens(token_hash);
create index if not exists email_verification_tokens_user_id_idx on public.email_verification_tokens(user_id);
create index if not exists email_verification_tokens_token_hash_idx on public.email_verification_tokens(token_hash);
create index if not exists listings_seller_id_idx on public.listings(seller_id);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_created_at_idx on public.listings(created_at desc);
create index if not exists conversations_buyer_id_idx on public.conversations(buyer_id);
create index if not exists conversations_seller_id_idx on public.conversations(seller_id);
create index if not exists conversations_updated_at_idx on public.conversations(updated_at desc);
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists messages_created_at_idx on public.messages(created_at);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();
