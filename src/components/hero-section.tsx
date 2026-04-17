'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Play, Info, Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddToListDialog } from '@/components/add-to-list-dialog'
import { Anime } from '@/lib/jikan'
import { animateHeroTitle, rippleButton } from '@/lib/animations'
import { useGSAP } from '@gsap/react'

interface HeroSectionProps {
  anime: Anime
}

export function HeroSection({ anime }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    animateHeroTitle('#hero-title')
  }, { scope: heroRef })

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    rippleButton(e.currentTarget, e.nativeEvent)
  }

  return (
    <div 
      ref={heroRef}
      className="relative w-full h-[65vh] lg:h-[75vh] min-h-[500px] rounded-[40px] overflow-hidden group shadow-2xl"
    >
      {/* Background Cinematic layer */}
      <div className="absolute inset-0">
        <Image
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 blur-[1px] group-hover:blur-0"
          priority
        />
        {/* Dynamic Vignet / Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      </div>

      <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <span className="bg-accent px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-[0.2em] text-white shadow-xl shadow-accent/20 italic">
                Prime Selection
             </span>
             <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                <span className="text-sm font-black text-gold font-mono">{anime.score}</span>
             </div>
          </div>

          <h1 
            id="hero-title"
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl"
          >
            {anime.title_english || anime.title}
          </h1>

          <p className="text-white/60 text-base md:text-lg line-clamp-3 max-w-xl leading-relaxed font-medium">
            {anime.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button 
              onMouseDown={handleRipple}
              className="bg-white text-black hover:bg-white/90 px-10 h-14 rounded-2xl font-black uppercase text-xs tracking-widest italic flex gap-2 shadow-2xl transition-all active:scale-95"
            >
              <Play className="h-5 w-5 fill-current" />
              Watch Trailer
            </Button>
            
            <AddToListDialog
              anime={anime}
              trigger={
                <Button 
                  onMouseDown={handleRipple}
                  variant="outline" 
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-xl px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest italic flex gap-2 transition-all active:scale-95"
                >
                  <Plus className="h-5 w-5" />
                  Add to Vault
                </Button>
              }
            />
            
            <Button 
              onMouseDown={handleRipple}
              variant="ghost" 
              size="icon" 
              className="h-14 w-14 rounded-2xl text-white hover:bg-white/10 backdrop-blur-md border border-white/5"
            >
              <Info className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
