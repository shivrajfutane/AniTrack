'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Play, Info, Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddToListDialog } from '@/components/add-to-list-dialog'
import { Anime } from '@/lib/jikan'
import { animateHeroTitle, rippleButton } from '@/lib/animations'
import { useGSAP } from '@gsap/react'
import { useTiltEffect } from '@/hooks/animations/useTiltEffect'
import { useMagneticHover } from '@/hooks/animations/useMagneticHover'

const HeroParticleCanvas = dynamic(() => import('@/components/three/HeroParticleCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#09090B]" />
})

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

  const magneticBtnProps1 = useMagneticHover<HTMLButtonElement>(0.3)
  const magneticBtnProps2 = useMagneticHover<HTMLButtonElement>(0.3)
  const posterTilt = useTiltEffect<HTMLDivElement>(8)

  return (
    <div 
      ref={heroRef}
      className="relative w-full h-[65vh] lg:h-[75vh] min-h-[500px] rounded-[40px] overflow-hidden shadow-2xl flex items-center"
    >
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60">
        <HeroParticleCanvas />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-0 bottom-0 w-[50%] overflow-hidden">
           <Image
             src={anime.images.webp.large_image_url}
             alt={anime.title}
             fill
             className="object-cover blur-[20px] opacity-30 select-none"
             priority
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B]/20" />
      </div>

      <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center px-8 md:px-16 gap-8">
        {/* Left Content */}
        <div className="flex-1 space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 opacity-0 animate-[page-entry_0.6s_ease-out_0.2s_forwards]">
             <span className="bg-accent px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-[0.2em] text-white shadow-glow italic font-syne">
                Featured
             </span>
             <div className="flex items-center gap-1.5 bg-black/40 glass px-3 py-1 rounded-full border border-white/10">
                <Star className="h-3.5 w-3.5 text-gold-neon fill-gold-neon drop-shadow-lg" />
                <span className="text-sm font-black text-gold-neon font-mono">{anime.score}</span>
             </div>
          </div>

          <h1 
            id="hero-title"
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl font-syne"
          >
            {anime.title_english || anime.title}
          </h1>

          <p className="text-white/80 text-base md:text-lg line-clamp-3 max-w-xl leading-relaxed font-medium">
            {anime.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button 
              ref={magneticBtnProps1.ref as any}
              style={magneticBtnProps1.style as any}
              {...magneticBtnProps1.bind()}
              onMouseDown={handleRipple}
              className="bg-white text-black hover:bg-white/90 px-10 h-14 rounded-2xl font-black uppercase text-xs tracking-widest italic flex gap-2 shadow-2xl transition-all font-syne"
            >
              <Play className="h-5 w-5 fill-current" />
              Watch Trailer
            </Button>
            
            <AddToListDialog
              anime={anime}
              trigger={
                <Button 
                  ref={magneticBtnProps2.ref as any}
                  style={magneticBtnProps2.style as any}
                  {...magneticBtnProps2.bind()}
                  onMouseDown={handleRipple}
                  variant="outline" 
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 glass px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest italic flex gap-2 transition-all font-syne"
                >
                  <Plus className="h-5 w-5" />
                  Add to My List
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

        {/* Right Tilt Poster */}
        <div className="hidden lg:block relative w-[300px] xl:w-[350px] aspect-[2/3]" ref={posterTilt.ref} style={posterTilt.style}>
             <div className="absolute inset-0 rounded-3xl overflow-hidden glass shadow-[0_32px_64px_rgba(0,0,0,0.8)] border-4 border-white/5">
                <Image
                  src={anime.images.webp.large_image_url}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#09090B]/60" />
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={posterTilt.shineStyle} />
             </div>
             <div className="absolute -inset-10 bg-accent opacity-20 blur-3xl rounded-full -z-10 mix-blend-plus-lighter" />
        </div>
      </div>
    </div>
  )
}
