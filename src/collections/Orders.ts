import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    group: 'Atelier Commerce',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'grandTotal', 'deliveryStatus', 'paymentStatus', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Order Reference Number',
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer Full Name',
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      label: 'Customer Email',
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Delivery Address',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
          label: 'Street Address',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          label: 'State / Province',
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Postal / ZIP Code',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'Nigeria',
          required: true,
          label: 'Country',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Purchased Items',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Product Name',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Unit Price',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          label: 'Quantity',
        },
        {
          name: 'lineTotal',
          type: 'number',
          required: true,
          label: 'Line Total',
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Image URL',
        },
      ],
    },
    {
      name: 'delivery',
      type: 'group',
      label: 'Delivery & Logistics',
      fields: [
        {
          name: 'method',
          type: 'relationship',
          relationTo: 'delivery-methods',
          label: 'Selected Delivery Method',
        },
        {
          name: 'methodTitle',
          type: 'text',
          label: 'Delivery Method Name',
        },
        {
          name: 'deliveryFee',
          type: 'number',
          defaultValue: 0,
          label: 'Delivery Fee',
        },
        {
          name: 'deliveryStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending Confirmation', value: 'pending' },
            { label: 'In Crafting / Production', value: 'crafting' },
            { label: 'Quality Inspection', value: 'inspection' },
            { label: 'Dispatched to Carrier', value: 'dispatched' },
            { label: 'Out for Delivery', value: 'out_for_delivery' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
          label: 'Delivery Status',
        },
        {
          name: 'carrier',
          type: 'text',
          label: 'Logistics / Carrier Partner',
          admin: {
            placeholder: 'e.g. OgeDecor White-Glove Fleet / DHL Express',
          },
        },
        {
          name: 'trackingNumber',
          type: 'text',
          label: 'Tracking Number / Waybill',
        },
        {
          name: 'specialInstructions',
          type: 'textarea',
          label: 'Customer Delivery Notes / Gate Access',
        },
      ],
    },
    {
      name: 'financials',
      type: 'group',
      label: 'Order Pricing & Payment',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          label: 'Items Subtotal',
        },
        {
          name: 'deliveryTotal',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Delivery Cost',
        },
        {
          name: 'discountTotal',
          type: 'number',
          defaultValue: 0,
          label: 'Discount',
        },
        {
          name: 'grandTotal',
          type: 'number',
          required: true,
          label: 'Grand Total',
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
          name: 'paymentStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending Payment', value: 'pending' },
            { label: 'Paid in Full', value: 'paid' },
            { label: 'Payment on Delivery', value: 'on_delivery' },
            { label: 'Refunded', value: 'refunded' },
          ],
        },
        {
          name: 'paymentMethod',
          type: 'select',
          defaultValue: 'bank_transfer',
          options: [
            { label: 'Direct Bank Transfer / Wire', value: 'bank_transfer' },
            { label: 'Online Debit/Credit Card', value: 'card' },
            { label: 'Showroom POS / Cash on Delivery', value: 'pos_showroom' },
          ],
        },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Internal Admin / Atelier Notes',
    },
  ],
}
