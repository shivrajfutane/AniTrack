import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Trash2, Library, Filter, Grid3X3, List as ListIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { AnimeStatus, updateEpisodeProgress, deleteAnimeListItem } from '@/app/(dashboard)/actions'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { ScoreRing } from '@/components/score-ring'
import { StaggerGrid } from '@/components/animations/StaggerGrid'
import { ScrollRevealSection } from '@/components/animations/ScrollRevealSection'

export default async function MyListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: currentStatus = 'all' } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: list, error } = await supabase
    .from('anime_list')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching list:', error)
  }

  const statuses: { label: string; value: AnimeStatus | 'all' }[] = [
    { label: 'Full Vault', value: 'all' },
    { label: 'Watching', value: 'watching' },
    { label: 'Planned', value: 'plan_to_watch' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Dropped', value: 'dropped' },
  ]

  const filteredList = list?.filter(item => currentStatus === 'all' || item.status === currentStatus)

  return (
    <div className="space-y-12 pb-24 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-page-entry -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="h-16 w-16 bg-accent/10 rounded-[20px] flex items-center justify-center text-accent shadow-glow border border-accent/20">
                <Library className="h-8 w-8 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic font-syne">
              User<span className="text-accent drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">Vault</span>
            </h1>
          </div>
          <p className="text-text-subtle font-medium max-w-lg leading-relaxed font-spaceGrotesk">
            A secured historical record of your journey through the broadcast stream. 
            <span className="text-accent ml-2">[{list?.length || 0} Nodes Indexed]</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative z-20">
           <div className="flex p-1 rounded-2xl glass">
              <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl bg-accent text-white shadow-glow"><Grid3X3 className="h-5 w-5" /></Button>
              <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl text-white/40 hover:text-white"><ListIcon className="h-5 w-5" /></Button>
           </div>
           <Link href="/search">
              <Button className="bg-accent text-white rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest italic flex gap-2 shadow-glow font-syne">
                <Plus className="h-5 w-5" />
                New Entry
              </Button>
           </Link>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-12">
        {/* Mobile Status Tabs (Sticky) */}
        <div className="xl:hidden sticky top-[64px] md:top-0 z-40 -mx-4 px-4 py-4 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/5 overflow-x-auto scrollbar-hide">
           <div className="flex gap-2 w-max">
              {statuses.map((s) => (
                <Link 
                  key={s.value} 
                  href={`/my-list?status=${s.value}`}
                  className={cn(
                    "px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all glass",
                    currentStatus === s.value 
                      ? "bg-accent/20 text-white border-accent shadow-glow" 
                      : "bg-surface/50 text-white/60 border-white/5 hover:text-white"
                  )}
                >
                  {s.label}
                </Link>
              ))}
           </div>
        </div>

        {/* Desktop Sidebar Filter */}
        <aside className="hidden xl:block w-[300px] shrink-0 space-y-8 animate-page-entry" style={{ animationDelay: '0.1s' }}>
           <div className="space-y-4">
              <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em] flex items-center gap-2 font-spaceGrotesk">
                <Filter className="h-4 w-4 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                Vault Status
              </h3>
              <div className="flex flex-col gap-2">
                {statuses.map((s) => (
                  <Link 
                    key={s.value} 
                    href={`/my-list?status=${s.value}`}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all relative group glass",
                      currentStatus === s.value 
                        ? "bg-accent/15 text-white border-accent/30 shadow-glow" 
                        : "text-white/40 hover:text-white hover:bg-white/5 border-transparent"
                    )}
                  >
                    <span className="text-sm font-syne">{s.label}</span>
                    <span className="text-xs font-mono opacity-40">
                      {s.value === 'all' ? list?.length : list?.filter(i => i.status === s.value).length}
                    </span>
                    {currentStatus === s.value && <div className="absolute left-0 w-1 h-8 top-1/2 -translate-y-1/2 bg-accent rounded-r-full shadow-glow" />}
                  </Link>
                ))}
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 space-y-4 shadow-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 noise-overlay mix-blend-overlay pointer-events-none" />
              <h4 className="text-xs font-black text-white uppercase tracking-widest font-syne relative z-10">Vault Security</h4>
              <p className="text-[10px] text-text-subtle leading-relaxed font-spaceGrotesk relative z-10">Your collection is encrypted and synced across all biometric nodes.</p>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-accent w-2/3 shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
              </div>
           </div>
        </aside>

        {/* Main List Grid */}
        <div className="flex-1 min-w-0">
           <StaggerGrid className="grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredList?.map((item) => (
                <div 
                  key={item.id}
                  className="anime-card group relative bg-surface border border-white/5 rounded-3xl overflow-hidden hover:border-accent/40 shadow-card transition-all duration-300"
                >
                  <div className="flex h-56">
                    {/* Poster */}
                    <div className="relative w-40 h-full flex-shrink-0 overflow-hidden rounded-l-3xl">
                      <Image 
                        src={item.anime_image_url || '/placeholder.png'} 
                        alt={item.anime_title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden relative z-10">
                       <div className="space-y-2">
                          <h3 className="font-black text-white line-clamp-2 leading-tight group-hover:text-accent transition-colors tracking-tighter text-lg uppercase italic font-syne">
                            {item.anime_title}
                          </h3>
                          <div className="flex items-center gap-3">
                             <StatusBadge status={item.status.replace(/_/g, ' ')} className="group-hover:scale-105 transition-transform" />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-black text-text-subtle uppercase tracking-widest font-spaceGrotesk">Temporal Link</span>
                             <span className="text-xs font-bold text-white font-mono bg-white/5 px-2 py-1 rounded-md border border-white/10">
                               {item.episodes_watched} <span className="text-white/20">/</span> {item.total_episodes || '??'}
                             </span>
                          </div>
                          <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden p-[1px] border border-white/5">
                             <div 
                               className="h-full bg-gradient-to-r from-accent/50 to-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(124,58,237,0.8)]" 
                               style={{ width: `${item.total_episodes ? (item.episodes_watched / item.total_episodes) * 100 : 0}%` }}
                             />
                          </div>
                       </div>
                    </div>

                    {/* Score */}
                    {item.score && (
                      <div className="absolute top-4 right-4 z-20">
                        <ScoreRing score={item.score} />
                      </div>
                    )}
                  </div>

                  {/* Actions Bar (Slide up on hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center gap-3 translate-y-[110%] group-hover:translate-y-0 transition-transform duration-300 z-30">
                     <form action={async () => {
                       'use server'
                       await updateEpisodeProgress(item.anime_id, item.episodes_watched, item.total_episodes)
                     }} className="flex-1">
                       <Button 
                         className="w-full bg-accent text-white rounded-xl font-black uppercase text-[10px] tracking-widest h-11 shadow-glow transition-all italic font-syne hover:bg-accent-light"
                       >
                         Increment Broadcast
                       </Button>
                     </form>
                     <form action={async () => {
                       'use server'
                       await deleteAnimeListItem(item.anime_id)
                     }}>
                       <Button 
                         variant="outline"
                         className="h-11 w-11 text-white/40 hover:text-red-400 border-white/10 glass hover:bg-red-400/20 hover:border-red-400/30 rounded-xl transition-all"
                       >
                         <Trash2 className="h-5 w-5" />
                       </Button>
                     </form>
                  </div>
                </div>
              ))}
           </StaggerGrid>

           {/* Empty State */}
           {(!filteredList || filteredList.length === 0) && (
              <ScrollRevealSection className="py-40 flex flex-col items-center justify-center text-center space-y-8 glass rounded-[40px] border-2 border-dashed border-white/10">
                 <div className="h-24 w-24 bg-accent/5 border border-accent/10 rounded-full flex items-center justify-center relative shadow-glow">
                    <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full mix-blend-screen" />
                    <Library className="h-10 w-10 text-accent opacity-60" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter font-syne">Null Sequence</h3>
                    <p className="text-text-subtle font-medium font-spaceGrotesk">No archived records found for this temporal status.</p>
                 </div>
                 <Link href="/search">
                  <Button className="bg-accent text-white rounded-2xl px-10 h-14 font-black uppercase text-xs tracking-widest shadow-glow italic font-syne drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                    Scan Broadcasts
                  </Button>
                 </Link>
              </ScrollRevealSection>
           )}
        </div>
      </div>
    </div>
  )
}
