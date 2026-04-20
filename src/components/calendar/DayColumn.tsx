'use client'

import React from 'react'
import { AniListAiringSchedule } from '@/lib/anilist'
import { CalendarAnimeCard } from './AnimeCard'
import { cn } from '@/lib/utils'

interface DayColumnProps {
  date: Date
  schedules: AniListAiringSchedule[]
  isToday: boolean
}

export function DayColumn({ date, schedules, isToday }: DayColumnProps) {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className={cn(
      "flex flex-col flex-shrink-0 w-[280px] p-4 rounded-3xl min-h-[500px]",
      isToday ? "bg-surface-container-low border border-primary/20" : "bg-transparent"
    )}>
      {/* Column Header */}
      <div className="mb-6 px-2 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-surface/50 py-2 rounded-xl">
        <div className="flex flex-col">
          <span className={cn(
            "text-base font-black uppercase tracking-widest",
            isToday ? "text-primary" : "text-on-surface"
          )}>
            {isToday ? "Today" : dayName}
          </span>
          <span className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
            {dayDate}
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-highest text-[10px] font-bold">
              {schedules.length}
            </span>
          </span>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-4 flex-1">
        {schedules.length > 0 ? (
          <>
            {schedules.slice(0, 7).map((schedule, idx) => (
               <div key={`${schedule.media.id}-${schedule.episode}`} className="h-[auto]">
                 <CalendarAnimeCard schedule={schedule} index={idx} />
               </div>
            ))}
            {schedules.length > 7 && (
               <div className="py-2 text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-low rounded-xl border border-white/5">
                 +{schedules.length - 7} More Airings
               </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-outline-variant/10 rounded-2xl">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              No Airings
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
