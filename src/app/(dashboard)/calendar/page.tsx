import React from 'react'
import { CalendarView } from '@/components/calendar/CalendarView'
import { anilist } from '@/lib/anilist'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Release Calendar | AniTrack',
  description: 'Track the latest anime episode releases synchronized to your local timezone.',
}

// Ensure the page bypasses excessive static building since schedules count down
export const revalidate = 3600 // revalidate every hour

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch up to 100 schedules to ensure 'Upcoming' tab is populated
  const [schedules, userList] = await Promise.all([
    anilist.getAiringSchedules(1, 100),
    user ? supabase.from('anime_list').select('anime_id').eq('user_id', user.id).eq('status', 'watching') : Promise.resolve({ data: [] })
  ])

  const watchingIds = userList.data?.map(item => item.anime_id) || []

  return (
    <div className="flex-1 w-full relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      {/* Calendar App */}
      <CalendarView schedules={schedules} watchingIds={watchingIds} />
    </div>
  )
}
