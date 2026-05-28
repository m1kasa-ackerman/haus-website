# Haus Design Studio — Website + Studio CMS

A complete, self-hosted website for **Haus by Haneesha** with a built-in content manager.

- **Public site** (`/`) — the live portfolio site visitors see.
- **Studio** (`/studio`) — a private admin panel where Haneesha edits everything: projects, hero slides, the about section, services, stats, contact details, and incoming inquiries. No code required.

Built with Next.js 14, Prisma, Auth.js, ImageKit (image hosting), and Resend (email).

---

## What you can edit from the Studio

Once deployed, sign in at `yoursite.com/studio` to manage:

| Section | What it controls |
|---|---|
| **Inquiries** | Every contact-form submission. New ones are also emailed to you. |
| **Projects** | Portfolio case studies — title, description, details, and a gallery of images. Drag to reorder. |
| **Hero slides** | The full-screen rotating slideshow at the top of the homepage. |
| **About & photo** | Your bio and the designer portrait. |
| **Services** | The "What we do" cards. |
| **Stats** | The headline numbers (e.g. "12+ projects"). |
| **Contact & footer** | Email, phone, Instagram, location, and all section headings. |

Changes publish to the live site instantly.

---

## Before you start: the 5 accounts you'll need

Everything below has a **free tier** that's plenty for this site. You'll create these and copy a few keys — I'll tell you exactly what to grab.

1. **GitHub** — stores the code. → https://github.com
2. **Vercel** — hosts the live site (connects to GitHub). → https://vercel.com
3. **Neon** — the database (stores your projects, inquiries, etc.). → https://neon.tech
4. **ImageKit** — hosts images you upload in the Studio. → https://imagekit.io
5. **Resend** — emails you when someone submits the contact form. → https://resend.com

> You don't need to be technical. Each step below is copy-paste. Set aside about 30–40 minutes.

---

## Step 1 — Put the code on GitHub

1. Create a free account at https://github.com if you don't have one.
2. Click **New repository** → name it `haus-website` → keep it **Private** → **Create repository**.
3. On your computer, unzip this project, then in a terminal inside the project folder run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/haus-website.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME`.) If you'd rather not use the terminal, you can use **GitHub Desktop** (https://desktop.github.com) — drag the folder in and publish.

---

## Step 2 — Create the database (Neon)

1. Sign up at https://neon.tech (you can sign in with GitHub).
2. Click **New Project**. Name it `haus`. Pick the region closest to India (e.g. *Asia Pacific (Singapore)*). Click **Create**.
3. On the project dashboard, find the **Connection string** — it looks like:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/haus?sslmode=require
   ```
4. **Copy it.** This is your `DATABASE_URL`. Keep the tab open.

---

## Step 3 — Set up image hosting (ImageKit)

1. Sign up at https://imagekit.io.
2. Go to the **Developer options** → **API Keys** section of the dashboard.
3. Copy these three values:
   - **Public key** → `IMAGEKIT_PUBLIC_KEY`
   - **Private key** → `IMAGEKIT_PRIVATE_KEY`
   - **URL endpoint** (looks like `https://ik.imagekit.io/yourid`) → `IMAGEKIT_URL_ENDPOINT`

> The site works without ImageKit, but image **uploads** in the Studio stay disabled until these are set. (Your seeded starter images still display.)

---

## Step 4 — Set up email notifications (Resend)

1. Sign up at https://resend.com.
2. Go to **API Keys** → **Create API Key** → copy it → this is `RESEND_API_KEY`.
3. **Sender address** — you have two options:
   - **Quick start:** use `onboarding@resend.dev` as the `RESEND_FROM` (works immediately, good for testing).
   - **Proper setup:** add your domain under **Domains**, verify it (Resend shows you the DNS records to add), then use something like `hello@hausbyhaneesha.com`.
4. Set `INQUIRY_TO_EMAIL` to wherever Haneesha wants to *receive* inquiry notifications (e.g. her personal Gmail).

> The site works without Resend — inquiries are still saved and visible in the Studio. You just won't get the email alert until this is set.

---

## Step 5 — Deploy on Vercel

1. Sign up at https://vercel.com with your GitHub account.
2. Click **Add New… → Project**, then **Import** the `haus-website` repo.
3. Before clicking Deploy, open **Environment Variables** and add each of the following (name on the left, value on the right):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | *(the Neon connection string from Step 2)* |
   | `AUTH_SECRET` | *(generate one — see below)* |
   | `AUTH_URL` | `https://your-project.vercel.app` *(your Vercel URL; update after first deploy if needed)* |
   | `ADMIN_EMAIL` | *(the email Haneesha will log in with)* |
   | `ADMIN_PASSWORD` | *(a strong password for first login)* |
   | `IMAGEKIT_PUBLIC_KEY` | *(from Step 3)* |
   | `IMAGEKIT_PRIVATE_KEY` | *(from Step 3)* |
   | `IMAGEKIT_URL_ENDPOINT` | *(from Step 3)* |
   | `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | *(same as `IMAGEKIT_PUBLIC_KEY`)* |
   | `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | *(same as `IMAGEKIT_URL_ENDPOINT`)* |
   | `RESEND_API_KEY` | *(from Step 4)* |
   | `RESEND_FROM` | `onboarding@resend.dev` *(or your verified sender)* |
   | `INQUIRY_TO_EMAIL` | *(where to receive inquiries)* |

   **To generate `AUTH_SECRET`**, run this in a terminal and paste the output:
   ```bash
   openssl rand -base64 32
   ```
   (No terminal? Use https://generate-secret.vercel.app/32 — it makes one for you.)

4. Click **Deploy**. Wait for it to finish (~2 minutes).

---

## Step 6 — Create the database tables + starter content

This fills the empty database with the tables and Haneesha's starting content (the projects, images, and text from the original site).

**Easiest way — from your own computer:**

1. Make sure you have **Node.js 18+** installed (https://nodejs.org).
2. In the project folder, create a file called `.env` (copy `.env.example`) and paste in the **same values** you entered on Vercel — at minimum `DATABASE_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
3. Run:
   ```bash
   npm install
   npm run db:push     # creates all the tables in Neon
   npm run db:seed     # loads the starter content + creates the admin login
   ```

That's it. Your live site now shows the seeded content, and you can log in at `https://your-project.vercel.app/studio` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you chose.

> **Re-running `db:seed`** resets hero slides, stats, services, projects, and text back to defaults, and re-applies your admin password. It will *not* delete inquiries. Run it only when you want a fresh start.

---

## Using your own domain

In Vercel: **Project → Settings → Domains → Add** your domain (e.g. `hausbyhaneesha.com`) and follow the DNS instructions. Afterwards, update the `AUTH_URL` environment variable to your real domain and redeploy.

---

## Running it locally (optional, for development)

```bash
npm install
cp .env.example .env      # then fill in the values
npm run db:push           # first time only
npm run db:seed           # first time only
npm run dev               # → http://localhost:3000  (studio at /studio)
```

Useful commands:

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run db:push` | Sync the schema to the database |
| `npm run db:seed` | Load starter content + admin user |
| `npm run db:studio` | Open Prisma Studio to inspect the database directly |

---

## How it's built (for a future developer)

```
src/
  app/
    page.tsx                 Public homepage (reads everything from the DB)
    layout.tsx               Fonts + metadata
    globals.css              Public-site styles (ported from the original design)
    actions/contact.ts       Contact-form submission (saves + emails)
    api/auth/[...nextauth]/   Auth.js endpoints
    api/imagekit/auth/        Signed upload tokens (admin-only)
    studio/
      login/                 Sign-in page (outside the protected shell)
      (panel)/               Protected admin pages (dashboard, projects, hero, …)
      actions.ts             All Studio create/update/delete server actions
      studio.css             Admin styles
  components/
    public/                  Hero, Stats, About, Portfolio, Services, Contact, …
    studio/                  ImageUploader, ProjectEditor, forms, nav, buttons
  lib/
    db.ts                    Prisma client (singleton)
    auth.ts                  Auth.js config (credentials + bcrypt)
    imagekit.ts              ImageKit server helpers
    resend.ts                Inquiry email
    utils.ts                 Content-map helpers + safe inline-HTML sanitizer
    types.ts                 Shared model types
prisma/
  schema.prisma              Database schema (8 models)
  seed.ts                    Starter content + admin user
public/images/seed/          The 13 starter images from the original site
```

**Notes**
- Pages that read from the DB are `force-dynamic`, so Studio edits appear immediately.
- Studio routes are protected by `middleware.ts`; the login page sits outside the protected route group to avoid a redirect loop.
- Editable headings support a tiny bit of inline HTML — `<em>…</em>` for the italic gold accent and `<br>` for line breaks. All other HTML is escaped for safety.
- Replacing or deleting an image in the Studio also removes the old file from ImageKit.

---

## Troubleshooting

- **Login says "Invalid email or password."** Re-run `npm run db:seed` to (re)create the admin with your current `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Email is case-insensitive.
- **Image uploads are greyed out / show a notice.** The ImageKit keys aren't set. Add them in Vercel (Step 3) and redeploy. Seeded images still show regardless.
- **No inquiry emails arriving.** Check `RESEND_API_KEY`, `RESEND_FROM`, and `INQUIRY_TO_EMAIL`. Inquiries are always saved in the Studio even if email isn't configured.
- **"PrismaClient did not initialize."** Run `npm install` (which runs `prisma generate`), or `npx prisma generate` directly.
- **Changes not showing.** Hard-refresh; if it persists, redeploy on Vercel.
