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
      label: 'Project Gallery (Images & Videos)',
      admin: {
        description: 'Add project photos and walkthrough videos.',
      },
      fields: [
        // Original fields — already exist in the DB.
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image File',
          admin: {
            description: 'Upload a project photo.',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'External URL (optional)',
          admin: {
            description: 'Direct image or video URL from an external source.',
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
        // New field — push:true will add this column to the DB.
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Video File (optional)',
          admin: {
            description: 'Upload an MP4/MOV video for this project.',
          },
        },
      ],
    },
  ],
}
