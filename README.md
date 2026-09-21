# OgeDecor — Luxury Interior Design & E-Commerce

A modern, high-performance interior design and ecommerce website for OgeDecor, built with **Next.js 16**, **Payload CMS 3.x**, **Neon PostgreSQL**, and **Vercel Blob** storage.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **CMS / Headless Backend**: [Payload CMS 3.x](https://payloadcms.com/)
- **Database**: [Neon PostgreSQL](https://neon.tech/) via `@payloadcms/db-postgres`
- **Media & Image Storage**: [Vercel Blob](https://vercel.com/storage/blob) via `@payloadcms/storage-vercel-blob`
- **Styling**: Tailwind CSS, Framer Motion
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Neon PostgreSQL Connection
DATABASE_URI="postgresql://username:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL="${DATABASE_URI}"

# Vercel Blob Storage Token
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxx"

# Payload CMS Secret Key
PAYLOAD_SECRET="your-secure-random-secret-key"

# Server URL
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
```

### 3. Run Development Server

```bash
pnpm dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Payload CMS Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## CMS Collections

- **Users**: Admin authentication and permissions.
- **Projects**: Portfolio showcase for residential, commercial, and custom decor projects.
- **Products**: E-commerce catalog for furniture, lighting, art, and textiles.
- **Inquiries**: Design consultation requests and lead management.
- **Media**: Image and video uploads automatically stored in Vercel Blob with responsive thumbnail generation.

---

## Deployment on Vercel

1. Push your changes to GitHub.
2. Import the project in Vercel.
3. In Vercel Project Settings > **Environment Variables**, add:
   - `DATABASE_URI` (from Neon Console)
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Storage > Blob)
   - `PAYLOAD_SECRET` (random 32+ character string)
   - `NEXT_PUBLIC_SERVER_URL` (your production Vercel domain)
4. Deploy!
