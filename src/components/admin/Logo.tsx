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
          style={{
            fontFamily: 'serif',
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#F4E8C1',
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          OgeDecor
        </span>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.24em',
            color: '#D4AF37',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}
        >
          Atelier CMS
        </span>
      </div>
    </div>
  )
}

export default Logo
