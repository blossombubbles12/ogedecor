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
      label: 'Atelier Products',
      value: productCount,
      href: '/admin/collections/products',
      subtitle: 'Catalog Pieces & Decor',
      icon: '🛋️',
      badge: 'Active Stock',
    },
    {
      label: 'Client Orders',
      value: orderCount,
      href: '/admin/collections/orders',
      subtitle: 'Commissions & Fulfillment',
      icon: '📦',
      badge: 'Bespoke Pipeline',
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
      label: 'Concierge Inquiries',
      value: inquiryCount,
      href: '/admin/collections/inquiries',
      subtitle: 'Bespoke Consultations',
      icon: '✉️',
      badge: 'Client Care',
    },
  ]

  const quickActions = [
    { label: '+ New Product', href: '/admin/collections/products/create' },
    { label: '+ New Project', href: '/admin/collections/projects/create' },
    { label: '📦 Orders Flow', href: '/admin/collections/orders' },
    { label: '🚚 Delivery Tiers', href: '/admin/collections/delivery-methods' },
    { label: '🖼️ Media Vault', href: '/admin/collections/media' },
    { label: '🌐 Open Storefront', href: '/shop', external: true },
  ]

  return (
    <div className="ogedecor-dashboard-hero" style={{ marginBottom: '32px' }}>
      {/* Top Haute-Couture Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 24, 0.95) 0%, rgba(12, 12, 14, 0.98) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.28)',
          borderRadius: '16px',
          padding: '28px 32px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        {/* Subtle Decorative Golden Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#D4AF37',
                  boxShadow: '0 0 8px #D4AF37',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                }}
              >
                OgeDecor Haute Architecture & Furnishings
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'serif',
                fontSize: '28px',
                fontWeight: 600,
                color: '#F4E8C1',
                margin: '0 0 6px 0',
                letterSpacing: '0.04em',
              }}
            >
              Atelier Executive Suite
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#A1A1AA',
                margin: 0,
                maxWidth: '620px',
                lineHeight: 1.5,
              }}
            >
              Oversee high-end bespoke furniture inventory, architectural commissions, client orders, and logistics with seamless atelier precision.
            </p>
          </div>

          {/* Live Storefront Quick Link */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              href="/shop"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, #D4AF37 0%, #AA820A 100%)',
                color: '#0A0A0B',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Visit Live Storefront</span>
              <span style={{ fontSize: '14px' }}>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '22px',
            paddingTop: '18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#71717A', alignSelf: 'center', marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Quick Actions:
          </span>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#E4E4E7',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
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
            style={{
              display: 'block',
              padding: '20px 22px',
              borderRadius: '12px',
              background: 'linear-gradient(180deg, #18181B 0%, #121214 100%)',
              border: '1px solid rgba(212, 175, 55, 0.18)',
              textDecoration: 'none',
              boxShadow: '0 8px 24px -10px rgba(0, 0, 0, 0.5)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>{kpi.icon}</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '100px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                {kpi.badge}
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#FAFAFA', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#E4E4E7', marginBottom: '2px' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '11px', color: '#71717A' }}>{kpi.subtitle}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BeforeDashboard
