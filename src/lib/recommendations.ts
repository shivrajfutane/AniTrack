import { createClient } from '@/lib/supabase/server'
import { jikan, Anime } from '@/lib/jikan'
import { TrackedAnime } from '@/lib/stats'

export async function getPersonalizedRecommendations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // 1. Fetch user's current list
  const { data: list, error } = await supabase
    .from('anime_list')
    .select('anime_id, genres')
    .eq('user_id', user.id)

  if (error || !list || list.length === 0) {
    // Fallback to top rated if no list
    return []
  }

  // 2. Extract Top Genres
  const genreCounts: Record<string, number> = {}
  list.forEach(item => {
    item.genres?.forEach((genre: string) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
  })

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([name]) => name)

  if (topGenres.length === 0) return []

  // 3. Search Jikan for these genres
  // We'll search for the first top genre as primary
  try {
    const results = await jikan.searchAnime(topGenres[0], 1)
    
    // 4. Filter out already tracked anime
    const trackedIds = new Set(list.map(i => i.anime_id))
    const recommendations = results.data.filter(anime => !trackedIds.has(anime.mal_id))

    return recommendations.slice(0, 8) // Return top 8
  } catch (err) {
    console.error('Error fetching recommendations:', err)
    return []
  }
}
