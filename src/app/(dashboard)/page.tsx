import { jikan } from '@/lib/jikan'
import { HeroSection } from '@/components/hero-section'
import { AnimeCard } from '@/components/anime-card'
import { ChevronRight, Sparkles, TrendingUp, Zap, Radio } from 'lucide-react'
import Link from 'next/link'
import { getPersonalizedRecommendations } from '@/lib/recommendations'

export default async function DashboardPage() {
  // Fetch initial data for the dashboard
  const [seasonal, topAiring, trending, recommendations] = await Promise.all([
    jikan.getSeasonalAnime(),
    jikan.getTopAnime(), 
    jikan.searchAnime('', 1),
    getPersonalizedRecommendations()
  ])

  const featuredAnime = seasonal.data[0] 

  return (
    <main id="page-root" className="min-h-screen space-y-20 pb-20 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10">
      {/* Featured Hero */}
      {featuredAnime && (
        <section className="animate-page-entry">
          <HeroSection anime={featuredAnime} />
        </section>
      )}

      {/* DNA Recommendations (Only if available) */}
      {recommendations.length > 0 && (
        <section className="bg-gradient-to-br from-accent/10 to-transparent p-8 md:p-12 rounded-[40px] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-accent opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="h-40 w-40 rotate-12" />
          </div>
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
                <Sparkles className="h-10 w-10 text-accent animate-pulse" />
                DNA<span className="text-accent">Picks</span>
              </h2>
              <p className="text-text-subtle font-black text-[10px] uppercase tracking-[0.3em]">Calculated for your sequence</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {recommendations.slice(0, 6).map((anime: any) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Seasonal Hits Row */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
              Seasonal<span className="text-pink">Sequence</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pink animate-ping" />
              <span className="text-pink text-[10px] font-black uppercase tracking-[0.2em] bg-pink/10 px-3 py-1 rounded-full border border-pink/10">Spring 2026 Collection</span>
            </div>
          </div>
          <Link href="/search?filter=seasonal" className="p-4 bg-muted/30 border border-white/5 rounded-2xl text-text-subtle hover:text-white transition-all hover:border-pink group">
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {seasonal.data.slice(1, 7).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Top Airing Row */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
              Peak<span className="text-accent">Performance</span>
            </h2>
            <p className="text-text-subtle font-black text-[10px] uppercase tracking-[0.3em]">Top recorded broadcasts</p>
          </div>
          <Link href="/search?filter=top" className="p-4 bg-muted/30 border border-white/5 rounded-2xl text-text-subtle hover:text-white transition-all hover:border-accent group">
            <TrendingUp className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {topAiring.data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Trending Community Row */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
              Global<span className="text-white/40">Pulse</span>
            </h2>
            <p className="text-text-subtle font-black text-[10px] uppercase tracking-[0.3em]">Live node activity</p>
          </div>
          <Link href="/search" className="p-4 bg-muted/30 border border-white/5 rounded-2xl text-text-subtle hover:text-white transition-all group">
            <Radio className="h-6 w-6 group-hover:animate-pulse transition-transform text-white/20" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {trending.data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
    </main>
  )
}
