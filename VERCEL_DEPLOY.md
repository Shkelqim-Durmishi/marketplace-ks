# Vercel deploy checklist

Ky projekt eshte gati per deploy ne Vercel me Supabase PostgreSQL, Supabase Storage dhe Resend.

## 1. GitHub

Krijo nje repository ne GitHub dhe ngarko folderin `marketplace-ks`.

Nese e ngarkon krejt workspace-in, ne Vercel zgjidh:

```text
Root Directory: marketplace-ks
```

Nese e ngarkon vetem folderin `marketplace-ks`, root directory lihet bosh.

## 2. Vercel project settings

Ne Vercel:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

## 3. Environment variables

Vendosi keto te `Project Settings -> Environment Variables`:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DATABASE-PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[DATABASE-PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
AUTH_SECRET="long-random-secret"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Marketplace-ks <onboarding@resend.dev>"
APP_URL="https://your-vercel-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="marketplace-listings"
```

Per `AUTH_SECRET`, perdor nje tekst te gjate random. Mos perdor te njejtin si shembull.

## 4. Pas deploy-it

Pasi Vercel ta krijoje domain-in:

1. Kopjo URL-ne e Vercel.
2. Kthehu te Environment Variables.
3. Ndrysho `APP_URL` dhe `NEXT_PUBLIC_APP_URL` me URL-ne reale.
4. Bej `Redeploy`.

## 5. Test final

Testo:

- regjistrim user-i;
- email verification;
- login/logout;
- krijim shpalljeje me foto;
- shfaqje te fotos nga Supabase Storage;
- dergim mesazhi;
- reset password.

## 6. Siguri

Mos e ngarko `.env` ne GitHub. Vetem `.env.example` duhet te jete publik.

Nese ndonje sekret eshte shfaqur ne screenshot ose file publik, bej rotate:

- `SUPABASE_SERVICE_ROLE_KEY`;
- `RESEND_API_KEY`;
- password-in e databazes.
