import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StatsDashboard } from '@/components/stats-dashboard'
import { TrackedAnime } from '@/lib/stats'
import { FollowButton } from '@/components/follow-button'

interface PublicStatsPageProps {
  params: {
    userId: string
  }
}

export default async function PublicStatsPage({ params }: PublicStatsPageProps) {
  const { userId } = params
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Fetch the user profile to ensure they exist and get their name
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    return notFound()
  }

  // Check if following
  let isFollowing = false
  if (currentUser && currentUser.id !== userId) {
    const { data: follow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', userId)
      .single()
    isFollowing = !!follow
  }

  // Fetch the user's anime list
  const { data: list, error: listError } = await supabase
    .from('anime_list')
    .select('*')
    .eq('user_id', userId)

  if (listError) {
    console.error('Error fetching public list:', listError)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
           {profile.avatar_url && (
             <img src={profile.avatar_url} alt={profile.username} className="h-12 w-12 rounded-full border border-slate-700" />
           )}
           <div>
            <h2 className="text-xl font-black text-white">
              {profile.username}&apos;s DNA
            </h2>
            <p className="text-slate-400 text-sm">Collective insights from their tracking journey.</p>
           </div>
        </div>

        {currentUser && currentUser.id !== userId && (
          <FollowButton followingId={userId} initialIsFollowing={isFollowing} />
        )}
      </div>

      <StatsDashboard list={list as TrackedAnime[] || []} />
    </div>
  )
}

