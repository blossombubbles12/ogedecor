import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'text',
      required: true,
      admin: {
        description: 'Formatted price (e.g. $450.00)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'Furniture',
      options: [
        { label: 'Furniture', value: 'Furniture' },
        { label: 'Lighting', value: 'Lighting' },
        { label: 'Art & Decor', value: 'Art & Decor' },
        { label: 'Textiles', value: 'Textiles' },
      ],
    },
    {
      name: 'imageMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Product Image (Upload)',
    },
    {
      name: 'image',
      type: 'text',
      admin: {
        description: 'Direct image URL fallback (e.g. Unsplash or external)',
      },
    },
  ],
}
