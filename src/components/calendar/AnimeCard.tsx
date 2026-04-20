'use client'

import React from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Countdown } from './Countdown'
import { AniListAiringSchedule } from '@/lib/anilist'
import { Button } from '@/components/ui/button'

interface CalendarAnimeCardProps {
  schedule: AniListAiringSchedule
  index?: number
}

export function CalendarAnimeCard({ schedule, index = 0 }: CalendarAnimeCardProps) {
  const { media, airingAt, episode } = schedule
  const title = media.title.english || media.title.romaji
  
  // Format the air time locally (e.g. "9:30 PM")
  const airTimeDate = new Date(airingAt * 1000)
  const airTimeString = airTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03 }}
      className="group relative flex flex-col gap-3 p-3 rounded-2xl bg-surface hover:bg-surface-container-low border border-transparent hover:border-outline-variant/15 transition-all cursor-pointer h-full"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-surface-container shadow-sm group-hover:shadow-lg transition-shadow">
        <Image
          src={media.coverImage.large}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="icon" className="h-10 w-10 rounded-full bg-primary text-on-primary shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Episode Badge positioned bottom left */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="px-2 py-1 bg-surface-container-highest/90 backdrop-blur-sm text-on-surface text-[10px] uppercase font-black tracking-widest rounded-md border border-outline-variant/20 shadow-sm">
            EP {episode}
          </span>
        </div>
      </div>

      {/* Info Block */}
      <div className="flex flex-col gap-2 flex-1">
        <div>
          <h3 className="text-sm font-bold text-on-surface line-clamp-2 leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            {airTimeString}
          </p>
        </div>

        <div className="mt-auto pt-2">
          <Countdown timestamp={airingAt} />
        </div>
      </div>
    </motion.div>
  )
}
