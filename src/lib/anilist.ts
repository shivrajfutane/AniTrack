export interface AniListAiringSchedule {
  airingAt: number
  episode: number
  media: {
    id: number
    title: {
      romaji: string
      english: string | null
    }
    coverImage: {
      large: string
    }
    popularity: number
    averageScore: number
    genres: string[]
    status: string
  }
}

export interface AniListResponse {
  data: {
    Page: {
      airingSchedules: AniListAiringSchedule[]
    }
  }
}

const ANILIST_API_URL = 'https://graphql.anilist.co'

export const anilist = {
  async getAiringSchedules(page = 1, perPage = 100): Promise<AniListAiringSchedule[]> {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          airingSchedules(notYetAired: true, sort: TIME) {
            airingAt
            episode
            media {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              popularity
              averageScore
              genres
              status
            }
          }
        }
      }
    `

    const variables = { page, perPage }

    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
      // We can use next caching if we want, but since schedules 
      // change and we need correct countdowns, revalidate every hour
      next: { revalidate: 3600 } 
    })

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.statusText}`)
    }

    const json: AniListResponse = await response.json()
    return json.data.Page.airingSchedules
  }
}
