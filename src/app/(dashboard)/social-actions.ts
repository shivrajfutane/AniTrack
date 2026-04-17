'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Activity {
  id: string
  user_id: string
  anime_id: number
  anime_title: string
  action_type: 'added' | 'updated' | 'completed'
  details?: string
  created_at: string
  profiles?: {
    username: string
    avatar_url?: string
  }
}

export async function createActivity(params: {
  anime_id: number
  anime_title: string
  action_type: 'added' | 'updated' | 'completed'
  details?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('activities')
    .insert({
      user_id: user.id,
      ...params
    })

  if (error) {
    console.error('Error creating activity:', error)
    return { error: error.message }
  }

  revalidatePath('/social')
  return { success: true }
}

export async function followUser(followingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: followingId
    })

  if (error) return { error: error.message }
  
  revalidatePath('/social')
  return { success: true }
}

export async function unfollowUser(followingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', followingId)

  if (error) return { error: error.message }
  
  revalidatePath('/social')
  return { success: true }
}

export async function getGlobalFeed(page = 0) {
  const supabase = await createClient()
  const from = page * 20
  const to = from + 19
  
  const { data, error } = await supabase
    .from('activities')
    .select('*, profiles(username, avatar_url)')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching global feed:', error)
    return []
  }

  return data as Activity[]
}

export async function getFollowingFeed(page = 0) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Get IDs of people user follows
  const { data: following } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id)

  const followingIds = following?.map(f => f.following_id) || []

  if (followingIds.length === 0) return []

  const from = page * 20
  const to = from + 19

  const { data, error } = await supabase
    .from('activities')
    .select('*, profiles(username, avatar_url)')
    .in('user_id', followingIds)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return []

  return data as Activity[]
}

