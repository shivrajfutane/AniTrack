'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Play, Info, Plus, Star, ChevronLeft, ChevronRight } from 'lucide-react'
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
  animeList: Anime[]
}

export function HeroSection({ animeList }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  
  const anime = animeList[currentIndex] || animeList[0]
  const title = anime.title_english || anime.title
  const isLongTitle = title.length > 25

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(10, animeList.length))
      setIsTransitioning(false)
    }, 500)
  }

  const handlePrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => 
        (prev - 1 + Math.min(10, animeList.length)) % Math.min(10, animeList.length)
      )
      setIsTransitioning(false)
    }, 500)
  }

  useEffect(() => {
    if (!animeList || animeList.length <= 1) return

    const interval = setInterval(() => {
      handleNext()
    }, 8000) // Change every 8 seconds

    return () => clearInterval(interval)
  }, [animeList, isTransitioning])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    setDragStartX(clientX)
  }

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX === null) return
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX
    const diff = dragStartX - clientX

    if (diff > 50) handleNext()
    else if (diff < -50) handlePrev()
    
    setDragStartX(null)
  }
  
  useGSAP(() => {
    if (!isTransitioning) {
      animateHeroTitle('#hero-title')
    }
  }, [currentIndex, isTransitioning])

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    rippleButton(e.currentTarget, e.nativeEvent)
  }

  const magneticBtnProps1 = useMagneticHover<HTMLButtonElement>(0.3)
  const magneticBtnProps2 = useMagneticHover<HTMLButtonElement>(0.3)
  const posterTilt = useTiltEffect<HTMLDivElement>(8)

  return (
    <div 
      ref={heroRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      className="relative w-full h-[80vh] min-h-[600px] rounded-[32px] overflow-hidden shadow-none flex items-end pb-24 select-none group cursor-grab active:cursor-grabbing"
    >
      {/* Navigation Arrows */}
      <button 
        onClick={(e) => { e.stopPropagation(); handlePrev() }}
        className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-surface-container/50 text-on-surface opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-highest backdrop-blur-md border border-outline-variant/15 hidden md:block"
        aria-label="Previous Anime"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button 
        onClick={(e) => { e.stopPropagation(); handleNext() }}
        className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-surface-container/50 text-on-surface opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-highest backdrop-blur-md border border-outline-variant/15 hidden md:block"
        aria-label="Next Anime"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-40">
        <HeroParticleCanvas />
      </div>

      <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
        <div className="absolute right-0 top-0 bottom-0 w-[60%] overflow-hidden">
           <Image
             src={anime.images.webp.large_image_url}
             alt={anime.title}
             fill
             className="object-cover opacity-50 select-none mask-image-linear-to-l"
             priority
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center px-10 md:px-20 gap-8">
        {/* Left Content */}
        <div className={`flex-1 space-y-6 max-w-3xl mt-auto transition-all duration-500 ${isTransitioning ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}>
          <div className="flex items-center gap-3 opacity-0 animate-[page-entry_0.6s_ease-out_0.2s_forwards]">
             <span className="bg-primary px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-on-primary">
                Featured
             </span>
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-outline-variant/15 text-tertiary">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-bold font-mono text-on-surface">{anime.score}</span>
             </div>
          </div>

          <h1 
            id="hero-title"
            className={`font-black text-on-surface leading-[1.05] tracking-[-0.02em] font-sans text-balance line-clamp-3 py-1 ${
              isLongTitle ? 'text-4xl md:text-5xl lg:text-7xl' : 'text-5xl md:text-7xl lg:text-[100px]'
            }`}
          >
            {title}
          </h1>

          <p className="text-on-surface-variant text-base md:text-lg line-clamp-3 max-w-2xl leading-relaxed font-medium">
            {anime.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button 
              ref={magneticBtnProps1.ref as any}
              style={magneticBtnProps1.style as any}
              {...magneticBtnProps1.bind()}
              onMouseDown={handleRipple}
              className="bg-primary text-on-primary hover:bg-primary-container hover:text-white px-10 h-14 rounded-[12px] font-bold uppercase text-xs tracking-widest flex gap-2 transition-all font-sans"
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
                  className="bg-surface-container border-outline-variant/15 text-on-surface hover:bg-surface-container-highest px-8 h-14 rounded-[12px] font-bold uppercase text-xs tracking-widest flex gap-2 transition-all font-sans"
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
              className="h-14 w-14 rounded-[12px] text-on-surface hover:bg-surface-container-highest border border-outline-variant/15"
            >
              <Info className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Right Tilt Poster */}
        <div className={`hidden lg:block relative w-[300px] xl:w-[350px] aspect-[2/3] mt-auto transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-y-12 scale-95' : 'opacity-100 translate-y-0 scale-100'}`} ref={posterTilt.ref} style={posterTilt.style}>
             <div className="absolute inset-0 rounded-[16px] overflow-hidden bg-surface-container-low border border-outline-variant/15">
                <Image
                  key={`poster-${anime.mal_id}`}
                  src={anime.images.webp.large_image_url}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface/40" />
             </div>
        </div>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {animeList.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsTransitioning(false)
              }, 500)
            }}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index 
                ? 'w-6 h-1.5 bg-primary' 
                : 'w-1.5 h-1.5 bg-on-surface-variant/40 hover:bg-on-surface-variant/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
