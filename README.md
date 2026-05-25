# AL IQRA MODERN MADRASA

A comprehensive, production-ready, secure, and scalable Islamic School Management Web Application built with Next.js 14, TailwindCSS, PostgreSQL, and Prisma ORM.

## Architecture & Tech Stack
-   **Frontend**: Next.js 14 (App Router) with React Server Components, TypeScript, and TailwindCSS.
-   **UI Components**: Shadcn UI (accessible, headless component library using Radix UI).
-   **Icons**: Lucide React.
-   **Backend**: Next.js Serverless API Routes (`app/api/*`).
-   **Database**: PostgreSQL orchestrated via Prisma ORM.
-   **Authentication**: Custom JSON Web Token (JWT) handling with HTTP-only cookies and bcrypt password hashing.
-   **Validation**: Zod (for type-safe schema validation).
-   **Theming**: Custom Islamic aesthetic (Green/Gold palette), responsive mobile-first views with Tailwind.

## Core Features & RBAC (Role-Based Access Control)
The application handles 6 strict roles: `SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`, `ACCOUNTANT`. Next.js Edge Middleware (`src/middleware.ts`) automatically intercepts and protects routes based on user roles embedded in the JWT payload.

-   **Admin Control**: Global view of all data, students, teachers, classes, and revenue.
-   **Teacher Dashboard**: Mark attendance, add exam results, manage assigned classes.
-   **Student / Parent Access**: View profile, check exam results, pay secure fees, overview daily schedule.
-   **Islamic Features**: Daily Hadith widgets, Tajweed & Hifz continuous progress tracking, prayer timings UI.

---

## Local Development Setup

### Prerequisites
-   Node.js 18+ (LTS recommended)
-   npm, pnpm, or yarn
-   A running PostgreSQL instance (or Neon / Supabase cloud DB connection).

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to a new `.env` file containing your secrets.
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` accurately points to your Postgres database and `JWT_SECRET` is strong.

### 3. Database Initialization
Run Prisma to generate the client and push the schema to your database.
```bash
npx prisma generate
npx prisma db push
```

*(Optional) If you have created a seed script later, run `npx prisma db seed`.*

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) for the public landing page, and `/login` to access the dashboards.

---

## Production Deployment Checklist (Vercel / Render)

This application is strictly optimized for modern hosting environments like Vercel or Render.

### General Steps:
-   [ ] **1. Provision Database**: Spin up a PostgreSQL database (e.g., Neon.tech, AWS RDS, Supabase, Render PostgeSQL).
-   [ ] **2. Environment Secrets**: Inject the following into your hosting platform's Environment Variables settings:
    -   `DATABASE_URL` (Connection pooler URL usually for Edge compatibility, mapped heavily in Prisma).
    -   `JWT_SECRET` (Use `openssl rand -base64 32` to generate a secure random string).
    -   `NODE_ENV="production"`
-   [ ] **3. Prisma Generation**: Ensure you have `postinstall: "prisma generate"` inside your `package.json` scripts so the hosting provider configures the DB client during build time. By default, NextJS setups often handle this automatically.
-   [ ] **4. Connect Repository**: Connect your Github/Gitlab repository to Vercel/Render and let it detect Next.js.
-   [ ] **5. Run Migrations**: For production, prefer `npx prisma migrate deploy` in your build command or run it securely from your local machine pointing to the remote database to prevent accidental schema wipes via `db push`.
-   [ ] **6. TLS & SSL**: Enable HTTPS (default on Vercel) for securing JWT cookies (the `secure` flag is strictly active in `production`).

### Security Note
-   All user passwords (students and staff) are universally hashed utilizing `Bcrypt`.
-   JWTs are stored as HTTP-only cookies to prevent XSS (Cross-Site Scripting) interception.
-   API Routes utilize Zod schema validation to prevent malformed data insertion and NoSQL/SQL injections.
