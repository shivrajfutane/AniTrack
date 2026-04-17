'use client'

import React, { useState, useEffect } from 'react'
import { pulseCountdown } from '@/lib/animations'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface EpisodeCountdownProps {
  targetDate: string | Date
}

export function EpisodeCountdown({ targetDate }: EpisodeCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      let timeLeft: TimeLeft | null = null

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return timeLeft
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const nextTime = calculateTimeLeft()
      if (nextTime) {
        setTimeLeft(nextTime)
        pulseCountdown('.countdown-number')
      } else {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) {
    return (
      <div className="bg-muted/50 px-4 py-2 rounded-xl border border-white/5">
        <span className="text-xs font-bold text-accent tracking-widest uppercase">Streaming Live</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 font-mono" role="timer">
      {(Object.entries(timeLeft) as [keyof TimeLeft, number][]).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <span className="countdown-number bg-muted/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm font-bold text-accent min-w-[3rem] text-center tabular-nums shadow-lg">
            {value.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] text-text-subtle mt-1 uppercase tracking-widest font-sans font-bold">
            {unit.slice(0, 3)}
          </span>
        </div>
      ))}
    </div>
  )
}
