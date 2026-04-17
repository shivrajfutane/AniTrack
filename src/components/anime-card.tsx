'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Plus, PlayCircle } from 'lucide-react'
import { Anime } from '@/lib/jikan'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AddToListDialog } from '@/components/add-to-list-dialog'

interface AnimeCardProps {
  anime: Anime
  className?: string
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-800 backdrop-blur-sm transition-all hover:border-anime-purple/50 hover:shadow-2xl hover:shadow-anime-purple/10",
        className
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        
        {/* Score Badge */}
        {anime.score && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
            <Star className="h-3 w-3 fill-amber-400" />
            {anime.score}
          </div>
        )}

        {/* Action Buttons (Visible on Hover) */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <AddToListDialog
            anime={anime}
            trigger={
              <Button size="icon" className="rounded-full bg-anime-purple-dark text-white border-0 shadow-lg cursor-pointer">
                <Plus className="h-5 w-5" />
              </Button>
            }
          />
          <Button size="icon" className="rounded-full bg-white text-slate-950 border-0 shadow-lg cursor-pointer">
            <PlayCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-white line-clamp-1 group-hover:text-anime-teal transition-colors">
          {anime.title_english || anime.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{anime.type}</span>
          <span className="text-slate-700">•</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">{anime.season} {anime.year}</span>
        </div>
        
        {/* Genre Chips */}
        <div className="mt-3 flex gap-2 overflow-hidden">
           {anime.genres.slice(0, 2).map((genre) => (
             <span 
               key={genre.mal_id}
               className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-400 border border-slate-700 font-medium"
             >
               {genre.name}
             </span>
           ))}
        </div>
      </div>
    </motion.div>
  )
}
