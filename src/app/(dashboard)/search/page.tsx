'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Search as SearchIcon, X, SlidersHorizontal, Loader2, Zap, ArrowRight, Filter } from 'lucide-react'
import { jikan, Anime } from '@/lib/jikan'
import { AnimeCard } from '@/components/anime-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/gsap-config'
import { useGSAP } from '@gsap/react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Anime[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const fetchResults = useCallback(async (searchQuery: string, pageNum: number, isNewSearch: boolean) => {
    if (loading) return
    setLoading(true)
    
    try {
      const response = await jikan.searchAnime(searchQuery, pageNum)
      if (isNewSearch) {
        setResults(response.data)
      } else {
        setResults(prev => [...prev, ...response.data])
      }
      setHasMore(response.pagination?.has_next_page || false)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [loading])

  // Initial search or on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchResults(query, 1, true)
    }, 500) // Debounce search
    return () => clearTimeout(timer)
  }, [query, fetchResults])

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchResults(query, nextPage, false)
    }
  }, [inView, hasMore, loading, page, query, fetchResults])

  useGSAP(() => {
    if (results.length > 0) {
      gsap.from('.anime-card', {
        opacity: 0,
        y: 20,
        stagger: {
          amount: 0.4,
          from: 'start'
        },
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all'
      })
    }
  }, [results])

  return (
    <main id="page-root" className="min-h-screen pb-20 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10 space-y-12">
      {/* Search Header */}
      <div className="flex flex-col gap-10 animate-page-entry">
        <div className="space-y-3">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
            Global<span className="text-accent underline decoration-4 underline-offset-8">Scan</span>
          </h1>
          <p className="text-text-subtle font-medium max-w-lg leading-relaxed">
            Query the global broadcast network for active anime signatures. 
            <span className="text-accent ml-2">[Live Feed Active]</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
          <div className="relative flex-1 group w-full">
            <div className="absolute inset-0 bg-accent/20 blur-2xl opacity-0 group-focus-within:opacity-40 transition-opacity" />
            <div className="relative flex items-center bg-surface/50 border border-white/5 rounded-3xl px-6 py-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all h-16 shadow-xl shadow-black/20 backdrop-blur-xl">
              <SearchIcon className="h-6 w-6 text-accent mr-4" />
              <input
                type="text"
                placeholder="Query anime signatures..."
                className="w-full bg-transparent border-none outline-none text-white text-lg font-bold placeholder:text-text-subtle/50 py-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="p-2 hover:bg-white/10 rounded-xl text-text-subtle hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <Button variant="outline" className="h-16 px-8 bg-surface/50 border-white/5 text-text-subtle hover:text-white flex gap-3 rounded-3xl font-black uppercase tracking-widest text-xs italic transition-all hover:border-accent shadow-xl shadow-black/20 backdrop-blur-md">
                <Filter className="h-5 w-5 text-accent" />
                Parameters
             </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
          <div className="h-10 w-10 bg-accent/10 rounded-xl border border-accent/20 flex items-center justify-center shrink-0">
             <Zap className="h-5 w-5 text-accent" />
          </div>
          {['Action', 'Adventure', 'Seinen', 'Shonen', 'Sci-Fi', 'Psychological', 'Fantasy'].map((genre) => (
            <button 
              key={genre}
              className="whitespace-nowrap px-6 py-2.5 rounded-2xl bg-muted/30 border border-white/5 text-text-subtle text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent hover:bg-accent/5 transition-all shadow-lg shadow-black/10"
            >
              {genre}
            </button>
          ))}
          <div className="flex items-center gap-2 pl-4 text-accent/40 font-black text-[10px] uppercase tracking-widest italic shrink-0">
             More Vectors <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div 
        ref={searchContainerRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8"
      >
        {results.map((anime, index) => (
          <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
        ))}
      </div>

      {/* States */}
      {loading && results.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="aspect-[3/4] bg-surface/50 rounded-3xl border border-white/5 animate-pulse overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
             </div>
           ))}
        </div>
      )}

      {loading && results.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="h-1 w-24 bg-accent/20 rounded-full overflow-hidden">
             <div className="h-full bg-accent w-full origin-left animate-shimmer" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent animate-pulse">Syncing Next Batch</p>
        </div>
      )}

      {!loading && results.length === 0 && query && (
         <div className="flex flex-col items-center justify-center py-40 gap-8 animate-page-entry">
            <div className="h-24 w-24 bg-accent/5 border border-accent/10 rounded-[40px] flex items-center justify-center relative">
               <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />
               <SearchIcon className="h-10 w-10 text-accent opacity-40" />
            </div>
            <div className="space-y-1">
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Signature Not Found</h3>
               <p className="text-text-subtle font-medium">No archived records matching "{query}" were detected.</p>
            </div>
            <Button 
              onClick={() => setQuery('')}
              variant="outline" 
              className="border-white/10 text-white/40 hover:text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest italic"
            >
              Reset Query
            </Button>
         </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={ref} className="h-20" />
    </main>
  )
}
