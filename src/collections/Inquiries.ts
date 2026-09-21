import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    group: 'Client Concierge',
    useAsTitle: 'contactName',
    defaultColumns: ['contactName', 'contactInfo', 'projectType', 'budget', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'contactName',
      type: 'text',
      required: true,
      label: 'Client Name',
    },
    {
      name: 'contactInfo',
      type: 'text',
      required: true,
      label: 'Email / Phone',
    },
    {
      name: 'projectType',
      type: 'text',
    },
    {
      name: 'mood',
      type: 'text',
    },
    {
      name: 'timeline',
      type: 'text',
    },
    {
      name: 'budget',
      type: 'text',
    },
    {
      name: 'inspiration',
      type: 'json',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New Lead', value: 'new' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
      ],
    },
  ],
}
