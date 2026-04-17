'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, getGlobalFeed, getFollowingFeed } from '@/app/(dashboard)/social-actions'
import { MessageSquare, Clock, User, Radio, Loader2, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { gsap } from '@/lib/gsap-config'
import { cn } from '@/lib/utils'

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
  const feedRef = useRef<HTMLDivElement>(null)

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`public:activities:${type}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activities' },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.user_id)
            .single()

          const newActivity = {
            ...payload.new,
            profiles: profile
          } as Activity

          setActivities((prev) => {
            const next = [newActivity, ...prev]
            // Animate only the first item (the new one)
            setTimeout(() => {
              gsap.from('.feed-item:first-child', {
                opacity: 0,
                x: -30,
                duration: 0.6,
                ease: 'power3.out'
              })
            }, 0)
            return next
          })
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
        const existingIds = new Set(prev.map(a => a.id))
        const uniqueNext = nextActivities.filter(a => !existingIds.has(a.id))
        return [...prev, ...uniqueNext]
      })
      setPage(prev => prev + 1)
    }
    setLoadingMore(false)
  }

  return (
    <div ref={feedRef} className="space-y-6">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="feed-item group bg-surface border border-white/5 p-6 rounded-[32px] backdrop-blur-xl hover:border-accent/30 transition-all duration-500 shadow-xl"
        >
          <div className="flex gap-6">
            <div className="relative h-14 w-14 flex-shrink-0">
              <Image 
                src={activity.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.profiles?.username}`} 
                alt={activity.profiles?.username || 'User'}
                fill
                className="rounded-2xl object-cover border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-accent rounded-full border-2 border-surface flex items-center justify-center">
                 <Radio className="h-3 w-3 text-white animate-pulse" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-black text-white hover:text-accent transition-all cursor-pointer uppercase italic tracking-tighter">
                  {activity.profiles?.username || 'Node-Alpha'}
                </span>
                <span className="text-text-subtle text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
                  {activity.action_type === 'added' ? 'Archived' : 
                   activity.action_type === 'completed' ? 'Mastered' : 'Progressed'}
                </span>
              </div>
              
              <Link href={`/search?q=${activity.anime_title}`}>
                <h4 className="text-xl font-black text-white group-hover:text-accent transition-colors tracking-tighter uppercase italic leading-tight">
                  {activity.anime_title}
                </h4>
              </Link>
              
              {activity.details && (
                <div className="relative mt-3 pl-4 border-l-2 border-accent/20">
                   <p className="text-sm text-text-muted font-medium italic">"{activity.details}"</p>
                </div>
              )}

              <div className="flex items-center gap-6 mt-6 text-[10px] font-black text-text-subtle uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 group-hover:text-accent transition-colors">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </span>
                <Link href={`/stats/${activity.user_id}`} className="flex items-center gap-2 hover:text-white transition-all text-accent group-hover:translate-x-1 transition-transform">
                  <span className="h-1 w-4 bg-accent/20 rounded-full" />
                  View Sequence DNA
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div ref={loaderRef} className="py-12 flex flex-col items-center justify-center gap-4">
        {loadingMore ? (
          <div className="flex flex-col items-center gap-3">
             <div className="h-1 w-20 bg-accent/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-full origin-left animate-shimmer" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent animate-pulse">Syncing Streams</span>
          </div>
        ) : (
          !hasMore && activities.length > 0 && (
            <div className="flex items-center gap-4 text-text-subtle/20">
               <div className="h-[1px] w-12 bg-current" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">Stream Terminated</p>
               <div className="h-[1px] w-12 bg-current" />
            </div>
          )
        )}
      </div>

      {activities.length === 0 && !loadingMore && (
         <div className="py-32 flex flex-col items-center justify-center text-text-subtle gap-8 bg-surface/40 border-2 border-dashed border-white/5 rounded-[40px]">
            <div className="h-16 w-16 bg-accent/5 rounded-2xl flex items-center justify-center relative">
               <div className="absolute inset-0 bg-accent/10 blur-2xl" />
               <MessageSquare className="h-8 w-8 text-accent opacity-20" />
            </div>
            <div className="space-y-1 text-center">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Null Broadcast</h3>
               <p className="text-xs font-medium">Waiting for hive transmissions...</p>
            </div>
         </div>
      )}
    </div>
  )
}
