'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AniListAiringSchedule } from '@/lib/anilist'
import { DayColumn } from './DayColumn'
import { CalendarAnimeCard } from './AnimeCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CalendarViewProps {
  schedules: AniListAiringSchedule[]
}

type TabType = 'today' | 'week' | 'upcoming'

export function CalendarView({ schedules }: CalendarViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('week')

  // Derive dates and group
  const { todaySchedules, weekDays, upcomingSchedules } = useMemo(() => {
    const now = new Date()
    const todayDateString = now.toDateString()
    
    // Generate next 7 days including today
    const weekDaysArray = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(now.getDate() + i)
      return {
        date: d,
        dateString: d.toDateString(),
        isToday: i === 0,
        schedules: [] as AniListAiringSchedule[]
      }
    })

    const seventhDayEndTime = new Date(weekDaysArray[6].date)
    seventhDayEndTime.setHours(23, 59, 59, 999)

    const todayArr: AniListAiringSchedule[] = []
    const upcomingArr: AniListAiringSchedule[] = []

    schedules.forEach(schedule => {
      const date = new Date(schedule.airingAt * 1000)
      const ds = date.toDateString()

      // Today
      if (ds === todayDateString) {
        todayArr.push(schedule)
      }

      // Week bucket matching
      const targetDay = weekDaysArray.find(d => d.dateString === ds)
      if (targetDay) {
        targetDay.schedules.push(schedule)
      } else if (date > seventhDayEndTime) {
        // Upcoming
        upcomingArr.push(schedule)
      }
    })

    return {
      todaySchedules: todayArr,
      weekDays: weekDaysArray,
      upcomingSchedules: upcomingArr
    }
  }, [schedules])

  return (
    <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto pt-6 px-4 pb-20">
      
      {/* Header and Controls */}
      <div className="flex items-end justify-between mb-8 flex-wrap py-4 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-[-0.02em] uppercase">
            Release Calendar
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            Synchronized with live broadcast networks. Local timezone enabled.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-surface-container-low p-1 rounded-[16px] border border-outline-variant/10 shadow-inner">
          {(['today', 'week', 'upcoming'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-[12px] text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === tab
                  ? "bg-surface shadow-sm text-on-surface border border-outline-variant/15"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              )}
            >
              {tab === 'week' ? '7 Days' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TODAY VIEW */}
          {activeTab === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {todaySchedules.length > 0 ? (
                todaySchedules.map((sched, idx) => (
                   <CalendarAnimeCard key={`${sched.media.id}-${sched.episode}`} schedule={sched} index={idx} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-on-surface-variant text-lg font-bold">No episodes remaining for today.</h3>
                </div>
              )}
            </motion.div>
          )}

          {/* WEEK VIEW (Horizontal Scroll) */}
          {activeTab === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-outline-variant/20 scrollbar-track-transparent"
            >
              <div className="flex gap-4 min-w-max pb-4">
                {weekDays.map((dayObj) => (
                  <DayColumn
                    key={dayObj.dateString}
                    date={dayObj.date}
                    isToday={dayObj.isToday}
                    schedules={dayObj.schedules}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* UPCOMING VIEW */}
          {activeTab === 'upcoming' && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {upcomingSchedules.length > 0 ? (
                upcomingSchedules.map((sched, idx) => (
                   <CalendarAnimeCard key={`${sched.media.id}-${sched.episode}`} schedule={sched} index={idx} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-on-surface-variant text-lg font-bold">Load more schedules to view future releases.</h3>
                  <p className="text-sm text-on-surface-variant/70 mt-2">The API loads the immediate 50 next airing episodes cross-network.</p>
                </div>
              )}
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    
      {/* Disclaimer / Info */}
      <div className="mt-12 text-center border-t border-outline-variant/10 pt-6">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
          Data provided by AniList GraphQL • Timezone resolved locally
        </p>
      </div>
    </div>
  )
}
