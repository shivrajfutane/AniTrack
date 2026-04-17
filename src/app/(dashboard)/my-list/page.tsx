import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Trash2, Library, Filter, Search, Grid3X3, List as ListIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { AnimeStatus, updateEpisodeProgress, deleteAnimeListItem } from '@/app/(dashboard)/actions'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { ScoreRing } from '@/components/score-ring'

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
    <main id="page-root" className="min-h-screen pb-20 max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-page-entry">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="h-14 w-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-xl shadow-accent/10 border border-accent/20">
                <Library className="h-8 w-8" />
             </div>
             <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              User<span className="text-accent">Vault</span>
            </h1>
          </div>
          <p className="text-text-subtle font-medium max-w-lg leading-relaxed">
            A secured historical record of your journey through the broadcast stream. 
            <span className="text-accent ml-2">[{list?.length || 0} Nodes Indexed]</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex bg-muted/30 p-1 rounded-2xl border border-white/5">
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-accent text-white"><Grid3X3 className="h-5 w-5" /></Button>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-white/40"><ListIcon className="h-5 w-5" /></Button>
           </div>
           <Button className="bg-accent hover:bg-accent-dark text-white rounded-2xl h-12 px-6 font-black uppercase text-xs tracking-widest italic flex gap-2">
             <Plus className="h-5 w-5" />
             New Entry
           </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mobile Status Tabs (Sticky) */}
        <div className="lg:hidden sticky top-20 z-40 -mx-4 px-4 py-2 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/5 overflow-x-auto no-scrollbar">
           <div className="flex gap-2 w-max">
              {statuses.map((s) => (
                <Link 
                  key={s.value} 
                  href={`/my-list?status=${s.value}`}
                  className={cn(
                    "px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all border",
                    currentStatus === s.value 
                      ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                      : "bg-muted/40 text-text-subtle border-white/5 hover:text-white"
                  )}
                >
                  {s.label}
                </Link>
              ))}
           </div>
        </div>

        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-8">
           <div className="space-y-4">
              <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em] flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                Vault Status
              </h3>
              <div className="flex flex-col gap-1">
                {statuses.map((s) => (
                  <Link 
                    key={s.value} 
                    href={`/my-list?status=${s.value}`}
                    className={cn(
                      "flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold transition-all relative group",
                      currentStatus === s.value 
                        ? "bg-accent/10 text-accent border border-accent/20" 
                        : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <span className="text-sm">{s.label}</span>
                    <span className="text-xs font-mono opacity-40">
                      {s.value === 'all' ? list?.length : list?.filter(i => i.status === s.value).length}
                    </span>
                    {currentStatus === s.value && <div className="absolute left-0 w-1 h-1/2 bg-accent rounded-full" />}
                  </Link>
                ))}
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Vault Security</h4>
              <p className="text-[10px] text-text-subtle leading-relaxed">Your collection is encrypted and synced across all biometric nodes.</p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-2/3" />
              </div>
           </div>
        </aside>

        {/* Main List Grid */}
        <div className="flex-1 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredList?.map((item) => (
                <div 
                  key={item.id}
                  className="anime-card group relative bg-surface border border-border rounded-3xl overflow-hidden hover:border-accent/30 transition-all duration-300 animate-page-entry"
                >
                  <div className="flex h-52">
                    {/* Poster */}
                    <div className="relative w-36 h-full flex-shrink-0">
                      <Image 
                        src={item.anime_image_url || '/placeholder.png'} 
                        alt={item.anime_title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
                       <div className="space-y-2">
                          <h3 className="font-black text-white line-clamp-2 leading-tight group-hover:text-accent transition-colors tracking-tighter text-lg uppercase italic">
                            {item.anime_title}
                          </h3>
                          <div className="flex items-center gap-3">
                             <StatusBadge status={item.status.replace(/_/g, ' ')} className="group-hover:scale-105 transition-transform" />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-black text-text-subtle uppercase tracking-widest">Temporal Link</span>
                             <span className="text-xs font-bold text-white font-mono">
                               {item.episodes_watched} <span className="text-white/20">/</span> {item.total_episodes || '??'}
                             </span>
                          </div>
                          <div className="h-1 w-full bg-black rounded-full overflow-hidden p-[1px]">
                             <div 
                               className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(124,58,237,0.5)]" 
                               style={{ width: `${item.total_episodes ? (item.episodes_watched / item.total_episodes) * 100 : 0}%` }}
                             />
                          </div>
                       </div>
                    </div>

                    {/* Score (Right Absolute) */}
                    {item.score && (
                      <div className="absolute top-4 right-4">
                        <ScoreRing score={item.score} />
                      </div>
                    )}
                  </div>

                  {/* Actions Bar (Slide up on hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-black/40 backdrop-blur-md border-t border-white/5 flex items-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     <form action={async () => {
                       'use server'
                       await updateEpisodeProgress(item.anime_id, item.episodes_watched, item.total_episodes)
                     }} className="flex-1">
                       <Button 
                         className="w-full bg-accent hover:bg-accent-dark text-white rounded-xl font-black uppercase text-[10px] tracking-widest h-10 shadow-lg shadow-accent/20 active:scale-95 transition-all italic"
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
                         className="h-10 w-10 text-white/20 hover:text-red-400 border-white/5 hover:bg-red-400/10 rounded-xl transition-all"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </form>
                  </div>
                </div>
              ))}
           </div>

           {/* Empty State */}
           {(!filteredList || filteredList.length === 0) && (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-surface/40 border-2 border-dashed border-white/5 rounded-[40px] animate-page-entry">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Null Sequence</h3>
                    <p className="text-text-subtle font-medium">No archived records found for this temporal status.</p>
                 </div>
                 <Link href="/">
                  <Button className="bg-accent text-white rounded-2xl px-10 h-14 font-black uppercase text-xs tracking-widest shadow-xl shadow-accent/20 italic">
                    Scan Broadcasts
                  </Button>
                 </Link>
              </div>
           )}
        </div>
      </div>
    </main>
  )
}
