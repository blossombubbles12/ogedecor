import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Products } from './collections/Products'
import { Inquiries } from './collections/Inquiries'
import { DeliveryMethods } from './collections/DeliveryMethods'
import { Orders } from './collections/Orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const rawBlobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN || ''
const blobToken = rawBlobToken.trim().replace(/^["']|["']$/g, '')

export default buildConfig({
  sharp,
  admin: {
    theme: 'all',
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Ogedecor CMS',
      icons: [{ url: '/ogedecoricon.png' }],
      openGraph: {
        images: ['/ogedecor.png'],
      },
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      beforeNavLinks: ['/components/admin/DashboardNavLink#DashboardNavLink'],
      beforeDashboard: ['/components/admin/BeforeDashboard#BeforeDashboard'],
    },
  },
  collections: [Users, Media, Projects, Products, DeliveryMethods, Orders, Inquiries],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'ogedecor-dev-secret-key-replace-in-production-2026',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: {
        media: true,
      },
      token: blobToken,
    }),
  ],
})
