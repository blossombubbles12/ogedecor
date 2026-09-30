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
      label: 'Featured Media (Image or Video)',
    },
    {
      name: 'media',
      type: 'array',
      label: 'Project Gallery Media (Images & Videos)',
      admin: {
        description: 'Upload project photos or videos. External URLs are also supported.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Media File (Image or Video)',
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
