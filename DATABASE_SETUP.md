# Database Setup Guide

## Initial Setup

The database schema has been defined in `prisma/schema.prisma`. To create the tables in your Neon database, run:

```bash
npx prisma db push
```

> **Note**: If you encounter connection errors, ensure your Neon database is active. Neon databases may suspend after periods of inactivity.

## Alternative: Using Prisma Migrate

For production environments, use migrations instead:

```bash
npx prisma migrate dev --name init
```

## Verify Database

After pushing the schema, you can verify the tables were created:

```bash
npx prisma studio
```

This will open a browser-based database viewer where you can see your `Project` table.

## Troubleshooting

If you get connection errors:
1. Check that your `DATABASE_URL` in `.env` is correct
2. Ensure your Neon project is not suspended (visit Neon dashboard)
3. Try using the direct (non-pooled) connection string for migrations
