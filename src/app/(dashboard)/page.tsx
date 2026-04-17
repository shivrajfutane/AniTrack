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

  const featuredAnime = seasonal.data[0] // Use the first seasonal anime as featured

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 lg:px-8">
      {/* Featured Hero */}
      {featuredAnime && (
        <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
          <HeroSection anime={featuredAnime} />
        </div>
      )}

      {/* DNA Recommendations (Only if available) */}
      {recommendations.length > 0 && (
        <section className="bg-gradient-to-br from-[#14B8A6]/10 to-transparent p-8 rounded-[40px] border border-[#14B8A6]/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-anime-teal opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="h-40 w-40 rotate-12" />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
                <Sparkles className="h-8 w-8 text-anime-teal animate-pulse" />
                DNA<span className="text-anime-teal">Picks</span>
              </h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Calculated for your sequence</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 overflow-x-auto pb-2 scrollbar-hide">
            {recommendations.slice(0, 5).map((anime: any) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Seasonal Row */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
              Seasonal<span className="text-anime-sky">Sequence</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-anime-sky animate-ping" />
              <span className="text-anime-sky text-[10px] font-black uppercase tracking-[0.2em] bg-anime-sky/10 px-3 py-1 rounded-full">Spring 2026 Live</span>
            </div>
          </div>
          <Link href="/search?filter=seasonal" className="p-3 bg-[#0F172A] border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all hover:border-anime-sky group">
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {seasonal.data.slice(1, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Top Airing Row */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
              Peak<span className="text-anime-teal">Performance</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Top airing globally</p>
          </div>
          <Link href="/search?filter=top" className="p-3 bg-[#0F172A] border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all hover:border-anime-teal group">
            <TrendingUp className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {topAiring.data.slice(0, 5).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Trending Row */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
              Community<span className="text-white/60">Pulse</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Live trending nodes</p>
          </div>
          <Link href="/search" className="p-3 bg-[#0F172A] border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all group">
            <Radio className="h-6 w-6 group-hover:animate-pulse transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {trending.data.slice(0, 5).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  )
}
