# Youth Empowerment Hub — Digital Ecosystem Gateway

**The official central gateway website for Youth Empowerment Hub** — empowering young people through education, skills, technology, opportunities, innovation, sports, community development, and social welfare.

This is NOT just a basic NGO website. It is a **scalable digital headquarters** with a full CMS admin portal, dynamic platform ecosystem, and architecture designed for long-term growth.

---

## 🚀 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16.3.1 (App Router) | Full-stack React framework with Server Components |
| Language | TypeScript 5 | Type-safe development |
| Styling | Tailwind CSS v4 | Utility-first styling with design tokens |
| UI Components | shadcn/ui (Radix + CVA) | Accessible, customizable component library |
| Animations | Framer Motion | Smooth, performant animations |
| Icons | Lucide React | Modern, consistent icon set |
| Database | PostgreSQL (Supabase) | Managed relational database |
| ORM | Drizzle ORM | Type-safe, lightweight SQL queries |
| Auth | Supabase Auth | Secure sessions, password hashing |
| Storage | Supabase Storage | CDN-backed file storage |
| Validation | Zod | Runtime + TypeScript schema validation |
| Forms | React Hook Form | Performant form handling |
| Tables | TanStack Table | Sortable, filterable data tables |
| Toasts | Sonner | Lightweight notifications |

---

## 📋 Prerequisites

- **Node.js** 18.17 or later
- **npm** 9 or later
- **Supabase account** (free tier works)

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd youth-empowerment-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose an organization (or create one)
4. Set a **project name** (e.g., "youth-empowerment-hub")
5. Set a **database password** (save this — you'll need it)
6. Select a **region** closest to your users
7. Click **"Create new project"**

### 4. Get Supabase Credentials

From your Supabase Dashboard:
1. Go to **Settings → API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Settings → Database**
6. Copy **Connection string (URI)** → `DATABASE_URL`
   - Replace `[YOUR-PASSWORD]` with the database password you set

### 5. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6. Create Supabase Storage Bucket

1. Go to **Supabase Dashboard → Storage**
2. Click **"Create a new bucket"**
3. Name: `media`
4. Set as **Public bucket** (for serving images/files)
5. Click **"Create bucket"**

### 7. Push Database Schema

```bash
npm run db:push
```

This creates all tables, enums, and indexes in your Supabase PostgreSQL database.

### 8. Seed Initial Data

```bash
npm run db:seed
```

This populates:
- Default site settings
- Feature flags
- Homepage sections
- 13 official objectives
- 3 initial platforms (BrainStorm, CricketLive, Opportunities)
- Navigation items
- Get-involved links
- Impact metric placeholders

### 9. Create Admin User

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **"Add user" → "Create new user"**
3. Email: `admin@yeh.official`
4. Password: Your chosen password
5. Check **"Auto Confirm User"**
6. Click **"Create user"**
7. Copy the user's **UUID** from the users list

Then add this user to the application database. In **Supabase Dashboard → SQL Editor**, run:

```sql
INSERT INTO users (id, email, name, role, status)
VALUES (
  'PASTE-UUID-HERE',
  'admin@yeh.official',
  'Admin',
  'super_admin',
  'active'
);
```

### 10. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the public website.

Open [http://localhost:3000/login](http://localhost:3000/login) — sign in to the admin portal.

---

## 📁 Project Structure

```
app/
├── (public)/          # Public website pages
│   ├── page.tsx       # Homepage
│   ├── about/         # About page
│   ├── contact/       # Contact form
│   ├── events/        # Events listing
│   ├── initiatives/   # Initiatives listing
│   ├── platforms/     # Platforms listing
│   └── ...
├── (admin)/admin/     # Admin portal
│   ├── page.tsx       # Dashboard
│   ├── platforms/     # Platform management
│   ├── events/        # Event management
│   ├── settings/      # Site settings
│   ├── media/         # Media library
│   ├── users/         # User management
│   └── ...
├── (auth)/login/      # Login page
└── api/               # API routes

components/
├── ui/                # shadcn/ui components (20+)
├── public/            # Public website components
├── admin/             # Admin portal components
└── shared/            # Shared components

lib/
├── db/                # Database schema + connection
├── supabase/          # Supabase clients
├── auth/              # Auth utilities + RBAC
├── actions/           # Server Actions (CRUD)
└── validators/        # Zod validation schemas
```

---

## 🔐 Admin Portal

### Roles

| Role | Access |
|------|--------|
| **Super Admin** | Full access to all features, settings, users |
| **Content Admin** | Manage content (platforms, events, etc.) but not settings/users |
| **Viewer** | Read-only access to admin dashboard |

### Features

- **Dashboard** — Overview stats, recent activity, quick actions
- **Platforms** — Full CRUD for ecosystem platforms
- **Events** — Create and manage events
- **Initiatives** — Manage organizational initiatives
- **Objectives** — Manage trust objectives
- **Announcements** — Publish announcements
- **Testimonials** — Manage testimonials (hidden when empty)
- **Partners** — Manage partner organizations (hidden when empty)
- **Impact Metrics** — Track and display impact data
- **Get Involved** — Manage engagement links
- **Contact** — View and manage contact submissions
- **Media Library** — Upload and manage files
- **Homepage Builder** — Control section visibility and order
- **Settings** — Organization info, social links, feature flags
- **User Management** — Create and manage admin users (Super Admin only)
- **Audit Log** — Track all admin actions

---

## 🌐 Adding Platforms

New platforms can be added entirely from the admin portal:

1. Login to `/admin`
2. Go to **Platforms → Add Platform**
3. Enter name, description, URL, status
4. Upload logo/cover image
5. Set display order and featured status
6. Click **Save**

The platform immediately appears on the public website — no code changes needed.

### Platform Statuses

- **Live** — Active, linked to external URL
- **Coming Soon** — Displayed with "Coming Soon" badge
- **Under Development** — Displayed with development badge
- **Draft** — Not visible to public
- **Archived** — Removed from public display

---

## 🎛️ Feature Flags

Control features from admin Settings → Features:

| Flag | Purpose |
|------|---------|
| `donation_enabled` | Show donation CTA and section |
| `events_enabled` | Show events section |
| `testimonials_enabled` | Allow testimonials section |
| `partners_enabled` | Allow partners section |
| `announcements_enabled` | Show announcement bar |
| `contact_form_enabled` | Enable contact form |

---

## 🏗️ Production Build

```bash
npm run build
npm start
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

Works on Railway, Render, Fly.io, or any Node.js hosting:

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to your production domain.

---

## 🔒 Security

- Supabase Auth with secure session cookies
- Server-side auth checks on all admin routes
- Role-based access control (RBAC)
- Zod validation on all inputs (server-side)
- Parameterized SQL queries (Drizzle ORM)
- XSS protection (React escaping + security headers)
- File upload validation (type + size limits)
- Honeypot spam protection on contact form
- Audit logging for all admin actions
- Security headers (X-Frame-Options, CSP, etc.)

---

## ♿ Accessibility

- Semantic HTML throughout
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus-visible styles
- `prefers-reduced-motion` support
- Proper heading hierarchy
- Alt text on images
- Accessible form labels and errors

---

## 📊 Database

17 tables managed by Drizzle ORM:

```bash
npm run db:generate   # Generate migration files
npm run db:migrate    # Run migrations
npm run db:push       # Push schema directly (dev)
npm run db:studio     # Open Drizzle Studio (DB browser)
```

---

## 📄 License

This project is proprietary to Youth Empowerment Hub.
