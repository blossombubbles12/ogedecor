import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Studio & Portfolio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'completionDate', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Residential', value: 'Residential' },
        { label: 'Commercial', value: 'Commercial' },
        { label: 'Custom Decor', value: 'Custom Decor' },
      ],
      defaultValue: 'Residential',
    },
    {
      name: 'completionDate',
      type: 'date',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'media',
      type: 'array',
      label: 'Project Gallery Media',
      admin: {
        description: 'Add project photos. Use the Type field to mark videos by URL.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image File',
        },
        {
          name: 'url',
          type: 'text',
          label: 'External URL (optional)',
          admin: {
            description: 'Direct image or video URL',
          },
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'image',
          label: 'Media Type',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
      ],
    },
  ],
}
