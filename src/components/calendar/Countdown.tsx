'use client'

import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CountdownProps {
  timestamp: number // UNIX seconds
  className?: string
}

export function Countdown({ timestamp, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = timestamp * 1000 - Date.now()
      
      if (diff <= 0) {
        setIsLive(true)
        return 'Airing Now'
      }
      
      setIsLive(false)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`
      }
      return `${hours}h ${minutes}m ${seconds}s`
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [timestamp])

  // Prevent hydration mismatch by returning empty initially 
  // or a skeleton if desired. We will render as is, but Next.js
  // might complain if `Date.now()` differs between server and client.
  // We'll use a suppressHydrationWarning wrapper or handle mounted state.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  
  if (!mounted) {
    return <div className={cn("text-xs font-mono text-transparent", className)}>00:00:00</div>
  }

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold tracking-widest uppercase font-mono shadow-sm",
      isLive ? "bg-primary text-on-primary animate-pulse" : "bg-surface-container text-on-surface",
      className
    )}>
      <Clock className="w-3.5 h-3.5" />
      <span>{timeLeft}</span>
    </div>
  )
}
