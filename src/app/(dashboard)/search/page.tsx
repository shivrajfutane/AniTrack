'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search as SearchIcon, X, SlidersHorizontal, Loader2 } from 'lucide-react'
import { jikan, Anime } from '@/lib/jikan'
import { AnimeCard } from '@/components/anime-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Anime[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

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

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-30 pt-4 pb-8 bg-slate-950/80 backdrop-blur-md">
        <div className="flex flex-col gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-anime-purple/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 focus-within:border-anime-purple/50 focus-within:ring-1 focus-within:ring-anime-purple/30 transition-all">
              <SearchIcon className="h-5 w-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search anime, movies, anything..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 py-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-400 flex gap-2 rounded-xl">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
             </Button>
             <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar py-1">
                {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy'].map((genre) => (
                  <button 
                    key={genre}
                    className="whitespace-nowrap px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm hover:border-anime-teal hover:text-anime-teal transition-all"
                  >
                    {genre}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {results.map((anime, index) => (
            <motion.div
              key={`${anime.mal_id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 10) * 0.05 }}
            >
              <AnimeCard anime={anime} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading States */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-anime-purple animate-spin" />
        </div>
      )}

      {!loading && results.length === 0 && (
         <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <SearchIcon className="h-16 w-16 mb-4 opacity-10" />
            <p className="text-lg">No results found for "{query}"</p>
         </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={ref} className="h-10" />
    </div>
  )
}
