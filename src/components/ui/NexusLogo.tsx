'use client'

import React from 'react'
import Image from 'next/image'

interface NexusLogoProps {
  variant?: 'dark' | 'light'
  height?: number
  className?: string
  iconOnly?: boolean
  alt?: string
}

export function NexusLogo({
  variant = 'dark',
  height = 26,
  className = '',
  iconOnly = false,
  alt = 'NEXUS OS',
}: NexusLogoProps) {
  if (iconOnly) {
    const size = height
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          position: 'relative',
        }}
      >
        <Image
          src="/brand/nexus-icon.png"
          alt={alt}
          width={size}
          height={size}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          priority
        />
      </div>
    )
  }

  // Aspect ratio is 958 / 127 = 7.543
  const width = Math.round(height * 7.543)
  const src = variant === 'light' ? '/brand/nexus-logo-light.webp' : '/brand/nexus-logo-dark.webp'

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height,
        width,
        position: 'relative',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        priority
      />
    </div>
  )
}

export default NexusLogo
