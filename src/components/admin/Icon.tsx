import React from 'react'
import Image from 'next/image'

export const Icon: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image
        src="/ogedecoricon.png"
        alt="OgeDecor Icon"
        width={26}
        height={26}
        style={{
          borderRadius: '50%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.4))',
        }}
      />
    </div>
  )
}

export default Icon
