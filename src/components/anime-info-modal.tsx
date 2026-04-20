'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AddToListDialog } from '@/components/add-to-list-dialog'
import {
  X, Star, Tv, Calendar, Clock, Users, TrendingUp, Award,
  Plus, ExternalLink, Loader2
} from 'lucide-react'
import Image from 'next/image'
import { Anime, jikan } from '@/lib/jikan'
import { cn } from '@/lib/utils'

interface AnimeInfoModalProps {
  anime: Anime | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function StatChip({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | null | undefined }) {
  if (value == null) return null
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 flex-shrink-0">
      <Icon className="h-3 w-3 text-accent" />
      <span className="text-xs font-black text-white font-mono leading-none">{value}</span>
      <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle leading-none">{label}</span>
    </div>
  )
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
        className="sm:max-w-2xl w-full max-h-[90vh] overflow-hidden bg-[#0d0d14] border border-white/8 rounded-[28px] p-0 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row h-full max-h-[90vh]">

          {/* LEFT — Poster Column */}
          <div className="relative w-full sm:w-[200px] flex-shrink-0">
            <div className="relative h-52 sm:h-full min-h-[420px] w-full">
              <Image
                src={cover}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient fade into right panel on desktop */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d0d14]" />
              {/* Bottom fade on mobile */}
              <div className="sm:hidden absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/30 to-transparent" />
            </div>

            {/* Score badge */}
            {anime.score && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-gold/20 z-10">
                <Star className="h-3 w-3 text-gold fill-gold" />
                <span className="text-sm font-black text-gold font-mono">{anime.score.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* RIGHT — Info Column */}
          <div className="flex-1 overflow-y-auto min-w-0">
            {/* Close + spinner row */}
            <div className="flex items-center justify-between px-6 pt-5 pb-1">
              <div className="flex gap-2 flex-wrap">
                {anime.type && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-accent/20 text-accent border border-accent/20 px-2 py-0.5 rounded-md">
                    {anime.type}
                  </span>
                )}
                {anime.status && (
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                    anime.status.toLowerCase().includes('airing')
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-white/5 text-text-subtle border-white/5'
                  )}>
                    {anime.status.toLowerCase().includes('currently') ? 'On Air' : anime.status}
                  </span>
                )}
                {ratingClean && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-text-subtle border border-white/5 px-2 py-0.5 rounded-md">
                    {ratingClean}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {loading && <Loader2 className="h-3.5 w-3.5 text-accent animate-spin" />}
                <DialogClose
                  render={
                    <button
                      className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-subtle hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  }
                />
              </div>
            </div>

            {/* Title */}
            <div className="px-6 pb-4">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-tight">
                {title}
              </h2>
              {anime.title_japanese && (
                <p className="text-xs text-text-subtle mt-1">{anime.title_japanese}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-2 px-6 pb-5 overflow-x-auto scrollbar-none">
              {anime.episodes != null && anime.type !== 'Movie' && (
                <StatChip icon={Tv} label="Episodes" value={anime.episodes} />
              )}
              {anime.duration && (
                <StatChip icon={Clock} label="Runtime" value={anime.duration.replace(' per ep', '').replace(' min', 'm')} />
              )}
              {anime.year && <StatChip icon={Calendar} label="Year" value={anime.year} />}
              {anime.popularity && <StatChip icon={TrendingUp} label="Popularity" value={`#${anime.popularity}`} />}
              {anime.rank && <StatChip icon={Award} label="Rank" value={`#${anime.rank}`} />}
              {anime.scored_by && (
                <StatChip icon={Users} label="Votes" value={`${(anime.scored_by / 1000).toFixed(0)}K`} />
              )}
            </div>

            {/* Genres */}
            {(anime.genres?.length > 0 || (anime.themes && anime.themes.length > 0)) && (
              <div className="px-6 pb-5">
                <div className="flex flex-wrap gap-1.5">
                  {anime.genres?.map(g => (
                    <span key={g.mal_id} className="text-[10px] font-black uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-full">
                      {g.name}
                    </span>
                  ))}
                  {anime.themes?.map(t => (
                    <span key={t.mal_id} className="text-[10px] font-black uppercase tracking-widest text-text-subtle bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full h-px bg-white/5 mx-0 mb-5" />

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="px-6 pb-5">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent mb-2.5">Synopsis</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {anime.synopsis.replace('[Written by MAL Rewrite]', '').trim()}
                </p>
              </div>
            )}

            {/* Studio */}
            {anime.studios && anime.studios.length > 0 && (
              <div className="px-6 pb-5">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent mb-2.5">Studio</h3>
                <div className="flex flex-wrap gap-1.5">
                  {anime.studios.map(s => (
                    <span key={s.mal_id} className="text-xs font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {youtubeId && (
              <div className="px-6 pb-5">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent mb-2.5">Trailer</h3>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5">
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

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3 sticky bottom-0 bg-[#0d0d14] pt-4 border-t border-white/5">
              <AddToListDialog
                anime={anime}
                trigger={
                  <Button className="flex-1 bg-accent hover:bg-accent-dark text-white border-0 h-11 rounded-xl font-black uppercase text-xs tracking-[0.15em] shadow-lg shadow-accent/20 italic">
                    <Plus className="h-4 w-4 mr-2" />
                    Sync to Vault
                  </Button>
                }
              />
              {anime.url && (
                <a href={anime.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="h-11 w-11 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4" />
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
