import { jikan } from '@/lib/jikan'
import { HeroSection } from '@/components/hero-section'
import { AnimeCard } from '@/components/anime-card'
import { ChevronRight, Sparkles } from 'lucide-react'
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
    <div className="space-y-12 pb-20">
      {/* Featured Hero */}
      {featuredAnime && <HeroSection anime={featuredAnime} />}

      {/* DNA Recommendations (Only if available) */}
      {recommendations.length > 0 && (
        <section className="bg-gradient-to-r from-anime-purple/5 to-transparent p-6 rounded-3xl border border-anime-purple/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-anime-purple animate-pulse" />
              DNA Picks
              <span className="text-[10px] uppercase font-black bg-anime-purple text-white px-2 py-0.5 rounded-md ml-2 tracking-widest">Personalized</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommendations.slice(0, 5).map((anime: any) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Seasonal Row */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Seasonal Hits 
            <span className="text-anime-teal text-sm font-medium bg-anime-teal/10 px-2 py-0.5 rounded-md">Spring 2026</span>
          </h2>
          <Link href="/search?filter=seasonal" className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-sm font-medium">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {seasonal.data.slice(1, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Top Airing Row */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Top Airing</h2>
          <Link href="/search?filter=top" className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-sm font-medium">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {topAiring.data.slice(0, 5).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Trending Row */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Trending Community</h2>
          <Link href="/search" className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-sm font-medium">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trending.data.slice(0, 5).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  )
}
