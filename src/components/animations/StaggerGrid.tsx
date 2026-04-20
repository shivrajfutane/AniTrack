'use client'

import React, { useRef } from 'react'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/gsap-config'
import { useGSAP } from '@gsap/react'

interface StaggerGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  staggerDelay?: number
}

export function StaggerGrid({ 
  children, 
  className, 
  staggerDelay = 0.1,
  ...props 
}: StaggerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    gsap.from(containerRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: staggerDelay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={cn("grid", className)} {...props}>
      {children}
    </div>
  )
}
