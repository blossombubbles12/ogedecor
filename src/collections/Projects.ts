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
        description: 'Add project photos and walkthrough videos. Select the media type for each item.',
      },
      fields: [
        {
          name: 'mediaType',
          type: 'select',
          label: 'Media Type',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          label: 'Media File (Image or Video)',
          admin: {
            description: 'Upload an image or video file.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Legacy Image File',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          label: 'Legacy Video File',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'External URL (optional)',
          admin: {
            description: 'Alternatively paste a direct image or video URL from an external source.',
          },
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'image',
          label: 'Legacy Type Tag',
          admin: {
            hidden: true,
          },
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
      ],
    },
  ],
}
