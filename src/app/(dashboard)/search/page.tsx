'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { Search as SearchIcon, X, Loader2, Zap, ArrowRight, Filter } from 'lucide-react'
import { jikan, Anime } from '@/lib/jikan'
import { AnimeCard } from '@/components/anime-card'
import { Button } from '@/components/ui/button'
import { StaggerGrid } from '@/components/animations/StaggerGrid'
import { useMagneticHover } from '@/hooks/animations/useMagneticHover'
import { useTextScramble } from '@/hooks/animations/useTextScramble'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Anime[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { ref, inView } = useInView()
  
  const { displayText: titleText, scramble } = useTextScramble<HTMLHeadingElement>("Global Scan", "mount")

  const fetchResults = useCallback(async (searchQuery: string, pageNum: number, isNewSearch: boolean) => {
    if (loading) return
    setLoading(true)
    setError(null)
    
    try {
      const response = await jikan.searchAnime(searchQuery, pageNum)
      if (isNewSearch) {
        setResults(response.data)
      } else {
        setResults(prev => [...prev, ...response.data])
      }
      setHasMore(response.pagination?.has_next_page || false)
    } catch (err: any) {
      console.error('Search error:', err)
      setError(err.message || 'Signal lost during transmission.')
    } finally {
      setLoading(false)
    }
  }, [loading])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchResults(query, 1, true)
    }, 500)
    return () => clearTimeout(timer)
  }, [query, fetchResults])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchResults(query, nextPage, false)
    }
  }, [inView, hasMore, loading, page, query, fetchResults])

  const magneticFilter = useMagneticHover<HTMLButtonElement>(0.2)

  return (
    <div className="space-y-12 pb-24 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10">
      <div className="flex flex-col gap-10 animate-page-entry -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="space-y-3">
          <h1 
            onMouseEnter={scramble}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic font-syne"
          >
            {titleText.slice(0, 7)}<span className="text-cyan drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">{titleText.slice(7)}</span>
          </h1>
          <p className="text-text-subtle font-medium max-w-lg leading-relaxed font-spaceGrotesk">
            Query the global broadcast network for active anime signatures. 
            <span className="text-cyan ml-2 glow-cyan">[Live Feed Active]</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 w-full relative z-20">
          <div className="relative flex-1 group w-full">
            <div className="absolute inset-0 bg-cyan/20 blur-[40px] opacity-0 group-focus-within:opacity-60 transition-opacity duration-700 pointer-events-none" />
            <div className="relative flex items-center bg-surface/50 border border-white/5 rounded-3xl px-6 py-2 focus-within:border-cyan focus-within:ring-4 focus-within:ring-cyan/20 transition-all h-20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] glass-elevated">
              <SearchIcon className="h-8 w-8 text-cyan mr-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
              <input
                type="text"
                placeholder="Query signatures..."
                className="w-full bg-transparent border-none outline-none text-white text-2xl font-black uppercase tracking-widest italic placeholder:text-white/20 py-2 font-syne"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="p-2 hover:bg-white/10 rounded-xl text-text-subtle hover:text-white transition-all ml-2"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center w-full md:w-auto">
             <Button 
                ref={magneticFilter.ref as any}
                style={magneticFilter.style as any}
                {...magneticFilter.bind()}
                variant="outline" 
                className="h-20 px-8 w-full md:w-auto bg-surface/50 border-white/5 text-text-subtle hover:text-white flex gap-3 rounded-3xl font-black uppercase tracking-widest text-sm italic transition-all hover:border-cyan shadow-xl glass"
              >
                <Filter className="h-6 w-6 text-cyan" />
                Parameters
             </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 max-w-full">
          <div className="h-12 w-12 bg-cyan/10 rounded-2xl border border-cyan/20 flex items-center justify-center shrink-0 shadow-glow">
             <Zap className="h-5 w-5 text-cyan" />
          </div>
          {['Action', 'Adventure', 'Seinen', 'Shonen', 'Sci-Fi', 'Psychological', 'Fantasy', 'Romance', 'Mecha'].map((genre) => (
            <button 
              key={genre}
              className="whitespace-nowrap px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-text-subtle text-xs font-black uppercase tracking-[0.2em] font-spaceGrotesk hover:border-cyan hover:text-cyan hover:bg-cyan/10 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] glass"
            >
              {genre}
            </button>
          ))}
          <div className="flex items-center gap-2 pl-4 text-cyan/40 font-black text-[10px] uppercase tracking-widest italic shrink-0">
             More Vectors <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {error && results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-8 animate-page-entry">
           <div className="h-32 w-32 bg-red-500/10 border border-red-500/20 rounded-[40px] flex items-center justify-center relative shadow-[0_0_50px_rgba(239,68,68,0.2)]">
              <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full mix-blend-screen" />
              <X className="h-12 w-12 text-red-500 opacity-60" />
           </div>
           <div className="space-y-2 text-center">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter font-syne">Static Detected</h3>
              <p className="text-red-400/80 font-medium font-spaceGrotesk max-w-sm">{error}</p>
           </div>
           <Button 
             onClick={() => fetchResults(query, 1, true)}
             variant="outline" 
             className="border-red-500/20 text-white hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 rounded-2xl px-10 h-16 font-black uppercase text-xs tracking-widest italic font-syne transition-all glass"
           >
             Re-Initiate Scan
           </Button>
        </div>
      ) : (
        <StaggerGrid className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {results.map((anime, index) => (
            <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
          ))}
        </StaggerGrid>
      )}

      {loading && results.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="aspect-[3/4] glass rounded-xl border border-white/5 animate-pulse overflow-hidden shadow-card relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 noise-overlay mix-blend-overlay" />
             </div>
           ))}
        </div>
      )}

      {loading && results.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="h-1 w-32 bg-cyan/20 rounded-full overflow-hidden shadow-glow">
             <div className="h-full bg-cyan w-full origin-left animate-shimmer" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan animate-pulse font-spaceGrotesk">Syncing Next Batch</p>
        </div>
      )}

      {error && results.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
           <p className="text-xs font-black uppercase tracking-widest text-red-400 font-syne">Data Corruption during sync</p>
           <Button 
             onClick={() => fetchResults(query, page, false)}
             size="sm"
             variant="link"
             className="text-white hover:text-cyan uppercase font-black italic tracking-widest text-[10px]"
           >
             Retry Tail
           </Button>
        </div>
      )}

      {!loading && results.length === 0 && query && (
         <div className="flex flex-col items-center justify-center py-40 gap-8 animate-page-entry">
            <div className="h-32 w-32 bg-cyan/5 border border-cyan/10 rounded-[40px] flex items-center justify-center relative shadow-glow">
               <div className="absolute inset-0 bg-cyan/10 blur-3xl rounded-full mix-blend-screen" />
               <SearchIcon className="h-12 w-12 text-cyan opacity-60" />
            </div>
            <div className="space-y-1 text-center">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter font-syne">Signature Not Found</h3>
               <p className="text-text-subtle font-medium font-spaceGrotesk">No archived records matching "{query}" were detected.</p>
            </div>
            <Button 
              onClick={() => setQuery('')}
              variant="outline" 
              className="border-white/10 text-white hover:text-cyan hover:border-cyan/50 hover:bg-cyan/10 rounded-2xl px-8 h-14 font-black uppercase text-xs tracking-widest italic font-syne transition-all glass"
            >
              Reset Query
            </Button>
         </div>
      )}

      <div ref={ref} className="h-20" />
    </div>
  )
}
