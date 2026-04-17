import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatsDashboard } from '@/components/stats-dashboard'
import { TrackedAnime } from '@/lib/stats'

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
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StatsDashboard list={list as TrackedAnime[] || []} />
    </div>
  )
}
