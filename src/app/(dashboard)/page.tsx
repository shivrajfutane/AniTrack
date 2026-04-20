import { jikan } from '@/lib/jikan'
import { HeroSection } from '@/components/hero-section'
import { AnimeCard } from '@/components/anime-card'
import { ChevronRight, Sparkles, TrendingUp, Zap, Radio } from 'lucide-react'
import Link from 'next/link'
import { getPersonalizedRecommendations } from '@/lib/recommendations'
import { ScrollRevealSection } from '@/components/animations/ScrollRevealSection'
import { StaggerGrid } from '@/components/animations/StaggerGrid'

export default async function DashboardPage() {
  const [seasonal, topAiring, trending, recommendations, actionAnime, scifiAnime, fantasyAnime] = await Promise.all([
    jikan.getSeasonalAnime(),
    jikan.getTopAnime(), 
    jikan.searchAnime('', 1),
    getPersonalizedRecommendations(),
    jikan.searchAnime('', 1, '1'), // Action
    jikan.searchAnime('', 1, '24'), // Sci-Fi
    jikan.searchAnime('', 1, '10') // Fantasy
  ])

  const featuredAnimeList = trending.data.slice(0, 10) 

  return (
    <div className="space-y-24 pb-24 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10">
      {/* Featured Hero */}
      {featuredAnimeList && featuredAnimeList.length > 0 && (
        <section className="animate-page-entry -mx-4 sm:mx-0">
          <HeroSection animeList={featuredAnimeList} />
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
              <h2 className="text-3xl md:text-5xl font-black text-on-surface flex items-center gap-3 tracking-tight font-sans">
                <Sparkles className="h-10 w-10 text-primary" />
                DNA<span className="text-primary">Picks</span>
              </h2>
              <p className="text-on-surface-variant font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] pl-1 font-sans">Calculated for your sequence</p>
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
        <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-on-surface flex items-center gap-3 tracking-tight font-sans">
              Seasonal Hits
            </h2>
            <div className="flex items-center gap-2 pl-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-none" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest bg-primary-container/30 px-3 py-1 rounded-full border border-primary/20 font-sans">
                Latest Collection
              </span>
            </div>
          </div>
          <Link href="/search?filter=seasonal" className="p-4 bg-surface-container border border-outline-variant/15 rounded-[12px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all group hidden sm:block">
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
      <ScrollRevealSection className="space-y-10 mt-16">
        <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-on-surface flex items-center gap-3 tracking-tight font-sans">
              Peak Performance
            </h2>
            <p className="text-on-surface-variant font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-sans pl-1">Top recorded broadcasts</p>
          </div>
          <Link href="/search?filter=top" className="p-4 bg-surface-container border border-outline-variant/15 rounded-[12px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all group hidden sm:block">
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
      <ScrollRevealSection className="space-y-10 mt-16">
        <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-on-surface flex items-center gap-3 tracking-tight font-sans">
              Global Pulse
            </h2>
            <p className="text-on-surface-variant font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-sans pl-1">Live node activity</p>
          </div>
          <Link href="/search" className="p-4 bg-surface-container border border-outline-variant/15 rounded-[12px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all group hidden sm:block">
            <Radio className="h-6 w-6 group-hover:animate-pulse transition-transform" />
          </Link>
        </div>
        
        <StaggerGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {trending.data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </StaggerGrid>
      </ScrollRevealSection>

      {/* Action Row */}
      <ScrollRevealSection className="space-y-10 mt-16">
        <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-on-surface flex items-center gap-3 tracking-tight font-sans">
              High-Octane Action
            </h2>
            <p className="text-on-surface-variant font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-sans pl-1">Heart-pounding combat & adventure</p>
          </div>
          <Link href="/search?genres=1" className="p-4 bg-surface-container border border-outline-variant/15 rounded-[12px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all group hidden sm:block">
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <StaggerGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {actionAnime.data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </StaggerGrid>
      </ScrollRevealSection>

      {/* Sci-Fi Row */}
      <ScrollRevealSection className="space-y-10 mt-16">
        <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-on-surface flex items-center gap-3 tracking-tight font-sans">
              Sci-Fi & Cybernetics
            </h2>
            <p className="text-on-surface-variant font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-sans pl-1">Futures beyond imagination</p>
          </div>
          <Link href="/search?genres=24" className="p-4 bg-surface-container border border-outline-variant/15 rounded-[12px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all group hidden sm:block">
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <StaggerGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {scifiAnime.data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </StaggerGrid>
      </ScrollRevealSection>

      {/* Fantasy Row */}
      <ScrollRevealSection className="space-y-10 mt-16">
        <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-on-surface flex items-center gap-3 tracking-tight font-sans">
              Epic Fantasy
            </h2>
            <p className="text-on-surface-variant font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-sans pl-1">Magic, myths, & legends</p>
          </div>
          <Link href="/search?genres=10" className="p-4 bg-surface-container border border-outline-variant/15 rounded-[12px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all group hidden sm:block">
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <StaggerGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {fantasyAnime.data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </StaggerGrid>
      </ScrollRevealSection>
    </div>
  )
}
