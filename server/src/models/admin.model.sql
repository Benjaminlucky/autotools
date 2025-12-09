create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  password text not null,
  created_at timestamp default now()
);
