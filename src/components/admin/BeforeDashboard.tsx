import React from 'react'
import type { ServerProps } from 'payload'
import Link from 'next/link'

export const BeforeDashboard: React.FC<ServerProps> = async ({ payload }) => {
  let productCount = 0
  let orderCount = 0
  let projectCount = 0
  let inquiryCount = 0

  if (payload) {
    try {
      const [prodRes, orderRes, projRes, inqRes] = await Promise.allSettled([
        payload.count({ collection: 'products' }),
        payload.count({ collection: 'orders' }),
        payload.count({ collection: 'projects' }),
        payload.count({ collection: 'inquiries' }),
      ])
      if (prodRes.status === 'fulfilled') productCount = prodRes.value.totalDocs
      if (orderRes.status === 'fulfilled') orderCount = orderRes.value.totalDocs
      if (projRes.status === 'fulfilled') projectCount = projRes.value.totalDocs
      if (inqRes.status === 'fulfilled') inquiryCount = inqRes.value.totalDocs
    } catch {
      // Fallback gracefully
    }
  }

  const kpis = [
    {
      label: 'Products & Decor',
      value: productCount,
      href: '/admin/collections/products',
      subtitle: 'Inventory & Catalog',
      icon: '🛋️',
      badge: 'Catalog',
    },
    {
      label: 'Customer Orders',
      value: orderCount,
      href: '/admin/collections/orders',
      subtitle: 'Commissions & Fulfillment',
      icon: '📦',
      badge: 'Fulfillment',
    },
    {
      label: 'Design Projects',
      value: projectCount,
      href: '/admin/collections/projects',
      subtitle: 'Residential & Commercial',
      icon: '🏛️',
      badge: 'Portfolio',
    },
    {
      label: 'Client Inquiries',
      value: inquiryCount,
      href: '/admin/collections/inquiries',
      subtitle: 'Bespoke Consultations',
      icon: '✉️',
      badge: 'Concierge',
    },
  ]

  const quickActions = [
    { label: '+ New Product', href: '/admin/collections/products/create' },
    { label: '+ New Project', href: '/admin/collections/projects/create' },
    { label: '📦 Orders Pipeline', href: '/admin/collections/orders' },
    { label: '🚚 Delivery Options', href: '/admin/collections/delivery-methods' },
    { label: '🖼️ Media Vault', href: '/admin/collections/media' },
    { label: '🌐 Open Storefront', href: '/shop', external: true },
  ]

  return (
    <div className="ogedecor-dashboard-hero" style={{ marginBottom: '32px' }}>
      {/* Top Welcome Banner */}
      <div className="ogedecor-banner">
        {/* Subtle Decorative Glow */}
        <div className="ogedecor-banner-glow" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="ogedecor-status-dot" />
              <span className="ogedecor-brand-tag">
                Ogedecor Interior Architecture & Fine Decor
              </span>
            </div>
            <h1 className="ogedecor-banner-title">
              Executive Dashboard
            </h1>
            <p className="ogedecor-banner-subtitle">
              Manage luxury furniture catalog, architectural projects, client orders, and logistics with seamless precision.
            </p>
          </div>

          {/* Live Storefront Quick Link */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              href="/shop"
              target="_blank"
              className="ogedecor-storefront-btn"
            >
              <span>Visit Live Storefront</span>
              <span style={{ fontSize: '14px' }}>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="ogedecor-actions-bar">
          <span className="ogedecor-actions-label">
            Quick Actions:
          </span>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              className="ogedecor-action-pill"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="ogedecor-kpi-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>{kpi.icon}</span>
              <span className="ogedecor-kpi-badge">
                {kpi.badge}
              </span>
            </div>
            <div className="ogedecor-kpi-value">
              {kpi.value}
            </div>
            <div className="ogedecor-kpi-label">
              {kpi.label}
            </div>
            <div className="ogedecor-kpi-subtitle">{kpi.subtitle}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BeforeDashboard
