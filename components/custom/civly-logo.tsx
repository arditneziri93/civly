import * as React from 'react'

import Image, { ImageProps } from 'next/image'

type CivlyLogoProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string
}

export function CivlyLogo({
  height = 63,
  width = 127,
  priority = true,
  ...props
}: CivlyLogoProps) {
  return (
    <Image
      src="/civly-logo.svg"
      alt="Civly Logo"
      width={width}
      height={height}
      priority={priority}
      {...props}
    />
  )
}
