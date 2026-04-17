'use client'

import React, { useEffect, useRef } from 'react'
import { animateScoreRing, animateCounter } from '@/lib/animations'

interface ScoreRingProps {
  score: number
  maxScore?: number
}

export function ScoreRing({ score, maxScore = 10 }: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const scoreRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (circleRef.current && scoreRef.current) {
      animateScoreRing(circleRef.current, score, maxScore)
      animateCounter(scoreRef.current, score, 1)
    }
  }, [score, maxScore])

  return (
    <div className="relative w-14 h-14" role="img" aria-label={`Anime score: ${score} out of ${maxScore}`}>
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle 
          cx="40" 
          cy="40" 
          r="34" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="6" 
          className="text-white/5"
        />
        <circle 
          ref={circleRef}
          cx="40" 
          cy="40" 
          r="34" 
          fill="none" 
          stroke="var(--color-gold)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          style={{ strokeDasharray: '213.6', strokeDashoffset: '213.6' }}
        />
      </svg>
      <span 
        ref={scoreRef}
        className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gold font-mono"
      >
        0.0
      </span>
    </div>
  )
}
