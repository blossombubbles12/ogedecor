import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'stockQuantity', 'inStock', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Product Name',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      admin: {
        placeholder: 'e.g. ashanti-stool-gold-edition',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle / Material Highlight',
      admin: {
        placeholder: 'e.g. Handcrafted Solid Mahogany with 24k Gold Leaf Trim',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Detailed Description',
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
        { label: 'Architectural Decor', value: 'Architectural Decor' },
      ],
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Price',
          admin: {
            width: '40%',
            placeholder: '450',
          },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: [
            { label: 'USD ($)', value: 'USD' },
            { label: 'NGN (₦)', value: 'NGN' },
            { label: 'EUR (€)', value: 'EUR' },
            { label: 'GBP (£)', value: 'GBP' },
          ],
          admin: {
            width: '30%',
          },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          label: 'Original / Compare Price',
          admin: {
            width: '30%',
            placeholder: '550',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sku',
          type: 'text',
          label: 'SKU / Product Code',
          admin: {
            width: '40%',
            placeholder: 'OGE-FURN-001',
          },
        },
        {
          name: 'stockQuantity',
          type: 'number',
          defaultValue: 10,
          label: 'Units in Stock',
          admin: {
            width: '30%',
          },
        },
        {
          name: 'inStock',
          type: 'checkbox',
          defaultValue: true,
          label: 'Available for Purchase',
          admin: {
            width: '30%',
          },
        },
      ],
    },
    {
      name: 'materials',
      type: 'text',
      label: 'Materials & Finishes',
      admin: {
        placeholder: 'e.g. Sustainable Mahogany, Italian Velvet, Solid Brass',
      },
    },
    {
      name: 'dimensions',
      type: 'group',
      label: 'Product Dimensions & Weight',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'height', type: 'text', label: 'Height', admin: { placeholder: '85 cm', width: '25%' } },
            { name: 'width', type: 'text', label: 'Width', admin: { placeholder: '60 cm', width: '25%' } },
            { name: 'depth', type: 'text', label: 'Depth', admin: { placeholder: '50 cm', width: '25%' } },
            { name: 'weight', type: 'text', label: 'Weight', admin: { placeholder: '14 kg', width: '25%' } },
          ],
        },
      ],
    },
    {
      name: 'deliveryInfo',
      type: 'group',
      label: 'Logistics & Delivery Specification',
      fields: [
        {
          name: 'leadTime',
          type: 'text',
          defaultValue: 'Ready to ship in 2-3 business days',
          label: 'Dispatch Lead Time',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'isFragile',
              type: 'checkbox',
              defaultValue: false,
              label: 'Fragile Handling Required',
              admin: { width: '50%' },
            },
            {
              name: 'whiteGloveRequired',
              type: 'checkbox',
              defaultValue: false,
              label: 'White-Glove Assembly Required',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'imageMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Primary Display Image (Vercel Blob)',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Additional Gallery Angles',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'image',
      type: 'text',
      label: 'Direct Image URL Fallback',
      admin: {
        description: 'External image link (e.g. Unsplash or Cloudinary) used if no file is uploaded',
      },
    },
  ],
}
