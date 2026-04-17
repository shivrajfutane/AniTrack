'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type AnimeStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch'

interface UpsertParams {
  anime_id: number
  anime_title: string
  anime_image_url?: string
  genres?: string[]
  status: AnimeStatus
  episodes_watched: number
  total_episodes?: number | null
  score?: number | null
}

export async function upsertAnimeListItem(params: UpsertParams) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('anime_list')
    .upsert({
      user_id: user.id,
      ...params,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id, anime_id'
    })

  if (error) {
    console.error('Error upserting anime list item:', error)
    throw new Error('Failed to update anime list')
  }

  revalidatePath('/my-list')
  revalidatePath('/')
}

export async function updateEpisodeProgress(anime_id: number, currentProgress: number, totalEpisodes?: number | null) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const nextProgress = currentProgress + 1
  if (totalEpisodes && nextProgress > totalEpisodes) {
    return // Already at max
  }

  const { error } = await supabase
    .from('anime_list')
    .update({ 
      episodes_watched: nextProgress,
      status: totalEpisodes && nextProgress === totalEpisodes ? 'completed' : 'watching'
    })
    .match({ user_id: user.id, anime_id })

  if (error) {
    throw new Error('Failed to update progress')
  }

  revalidatePath('/my-list')
}

export async function deleteAnimeListItem(anime_id: number) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('anime_list')
    .delete()
    .match({ user_id: user.id, anime_id })

  if (error) {
    throw new Error('Failed to delete item')
  }

  revalidatePath('/my-list')
}
