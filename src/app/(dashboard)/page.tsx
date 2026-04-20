import { jikan } from '@/lib/jikan'
import { HeroSection } from '@/components/hero-section'
import { AnimeCard } from '@/components/anime-card'
import { ChevronRight, Sparkles, TrendingUp, Zap, Radio } from 'lucide-react'
import Link from 'next/link'
import { getPersonalizedRecommendations } from '@/lib/recommendations'
import { ScrollRevealSection } from '@/components/animations/ScrollRevealSection'
import { StaggerGrid } from '@/components/animations/StaggerGrid'

export default async function DashboardPage() {
  const [seasonal, topAiring, trending, recommendations] = await Promise.all([
    jikan.getSeasonalAnime(),
    jikan.getTopAnime(), 
    jikan.searchAnime('', 1),
    getPersonalizedRecommendations()
  ])

  const featuredAnime = seasonal.data[0] 

  return (
    <div className="space-y-24 pb-24 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10">
      {/* Featured Hero */}
      {featuredAnime && (
        <section className="animate-page-entry -mx-4 sm:mx-0">
          <HeroSection anime={featuredAnime} />
        </section>
      )}

      {/* DNA Recommendations */}
      {recommendations.length > 0 && (
        <ScrollRevealSection className="bg-gradient-to-br from-accent/20 via-accent/5 to-transparent p-8 md:p-12 rounded-[40px] border border-accent/20 relative overflow-hidden group glass">
          <div className="absolute top-0 right-0 p-8 text-accent opacity-5 group-hover:opacity-20 transition-opacity duration-700">
            <Zap className="h-40 w-40 rotate-12" />
          </div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic font-syne">
                <Sparkles className="h-10 w-10 text-accent glow-violet" />
                DNA<span className="text-accent gradient-text">Picks</span>
              </h2>
              <p className="text-accent-light font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] pl-1 font-spaceGrotesk">Calculated for your sequence</p>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {recommendations.slice(0, 10).map((anime: any) => (
              <div key={anime.mal_id} className="min-w-[160px] md:min-w-[200px] snap-center">
                 <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        </ScrollRevealSection>
      )}

      {/* Seasonal Hits Row */}
      <ScrollRevealSection className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic font-syne">
              Seasonal<span className="text-sakura drop-shadow-[0_0_15px_rgba(255,107,158,0.5)]">Sequence</span>
            </h2>
            <div className="flex items-center gap-2 pl-1">
              <span className="h-2 w-2 rounded-full bg-sakura animate-ping shadow-[0_0_10px_#FF6B9E]" />
              <span className="text-sakura text-[10px] font-black uppercase tracking-[0.2em] bg-sakura/10 px-3 py-1 rounded-full border border-sakura/20 font-spaceGrotesk">
                Spring 2026 Collection
              </span>
            </div>
          </div>
          <Link href="/search?filter=seasonal" className="p-4 bg-muted/30 border border-white/5 rounded-2xl text-text-subtle hover:text-white transition-all hover:border-sakura hover:shadow-[0_0_20px_rgba(255,107,158,0.3)] glass group hidden sm:block">
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <StaggerGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {seasonal.data.slice(1, 7).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </StaggerGrid>
      </ScrollRevealSection>

      {/* Top Airing Row */}
      <ScrollRevealSection className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic font-syne">
              Peak<span className="text-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">Performance</span>
            </h2>
            <p className="text-text-subtle font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] font-spaceGrotesk pl-1">Top recorded broadcasts</p>
          </div>
          <Link href="/search?filter=top" className="p-4 bg-muted/30 border border-white/5 rounded-2xl text-text-subtle hover:text-white transition-all hover:border-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] glass group hidden sm:block">
            <TrendingUp className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
        
        <StaggerGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {topAiring.data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </StaggerGrid>
      </ScrollRevealSection>

      {/* Trending Community Row */}
      <ScrollRevealSection className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic font-syne">
              Global<span className="text-white/40">Pulse</span>
            </h2>
            <p className="text-text-subtle font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] font-spaceGrotesk pl-1">Live node activity</p>
          </div>
          <Link href="/search" className="p-4 bg-muted/30 border border-white/5 rounded-2xl text-text-subtle hover:text-white transition-all glass group hidden sm:block">
            <Radio className="h-6 w-6 group-hover:animate-pulse transition-transform text-white/40 group-hover:text-white" />
          </Link>
        </div>
        
        <StaggerGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {trending.data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </StaggerGrid>
      </ScrollRevealSection>
    </div>
  )
}
