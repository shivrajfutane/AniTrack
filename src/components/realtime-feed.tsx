'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, getGlobalFeed, getFollowingFeed } from '@/app/(dashboard)/social-actions'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Clock, User, ExternalLink, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export function RealtimeFeed({ 
  initialActivities, 
  type = 'global' 
}: { 
  initialActivities: Activity[],
  type?: 'global' | 'following'
}) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const supabase = createClient()
  const loaderRef = useRef<HTMLDivElement>(null)

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`public:activities:${type}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activities' },
        async (payload) => {
          // If following, only add if the user matches our following list
          // For simplicity, we'll re-fetch or let it be global for now
          // Realtime payload doesn't include joins
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.user_id)
            .single()

          const newActivity = {
            ...payload.new,
            profiles: profile
          } as Activity

          setActivities((prev) => [newActivity, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, type])

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, page])

  async function loadMore() {
    setLoadingMore(true)
    const nextActivities = type === 'global' 
      ? await getGlobalFeed(page)
      : await getFollowingFeed(page)

    if (nextActivities.length < 20) {
      setHasMore(false)
    }

    if (nextActivities.length > 0) {
      setActivities(prev => {
        // Filter out duplicates that might have been added via realtime
        const existingIds = new Set(prev.map(a => a.id))
        const uniqueNext = nextActivities.filter(a => !existingIds.has(a.id))
        return [...prev, ...uniqueNext]
      })
      setPage(prev => prev + 1)
    }
    setLoadingMore(false)
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-slate-900/40 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm hover:border-anime-purple/30 transition-colors"
          >
            <div className="flex gap-4">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image 
                  src={activity.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.profiles?.username}`} 
                  alt={activity.profiles?.username || 'User'}
                  fill
                  className="rounded-full object-cover border border-slate-700"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white hover:text-anime-teal transition-colors cursor-pointer">
                    {activity.profiles?.username || 'User'}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {activity.action_type === 'added' ? 'added' : 
                     activity.action_type === 'completed' ? 'completed' : 'updated'}
                  </span>
                  <Link href={`/search?q=${activity.anime_title}`}>
                    <span className="font-bold text-anime-purple hover:underline underline-offset-4 cursor-pointer">
                      {activity.anime_title}
                    </span>
                  </Link>
                </div>
                
                {activity.details && (
                  <p className="text-sm text-slate-300 mt-1 italic">"{activity.details}"</p>
                )}

                <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                  <Link href={`/stats/${activity.user_id}`} className="flex items-center gap-1 hover:text-anime-teal transition-colors">
                    <User className="h-3 w-3" />
                    View DNA
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div ref={loaderRef} className="py-8 flex justify-center">
        {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-anime-purple" />}
        {!hasMore && activities.length > 0 && <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">End of the line</p>}
      </div>

      {activities.length === 0 && !loadingMore && (
         <div className="py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-900 rounded-3xl">
            <MessageSquare className="h-12 w-12 mb-4 opacity-10" />
            <p>Waiting for transmissions...</p>
         </div>
      )}
    </div>
  )
}

