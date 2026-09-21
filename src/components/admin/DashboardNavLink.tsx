'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const DashboardNavLink: React.FC = () => {
  const pathname = usePathname()
  const isDashboard = pathname === '/admin' || pathname === '/admin/'

  return (
    <div className="ogedecor-dashboard-nav-item">
      <Link
        href="/admin"
        className={`nav__link ogedecor-dashboard-btn ${isDashboard ? 'nav__link--active' : ''}`}
      >
        <span className="ogedecor-nav-icon">📊</span>
        <span className="ogedecor-nav-text">Dashboard</span>
      </Link>
    </div>
  )
}

export default DashboardNavLink
