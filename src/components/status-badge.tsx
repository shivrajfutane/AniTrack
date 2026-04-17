'use client'

import React, { useEffect, useRef } from 'react'
import { animateBadgeIn } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'Watching' | 'Completed' | 'Dropped' | 'Plan to Watch' | 'On Hold' | string
  className?: string
}

const statusConfig: Record<string, { bg: string, text: string }> = {
  'Watching':      { bg: 'bg-blue-500/10',  text: 'text-blue-400'  },
  'Completed':     { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'Dropped':       { bg: 'bg-red-500/10',   text: 'text-red-400'   },
  'Plan to Watch': { bg: 'bg-indigo-500/10',      text: 'text-indigo-400' },
  'On Hold':       { bg: 'bg-amber-500/10',    text: 'text-amber-400' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const badgeRef = useRef<HTMLSpanElement>(null)
  
  const config = statusConfig[status] || { bg: 'bg-muted/50', text: 'text-text-muted' }

  useEffect(() => {
    if (badgeRef.current) {
      animateBadgeIn(badgeRef.current)
    }
  }, [])

  return (
    <span 
      ref={badgeRef}
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border border-white/5",
        config.bg,
        config.text,
        className
      )}
    >
      {status}
    </span>
  )
}
