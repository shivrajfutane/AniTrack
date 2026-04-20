'use client'

import React, { useRef } from 'react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

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

  useEffect(() => {
    if (!containerRef.current) return
    const children = Array.from(containerRef.current.children) as HTMLElement[]
    
    // Set initial custom properties for the transition duration
    children.forEach((child) => {
      child.style.opacity = '0'
      child.style.transform = 'translateY(30px)'
      child.style.transition = 'none'
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            // Apply staggered transitions
            child.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}s`
            child.style.opacity = '1'
            child.style.transform = 'translateY(0)'
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [staggerDelay])

  return (
    <div ref={containerRef} className={cn("grid", className)} {...props}>
      {children}
    </div>
  )
}
