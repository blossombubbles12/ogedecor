import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
      <Image
        src="/ogedecoricon.png"
        alt="OgeDecor Emblem"
        width={32}
        height={32}
        style={{
          borderRadius: '50%',
          objectFit: 'contain',
          boxShadow: '0 0 12px rgba(212, 175, 55, 0.35)',
        }}
        priority
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          className="ogedecor-logo-title"
          style={{
            fontFamily: 'serif',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          Ogedecor
        </span>
        <span
          className="ogedecor-logo-subtitle"
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.22em',
            color: '#D4AF37',
            textTransform: 'uppercase',
            opacity: 0.9,
          }}
        >
          Management CMS
        </span>
      </div>
    </div>
  )
}

export default Logo
