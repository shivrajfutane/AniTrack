import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatsDashboard } from '@/components/stats-dashboard'
import { TrackedAnime } from '@/lib/stats'
import { Activity } from 'lucide-react'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: list, error } = await supabase
    .from('anime_list')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching list for stats:', error)
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center gap-6">
        <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
           <Activity className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Satellite Link Lost</h2>
          <p className="text-slate-400 max-w-md">We encountered an error while trying to synchronize your vault. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StatsDashboard list={list as TrackedAnime[] || []} />
    </div>
  )
}
