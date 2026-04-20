const JIKAN_BASE_URL = 'https://api.jikan.moe/v4'

export interface Anime {
  mal_id: number
  url: string
  images: {
    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  trailer?: {
    youtube_id: string | null
    url: string | null
    embed_url: string | null
    images?: {
      maximum_image_url: string | null
      large_image_url: string | null
    }
  }
  title: string
  title_english: string | null
  title_japanese?: string | null
  type: string
  episodes: number | null
  duration?: string | null
  status: string
  rating?: string | null
  score: number | null
  scored_by: number | null
  rank: number | null
  popularity: number | null
  synopsis: string | null
  background: string | null
  season: string | null
  year: number | null
  genres: Array<{ mal_id: number; name: string }>
  studios?: Array<{ mal_id: number; name: string }>
  themes?: Array<{ mal_id: number; name: string }>
}

export interface JikanResponse<T> {
  data: T
  pagination?: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function jikanFetch<T>(
  endpoint: string, 
  params: Record<string, any> = {}, 
  retries = 0
): Promise<JikanResponse<T>> {
  const MAX_RETRIES = 5
  const url = new URL(`${JIKAN_BASE_URL}${endpoint}`)
  
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key].toString())
    }
  })

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    // Handle Rate Limiting with backoff
    if ((response.status === 429 || response.status === 403) && retries < MAX_RETRIES) {
      // Jikan limit is strict (3/sec). Add 1s + exponential + random jitter.
      const jitter = Math.floor(Math.random() * 500)
      const delay = 1000 + Math.pow(2, retries) * 1000 + jitter
      console.warn(`[Jikan API] Rate limited. Retrying in ${delay}ms...`)
      await wait(delay)
      return jikanFetch(endpoint, params, retries + 1)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Jikan API error: ${response.statusText} (${response.status})`)
    }

    return response.json()
  } catch (error: any) {
    // Retry on network errors
    if (retries < MAX_RETRIES && (error instanceof TypeError || error.message?.includes('fetch'))) {
      const delay = Math.pow(2, retries) * 1000
      await wait(delay)
      return jikanFetch(endpoint, params, retries + 1)
    }
    
    // Final error after retries
    if (error.message?.includes('429')) {
      throw new Error('Jikan API rate limit exceeded. Please try again in secondary sync cycle.')
    }
    
    throw error
  }
}

export const jikan = {
  searchAnime: (q: string, page = 1, genres?: string) => 
    jikanFetch<Anime[]>('/anime', { q, page, genres, limit: 20 }),

  getTopAnime: (page = 1) => 
    jikanFetch<Anime[]>('/top/anime', { page, limit: 20 }),

  getSeasonalAnime: (year?: number, season?: string, page = 1) => {
    const endpoint = year && season ? `/seasons/${year}/${season}` : '/seasons/now'
    return jikanFetch<Anime[]>(endpoint, { page, limit: 20 })
  },

  getAnimeGenres: () => 
    jikanFetch<Array<{ mal_id: number; name: string; count: number }>>('/genres/anime'),

  getAnimeById: (id: number) => 
    jikanFetch<Anime>(`/anime/${id}`),
}
