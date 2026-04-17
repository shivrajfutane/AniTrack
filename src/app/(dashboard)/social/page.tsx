import { getGlobalFeed, getFollowingFeed } from '../social-actions'
import { RealtimeFeed } from '@/components/realtime-feed'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Users, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Social Feed | Anime Tracker',
  description: 'Live updates from the community',
}

export default async function SocialPage() {
  const globalActivities = await getGlobalFeed()
  const followingActivities = await getFollowingFeed()
  
  const supabase = await createClient()
  const { data: topUsers } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .limit(5)

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
          Community
          <div className="h-2 w-2 rounded-full bg-anime-purple animate-pulse" />
        </h1>
        <p className="text-slate-400">Live transmissions from fellow watchers across the globe.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl mb-8">
              <TabsTrigger value="global" className="flex items-center gap-2 px-6">
                <Globe className="h-4 w-4" /> Global Feed
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center gap-2 px-6">
                <Users className="h-4 w-4" /> Following
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="mt-0">
              <RealtimeFeed initialActivities={globalActivities} type="global" />
            </TabsContent>
            
            <TabsContent value="following" className="mt-0">
              <RealtimeFeed initialActivities={followingActivities} type="following" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          {/* User Discovery Section */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-anime-purple" />
              Recent Otakus
            </h3>
            <div className="space-y-4">
              {topUsers?.map((user) => (
                <Link key={user.id} href={`/stats/${user.id}`}>
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors group">
                    <div className="h-10 w-10 relative">
                       <Image 
                         src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                         alt={user.username}
                         fill
                         className="rounded-full object-cover border border-slate-700"
                       />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-white group-hover:text-anime-purple transition-colors">{user.username}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">View Profile</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-anime-purple/20 to-transparent border border-anime-purple/30 p-8 rounded-3xl relative overflow-hidden group">
             <div className="relative z-10">
                <h4 className="text-xl font-black text-white mb-2">Build Your Crew</h4>
                <p className="text-sm text-slate-400 mb-6">Following others lets you compare your DNA and get shared recommendations.</p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-anime-purple uppercase tracking-widest group-hover:gap-4 transition-all">
                    Discover More <TrendingUp className="h-4 w-4" />
                </div>
             </div>
             <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-anime-purple/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
