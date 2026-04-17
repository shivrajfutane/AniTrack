'use client'

import React, { useEffect, useRef } from 'react'
import { animateSkeletonShimmer, animateSkeletonIn } from '@/lib/animations'

export function SkeletonCard() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      animateSkeletonIn('.skeleton-card')
      animateSkeletonShimmer('.skeleton-shimmer')
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="skeleton-card flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-card"
    >
      <div className="aspect-[3/4] bg-muted/30 relative overflow-hidden">
         <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full" />
      </div>
      <div className="p-3 space-y-3">
        <div className="h-4 bg-muted/40 rounded-lg w-4/5 skeleton-shimmer" />
        <div className="h-3 bg-muted/20 rounded-lg w-2/5 skeleton-shimmer" />
      </div>
    </div>
  )
}
