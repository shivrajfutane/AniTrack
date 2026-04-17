export interface TrackedAnime {
  id: string
  user_id: string
  anime_id: number
  anime_title: string
  anime_image_url: string
  genres: string[]
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch'
  episodes_watched: number
  total_episodes: number | null
  score: number | null
  updated_at: string
}

export function calculateSummaryStats(list: TrackedAnime[]) {
  const totalEpisodes = list.reduce((sum, item) => sum + item.episodes_watched, 0)
  const totalDays = (totalEpisodes * 24) / (60 * 24) // 24 mins per episode
  
  const scoredItems = list.filter(item => item.score !== null)
  const meanScore = scoredItems.length > 0 
    ? (scoredItems.reduce((sum, item) => sum + (item.score || 0), 0) / scoredItems.length).toFixed(2)
    : '0.00'

  return {
    totalEpisodes,
    totalDays: totalDays.toFixed(1),
    meanScore,
    totalCount: list.length
  }
}

export function getStatusDistribution(list: TrackedAnime[]) {
  const distribution = list.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(distribution).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  }))
}

export function getGenreDistribution(list: TrackedAnime[]) {
  const genreCounts: Record<string, number> = {}
  
  list.forEach(item => {
    item.genres?.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
  })

  // Get top 6 genres for the radar chart
  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([subject, A]) => ({
      subject,
      A,
      fullMark: Math.max(...Object.values(genreCounts))
    }))
}

export function getWatcherArchetype(list: TrackedAnime[]) {
  const { totalEpisodes, totalCount } = calculateSummaryStats(list)
  
  if (totalEpisodes > 1000) return { name: 'Titan of Time', description: 'Watched over 1,000 episodes.' }
  if (list.some(i => i.status === 'dropped')) return { name: 'Critical Eye', description: 'Willing to drop a show if it doesn\'t spark joy.' }
  if (totalCount > 50) return { name: 'Veteran Otaku', description: 'Has tracked a massive collection.' }
  
  return { name: 'New Challenger', description: 'Just started their anime journey.' }
}
