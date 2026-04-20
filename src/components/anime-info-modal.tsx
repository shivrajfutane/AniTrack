'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AddToListDialog } from '@/components/add-to-list-dialog'
import { X, Star, ExternalLink, Loader2, Play } from 'lucide-react'
import Image from 'next/image'
import { Anime, jikan } from '@/lib/jikan'
import { cn } from '@/lib/utils'

interface AnimeInfoModalProps {
  anime: Anime | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnimeInfoModal({ anime: initialAnime, open, onOpenChange }: AnimeInfoModalProps) {
  const [anime, setAnime] = useState<Anime | null>(initialAnime)
  const [loading, setLoading] = useState(false)

  const fetchDetails = useCallback(async (id: number) => {
    setLoading(true)
    try {
      const res = await jikan.getAnimeById(id)
      setAnime(res.data)
    } catch {
      // fallback to initial card data on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open && initialAnime) {
      setAnime(initialAnime)
      fetchDetails(initialAnime.mal_id)
    }
  }, [open, initialAnime, fetchDetails])

  if (!anime) return null

  const title = anime.title_english || anime.title
  const cover = anime.images.webp.large_image_url || anime.images.webp.image_url
  const youtubeId = anime.trailer?.youtube_id
  const ratingClean = anime.rating
    ?.replace(' - Teens 13 or older', '')
    .replace(' - Mild Nudity', '')
    .replace(' - Violence & Profanity', '')
    .trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl w-full max-h-[90vh] overflow-hidden bg-surface-container-low border-0 outline outline-1 outline-outline-variant/15 rounded-[24px] p-0 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row h-full max-h-[90vh]">

          {/* LEFT — Poster Column */}
          <div className="relative w-full sm:w-[250px] flex-shrink-0">
            <div className="relative h-64 sm:h-full min-h-[420px] w-full bg-surface">
              <Image
                src={cover}
                alt={title}
                fill
                className="object-cover object-center"
                priority
              />
              {/* Desktop smooth gradient blend */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-transparent via-surface-container-low/50 to-surface-container-low" />
              {/* Mobile bottom dissolve */}
              <div className="sm:hidden absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent" />
            </div>

            {/* Premium Score Ribbon */}
            {anime.score && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-outline-variant/15 z-10">
                <Star className="h-3.5 w-3.5 text-primary fill-current" />
                <span className="text-sm font-bold text-on-surface font-mono leading-none">{anime.score.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* RIGHT — Info Column */}
          <div className="flex-1 overflow-y-auto min-w-0 bg-surface-container-low scrollbar-default">
            {/* Header: Close + Load state */}
            <div className="flex items-center justify-end px-6 pt-5 pb-2">
              <div className="flex items-center gap-3">
                {loading && <Loader2 className="h-4 w-4 text-on-surface-variant animate-spin" />}
                <DialogClose
                  render={
                    <button
                      className="h-8 w-8 rounded-full bg-surface-container hover:bg-surface-container-highest flex items-center justify-center text-on-surface transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  }
                />
              </div>
            </div>

            {/* Title & Micro-stats */}
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {anime.type && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-on-primary px-2 py-0.5 rounded-md font-sans">
                    {anime.type}
                  </span>
                )}
                {anime.status && (
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md font-sans border border-outline-variant/15",
                    anime.status.toLowerCase().includes('airing')
                      ? 'bg-primary-container/30 text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  )}>
                    {anime.status.toLowerCase().includes('currently') ? 'On Air' : anime.status}
                  </span>
                )}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-on-surface tracking-[-0.02em] font-sans leading-tight text-balance">
                {title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-medium text-on-surface-variant">
                {anime.year && <span>{anime.year}</span>}
                {anime.year && anime.episodes && <span className="w-1 h-1 rounded-full bg-outline-variant/30" />}
                {anime.episodes && <span>{anime.episodes} Episodes</span>}
                {anime.episodes && anime.duration && <span className="w-1 h-1 rounded-full bg-outline-variant/30" />}
                {anime.duration && <span>{anime.duration.replace(' per ep', '')}</span>}
                {anime.duration && ratingClean && <span className="w-1 h-1 rounded-full bg-outline-variant/30" />}
                {ratingClean && <span>{ratingClean}</span>}
              </div>
            </div>

            <div className="w-full h-px bg-outline-variant/10 mx-0 mb-6" />

            {/* Genres */}
            {(anime.genres?.length > 0) && (
              <div className="px-6 pb-6">
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map(g => (
                    <span key={g.mal_id} className="text-xs font-medium text-on-surface bg-surface-container border border-outline-variant/15 px-3 py-1 rounded-full transition-colors hover:bg-surface-container-highest">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="px-6 pb-6">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {anime.synopsis.replace('[Written by MAL Rewrite]', '').trim()}
                </p>
              </div>
            )}

            {/* Trailer embed context */}
            {youtubeId && (
              <div className="px-6 pb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-3 font-sans">Trailer</h3>
                <div className="relative aspect-video w-full rounded-[16px] overflow-hidden border border-outline-variant/15 bg-surface">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                    title={`${title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="px-6 pb-6 flex gap-3 sticky bottom-0 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent pt-6">
              <AddToListDialog
                anime={anime}
                trigger={
                  <Button className="flex-1 bg-primary hover:bg-primary-container text-on-primary hover:text-white h-12 rounded-[12px] font-bold uppercase text-xs tracking-widest transition-all font-sans">
                    Add to My List
                  </Button>
                }
              />
              {anime.url && (
                <a href={anime.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="h-12 w-12 rounded-[12px] border-outline-variant/15 bg-surface-container text-on-surface hover:bg-surface-container-highest transition-colors"
                    aria-label="View on MyAnimeList"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </a>
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
