import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Play, Star, Library } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { AnimeStatus, updateEpisodeProgress, deleteAnimeListItem } from '@/app/(dashboard)/actions'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function MyListPage() {
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
    { label: 'Collection', value: 'all' },
    { label: 'Watching', value: 'watching' },
    { label: 'Planned', value: 'plan_to_watch' },
    { label: 'Completed', value: 'completed' },
    { label: 'Hold', value: 'on_hold' },
    { label: 'Dropped', value: 'dropped' },
  ]

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-anime-teal/10 rounded-xl flex items-center justify-center text-anime-teal">
                <Library className="h-6 w-6" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              My<span className="text-anime-teal">Library</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium max-w-lg">
            A high-fidelity record of your journey through the Japanese broadcast history.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="overflow-x-auto pb-6 scrollbar-hide">
          <TabsList className="bg-[#0F172A]/50 border border-slate-800/50 p-1 rounded-[20px] flex w-max min-w-full gap-1 backdrop-blur-md">
            {statuses.map((status) => (
              <TabsTrigger 
                key={status.value} 
                value={status.value}
                className="rounded-2xl px-8 py-3 data-[state=active]:bg-anime-teal data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-anime-teal/20 transition-all font-black uppercase text-[10px] tracking-widest"
              >
                {status.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {statuses.map((status) => (
          <TabsContent key={status.value} value={status.value} className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {list?.filter(item => status.value === 'all' || item.status === status.value).map((item) => (
                <div 
                  key={item.id}
                  className="group relative bg-[#0F172A]/40 border border-slate-800/50 rounded-[32px] overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-anime-teal/30 hover:shadow-2xl hover:shadow-anime-teal/5"
                >
                  <div className="flex h-56">
                    {/* Poster */}
                    <div className="relative w-40 h-full flex-shrink-0 overflow-hidden">
                      <Image 
                        src={item.anime_image_url || '/placeholder.png'} 
                        alt={item.anime_title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020617]/40" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h3 className="font-black text-lg text-white line-clamp-2 leading-tight group-hover:text-anime-teal transition-colors tracking-tight">
                          {item.anime_title}
                        </h3>
                        
                        <div className="flex items-center gap-3">
                           <span className={cn(
                             "text-[9px] uppercase font-black px-2.5 py-1 rounded-full border tracking-widest",
                             item.status === 'watching' && "bg-anime-teal/10 text-anime-teal border-anime-teal/20",
                             item.status === 'plan_to_watch' && "bg-slate-800/50 text-slate-500 border-slate-700/50",
                             item.status === 'completed' && "bg-anime-sky/10 text-anime-sky border-anime-sky/20",
                           )}>
                             {item.status.replace(/_/g, ' ')}
                           </span>
                           {item.score && (
                             <span className="text-white text-xs font-black flex items-center gap-1">
                               <Star className="h-3 w-3 text-anime-teal fill-anime-teal" />
                               {item.score.toFixed(1)}
                             </span>
                           )}
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Temporal Progress</span>
                            <span className="text-xs font-black text-white">{item.episodes_watched} <span className="text-slate-600">/</span> {item.total_episodes || '??'}</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#020617] rounded-full overflow-hidden border border-slate-800/50">
                            <div 
                              className="h-full bg-anime-teal transition-all duration-700 ease-out shadow-lg shadow-anime-teal/40" 
                              style={{ width: `${item.total_episodes ? (item.episodes_watched / item.total_episodes) * 100 : 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <form action={async () => {
                            'use server'
                            await updateEpisodeProgress(item.anime_id, item.episodes_watched, item.total_episodes)
                          }}>
                            <Button 
                              size="sm" 
                              className="px-4 bg-anime-teal hover:bg-anime-teal-dark text-white rounded-xl font-black uppercase text-[10px] tracking-widest h-9 shadow-lg shadow-anime-teal/20 active:scale-95 transition-all"
                            >
                              <Plus className="h-3.5 w-3.5 mr-2" />
                              Update
                            </Button>
                          </form>
                          <div className="flex-1" />
                           <form action={async () => {
                            'use server'
                            await deleteAnimeListItem(item.anime_id)
                          }}>
                            <Button 
                              size="icon" 
                              className="h-9 w-9 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(!list || list.filter(item => status.value === 'all' || item.status === status.value).length === 0) && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-6 bg-[#0F172A]/20 border-2 border-dashed border-slate-800 rounded-[40px]">
                   <div className="h-16 w-16 bg-[#0F172A] border border-slate-800 rounded-2xl flex items-center justify-center text-slate-700">
                      <Play className="h-8 w-8 opacity-20" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Null Collection</h3>
                      <p className="text-sm text-slate-500 font-medium">No records found for this temporal sequence.</p>
                   </div>
                   <Link href="/search">
                    <Button variant="outline" className="border-anime-teal/20 text-anime-teal hover:bg-anime-teal hover:text-white rounded-xl px-8 h-12 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-anime-teal/5 transition-all">
                      Initialize Search
                    </Button>
                   </Link>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
