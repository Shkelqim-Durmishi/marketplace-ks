# Marketplace-ks

Marketplace modern per shpallje, user accounts, mesazhe, email verification, reset password dhe menaxhim shpalljesh.

## Start lokal

```powershell
npm.cmd install
npm.cmd run dev
```

Hape:

```text
http://localhost:3000
```

## Verifikim

```powershell
npm.cmd run lint
npm.cmd run build
```

## Databaza

Aplikacioni perdor Supabase PostgreSQL permes Prisma ne `src/lib/db.ts`.

Skema mund te sinkronizohet me:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
```

## Si ta krijosh databazen ne Supabase

1. Hyr ne Supabase dhe krijo nje project te ri.
2. Shko te `SQL Editor`.
3. Hape file-in `supabase/schema.sql`.
4. Kopjo krejt SQL-in dhe ekzekutoje ne Supabase.
5. Krijo bucket publik `marketplace-listings` te `Storage`.
6. Shko te `Project Settings` -> `Database`.
7. Kopjo transaction pooler per `DATABASE_URL` dhe session pooler per `DIRECT_URL`.

## Environment Variables

Krijo `.env` lokal duke u bazuar ne:

```text
.env.example
```

Per Vercel duhen keto variabla:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
AUTH_SECRET="change-this-to-a-long-random-secret"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Marketplace-ks <onboarding@resend.dev>"
APP_URL="https://your-vercel-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="marketplace-listings"
```

## Hapi i radhes

Pas lidhjes me Vercel, vendos te njejtat environment variables ne Vercel dhe bej deploy test. Pastaj testohen register, login, krijim shpalljeje me foto, mesazhet dhe reset password ne domain-in e Vercel.
