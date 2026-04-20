'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import { Plus, PlayCircle, Star } from 'lucide-react'
import { Anime } from '@/lib/jikan'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AddToListDialog } from '@/components/add-to-list-dialog'
import { useTiltEffect } from '@/hooks/animations/useTiltEffect'
import { useAnimateIn } from '@/hooks/useAnimateIn'
// anime.js stagger could be used globally for grids, but handled at layout layer

interface AnimeCardProps {
  anime: Anime
  className?: string
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const tiltProps = useTiltEffect<HTMLDivElement>(12)

  return (
    <div
      ref={tiltProps.ref}
      style={tiltProps.style}
      className={cn(
        "anime-card group relative flex flex-col overflow-visible cursor-pointer",
        className
      )}
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/5 shadow-card transition-all duration-300">
        <Image
          src={anime.images.webp.large_image_url || anime.images.webp.image_url}
          alt={anime.title}
          fill
          className="card-poster w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Inner shine sweep */}
        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay transition-opacity duration-300" style={tiltProps.shineStyle} />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
           <div className="flex flex-wrap items-center gap-2 mb-1 opacity-0 translate-y-4 group-hover:animate-page-entry group-hover:opacity-100" style={{ animationDelay: '50ms' }}>
              <span className="bg-accent/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20 font-spaceGrotesk text-white">
                {anime.type || 'TV'}
              </span>
              <span className="text-[11px] text-white/80 font-mono">
                {anime.episodes ? `Ep ${anime.episodes}` : 'Ongoing'}
              </span>
           </div>
           
           <div className="flex items-center gap-3 mt-3 opacity-0 translate-y-4 group-hover:animate-page-entry group-hover:opacity-100" style={{ animationDelay: '100ms' }}>
              <AddToListDialog
                anime={anime}
                trigger={
                  <Button 
                    size="sm" 
                    className="flex-1 bg-accent hover:bg-accent-dark text-white border-0 rounded-lg font-bold text-xs h-9 shadow-glow"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    ADD
                  </Button>
                }
              />
              <Button 
                size="icon" 
                variant="outline"
                className="h-9 w-9 rounded-lg border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <PlayCircle className="h-5 w-5" />
              </Button>
           </div>
        </div>

        {/* Score Badge (Top Right) */}
        {anime.score && (
          <div className="absolute top-2 right-2 bg-black/40 glass px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-xl z-20">
            <Star className="h-3 w-3 text-gold fill-gold" />
            <span className="text-[11px] font-mono font-bold text-gold">{anime.score.toFixed(1)}</span>
          </div>
        )}

      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-2xl -z-10 mix-blend-plus-lighter pointer-events-none mt-2 mx-1" style={{ width: 'calc(100% - 8px)', height: 'calc(100% - 40px)' }} />

      {/* Info Section */}
      <div className="card-info p-3 flex-1 flex flex-col justify-between z-10 w-full bg-transparent">
        <h3 className="text-sm font-semibold text-text line-clamp-2 leading-snug transition-colors group-hover:text-accent font-syne">
          {anime.title_english || anime.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
           <div className="flex gap-1.5 flex-wrap">
              {anime.genres?.slice(0, 1).map((genre: any) => (
                <span key={genre.mal_id} className="text-[10px] text-[--color-pink] uppercase font-bold tracking-wider">
                  {genre.name}
                </span>
              ))}
           </div>
           <span className="text-[10px] text-text-subtle font-mono">
             {anime.year || 'TBA'}
           </span>
        </div>
      </div>
    </div>
  )
}
