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
      className={cn(
        "group relative flex flex-col bg-[#0F172A]/40 border border-slate-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-anime-teal/5 hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={anime.images.webp.large_image_url || anime.images.webp.image_url}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Rating/Type Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {anime.score && (
            <div className="bg-[#020617]/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/50 flex items-center gap-1 shadow-lg">
              <Star className="h-3 w-3 text-anime-teal fill-anime-teal" />
              <span className="text-[10px] font-black text-white">{anime.score.toFixed(1)}</span>
            </div>
          )}
          <div className="bg-anime-sky/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 shadow-lg">
            <span className="text-[9px] font-black text-white uppercase tracking-tighter">{anime.type || 'TV'}</span>
          </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <AddToListDialog
            anime={anime}
            trigger={
              <Button size="icon" className="h-12 w-12 rounded-full bg-anime-teal text-white border-0 shadow-2xl shadow-anime-teal/40 cursor-pointer hover:scale-110 active:scale-95 transition-all">
                <Plus className="h-6 w-6" />
              </Button>
            }
          />
          <Button size="icon" className="h-12 w-12 rounded-full bg-[#E2E8F0] text-[#020617] border-0 shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all">
            <PlayCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-anime-teal transition-colors tracking-tight">
          {anime.title_english || anime.title}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 pt-1">
          {anime.genres?.slice(0, 2).map((genre: any) => (
            <span 
              key={genre.mal_id} 
              className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 bg-[#020617]/50 px-2 py-0.5 rounded-full border border-slate-800/50"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
