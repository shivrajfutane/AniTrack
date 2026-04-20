'use client'

import React from 'react'
import { useScrollReveal } from '@/hooks/animations/useScrollReveal'
import { cn } from '@/lib/utils'

interface ScrollRevealSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  offset?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function ScrollRevealSection({ 
  children, 
  className,
  offset = 50,
  direction = 'up',
  ...props 
}: ScrollRevealSectionProps) {
  const ref = useScrollReveal<HTMLDivElement>({ y: direction === 'down' ? -offset : offset })

  return (
    <section ref={ref} className={cn("will-change-transform opacity-0", className)} {...props}>
      {children}
    </section>
  )
}
