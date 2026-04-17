import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Minus, Trash2, Edit2, Play, Star } from 'lucide-react'
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
    { label: 'All', value: 'all' },
    { label: 'Watching', value: 'watching' },
    { label: 'Plan to Watch', value: 'plan_to_watch' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Dropped', value: 'dropped' },
  ]

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">My Library</h1>
        <p className="text-slate-400">Manage your collection and track your progress.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex w-max min-w-full gap-1">
          {statuses.map((status) => (
            <TabsTrigger 
              key={status.value} 
              value={status.value}
              className="rounded-xl px-6 py-2.5 data-[state=active]:bg-anime-purple-dark data-[state=active]:text-white"
            >
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {statuses.map((status) => (
          <TabsContent key={status.value} value={status.value}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {list?.filter(item => status.value === 'all' || item.status === status.value).map((item) => (
                <div 
                  key={item.id}
                  className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm transition-all hover:border-slate-700"
                >
                  <div className="flex h-48">
                    {/* Poster */}
                    <div className="relative w-32 h-full flex-shrink-0">
                      <Image 
                        src={item.anime_image_url || '/placeholder.png'} 
                        alt={item.anime_title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/20" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-white line-clamp-2 leading-snug group-hover:text-anime-teal transition-colors">
                            {item.anime_title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                           <span className={cn(
                             "text-[10px] uppercase font-black px-2 py-0.5 rounded-md",
                             item.status === 'watching' && "bg-anime-teal/20 text-anime-teal",
                             item.status === 'plan_to_watch' && "bg-slate-800 text-slate-400",
                             item.status === 'completed' && "bg-anime-purple/20 text-anime-purple",
                           )}>
                             {item.status.replace(/_/g, ' ')}
                           </span>
                           {item.score && (
                             <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
                               <Star className="h-3 w-3 fill-amber-500" />
                               {item.score}
                             </span>
                           )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span>Progress</span>
                            <span>{item.episodes_watched} / {item.total_episodes || '??'}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-anime-teal transition-all duration-500" 
                              style={{ width: `${item.total_episodes ? (item.episodes_watched / item.total_episodes) * 100 : 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                          <form action={async () => {
                            'use server'
                            await updateEpisodeProgress(item.anime_id, item.episodes_watched, item.total_episodes)
                          }}>
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </form>
                          <div className="flex-1" />
                           <form action={async () => {
                            'use server'
                            await deleteAnimeListItem(item.anime_id)
                          }}>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-slate-600 hover:text-red-400 hover:bg-red-400/10"
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
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-900 rounded-3xl">
                   <Play className="h-12 w-12 mb-4 opacity-10" />
                   <p>No anime in this section yet.</p>
                   <Link href="/search">
                    <Button variant="link" className="text-anime-purple mt-2">Start finding something to watch</Button>
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


