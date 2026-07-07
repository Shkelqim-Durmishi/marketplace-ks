# Supabase setup

Ky folder e pergatit databazen per deploy ne Vercel me Supabase PostgreSQL.

## 1. Krijo project ne Supabase

Hyr ne Supabase, krijo project te ri dhe ruaje password-in e databazes.

## 2. Ekzekuto skemen

Shko te:

```text
Supabase Dashboard -> SQL Editor
```

Kopjo permbajtjen e:

```text
supabase/schema.sql
```

Pastaj kliko `Run`.

## 3. Merre DATABASE_URL

Shko te:

```text
Project Settings -> Database -> Connection string
```

Per Vercel perdore transaction pooler si `DATABASE_URL`, ndersa session pooler si `DIRECT_URL`.

Shembull:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
```

## 4. Storage per foto

Krijo nje bucket:

```text
marketplace-listings
```

Per fillim mund te jete public. Me vone mund ta bejme private me signed URLs.

Variablat qe duhen:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="marketplace-listings"
```

## 5. Prisma

Pasi t'i vendosesh `DATABASE_URL` dhe `DIRECT_URL` ne `.env`, mund t'i ekzekutosh:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
```

App-i tani perdor Prisma/PostgreSQL ne `src/lib/db.ts`, dhe fotot ngarkohen ne Supabase Storage kur variablat e Storage jane vendosur.
