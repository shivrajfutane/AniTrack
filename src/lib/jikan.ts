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
  title: string
  title_english: string | null
  type: string
  episodes: number | null
  status: string
  score: number | null
  scored_by: number | null
  rank: number | null
  popularity: number | null
  synopsis: string | null
  background: string | null
  season: string | null
  year: number | null
  genres: Array<{ mal_id: number; name: string }>
}

export interface JikanResponse<T> {
  data: T
  pagination?: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
  }
}

async function jikanFetch<T>(endpoint: string, params: Record<string, any> = {}): Promise<JikanResponse<T>> {
  const url = new URL(`${JIKAN_BASE_URL}${endpoint}`)
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key].toString())
    }
  })

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (response.status === 429) {
    throw new Error('Jikan API rate limit exceeded. Please try again later.')
  }

  if (!response.ok) {
    throw new Error(`Jikan API error: ${response.statusText}`)
  }

  return response.json()
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
