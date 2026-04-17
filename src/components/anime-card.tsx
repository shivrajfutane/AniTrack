'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import { Plus, PlayCircle, Star } from 'lucide-react'
import { Anime } from '@/lib/jikan'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AddToListDialog } from '@/components/add-to-list-dialog'
import { bindCardHover } from '@/lib/animations'
import { useAnimateIn } from '@/hooks/useAnimateIn'

interface AnimeCardProps {
  anime: Anime
  className?: string
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const cardRef = useAnimateIn<HTMLDivElement>()

  useEffect(() => {
    if (cardRef.current) {
      const cleanup = bindCardHover(cardRef.current)
      return cleanup
    }
  }, [cardRef])

  return (
    <div
      ref={cardRef}
      className={cn(
        "anime-card group relative flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-card transition-all duration-300 hover:border-accent/40 hover:shadow-glow cursor-pointer",
        className
      )}
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={anime.images.webp.large_image_url || anime.images.webp.image_url}
          alt={anime.title}
          fill
          className="card-poster w-full h-full object-cover transition-transform duration-500"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
           <div className="flex items-center gap-2 mb-1">
              <span className="bg-accent/20 text-accent-light px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20">
                {anime.type || 'TV'}
              </span>
              <span className="text-[11px] text-white/80 font-medium">
                {anime.episodes ? `Ep ${anime.episodes}` : 'Ongoing'}
              </span>
           </div>
           
           <div className="flex items-center gap-3 mt-3">
              <AddToListDialog
                anime={anime}
                trigger={
                  <Button 
                    size="sm" 
                    className="flex-1 bg-accent hover:bg-accent-dark text-white border-0 rounded-lg font-bold text-xs h-9"
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
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-xl">
            <Star className="h-3 w-3 text-gold fill-gold" />
            <span className="text-[11px] font-mono font-bold text-gold">{anime.score.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="card-info p-3 flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-text line-clamp-2 leading-snug transition-colors group-hover:text-accent">
          {anime.title_english || anime.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
           <div className="flex gap-1.5">
              {anime.genres?.slice(0, 1).map((genre: any) => (
                <span key={genre.mal_id} className="text-[10px] text-text-muted">
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
