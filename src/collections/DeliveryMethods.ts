import type { CollectionConfig } from 'payload'

export const DeliveryMethods: CollectionConfig = {
  slug: 'delivery-methods',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'estimatedDays', 'isActive', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Delivery Method Name',
      admin: {
        placeholder: 'e.g. Lagos White-Glove Installation & Delivery',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Service Details & Inclusions',
      admin: {
        placeholder: 'e.g. Includes room-of-choice delivery, assembly, unboxing, and debris removal.',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Base Delivery Fee',
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
      required: true,
    },
    {
      name: 'estimatedDays',
      type: 'text',
      required: true,
      label: 'Estimated Transit Time',
      admin: {
        placeholder: 'e.g. 2 - 4 business days',
      },
    },
    {
      name: 'regions',
      type: 'select',
      hasMany: true,
      defaultValue: ['Lagos Metro'],
      options: [
        { label: 'Lagos Metro', value: 'Lagos Metro' },
        { label: 'Abuja FCT', value: 'Abuja FCT' },
        { label: 'South-West Nigeria', value: 'South-West' },
        { label: 'Nationwide (Nigeria)', value: 'Nationwide' },
        { label: 'West Africa Region', value: 'West Africa' },
        { label: 'International Freight', value: 'International' },
      ],
      label: 'Eligible Delivery Regions',
    },
    {
      name: 'freeShippingThreshold',
      type: 'number',
      label: 'Free Delivery Threshold (Optional)',
      admin: {
        description: 'Orders with a subtotal equal or above this amount get free delivery with this option.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active and Available at Checkout',
    },
  ],
}
