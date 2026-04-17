'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Info, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddToListDialog } from '@/components/add-to-list-dialog'
import { Anime } from '@/lib/jikan'

interface HeroSectionProps {
  anime: Anime
}

export function HeroSection({ anime }: HeroSectionProps) {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] rounded-3xl overflow-hidden mb-12 group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-center px-12 max-w-2xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-anime-purple-dark px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-white">
                Featured This Season
             </span>
             <span className="text-amber-400 font-bold flex items-center gap-1 text-sm">
                ★ {anime.score}
             </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
            {anime.title_english || anime.title}
          </h1>

          <p className="text-slate-300 text-lg line-clamp-3 mb-8 max-w-xl leading-relaxed">
            {anime.synopsis}
          </p>

          <div className="flex items-center gap-4">
            <Button className="bg-white text-slate-950 hover:bg-slate-200 px-8 h-12 rounded-xl font-bold flex gap-2">
              <Play className="h-5 w-5 fill-current" />
              Watch Trailer
            </Button>
            <AddToListDialog
              anime={anime}
              trigger={
                <Button variant="outline" className="bg-slate-900/40 border-slate-700 text-white hover:bg-slate-800 backdrop-blur-md px-6 h-12 rounded-xl font-bold flex gap-2 cursor-pointer">
                  <Plus className="h-5 w-5" />
                  Add to List
                </Button>
              }
            />
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-white hover:bg-white/10 backdrop-blur-md border border-white/10">
              <Info className="h-6 w-6" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator or extra flair could go here */}
    </div>
  )
}
