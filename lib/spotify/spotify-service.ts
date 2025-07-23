// Servicio completo de Spotify API
// Implementa todos los endpoints según la documentación oficial

export class SpotifyService {
  private baseUrl = 'https://api.spotify.com/v1'
  private token: string

  constructor(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Búsqueda
  async buscar(params: {
    q: string
    type: Array<'album' | 'artist' | 'playlist' | 'track' | 'show' | 'episode'>
    market?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams({
      q: params.q,
      type: params.type.join(','),
      ...(params.market && { market: params.market }),
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() })
    })

    return this.request(`/search?${searchParams}`)
  }

  // Albums
  async obtenerAlbum(id: string, market?: string) {
    const params = market ? `?market=${market}` : ''
    return this.request(`/albums/${id}${params}`)
  }

  async obtenerAlbums(ids: string[], market?: string) {
    const params = new URLSearchParams({
      ids: ids.join(','),
      ...(market && { market })
    })
    return this.request(`/albums?${params}`)
  }

  async obtenerCancionesAlbum(id: string, params?: {
    market?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams({
      ...(params?.market && { market: params.market }),
      ...(params?.limit && { limit: params.limit.toString() }),
      ...(params?.offset && { offset: params.offset.toString() })
    })
    return this.request(`/albums/${id}/tracks?${searchParams}`)
  }

  // Artistas
  async obtenerArtista(id: string) {
    return this.request(`/artists/${id}`)
  }

  async obtenerArtistas(ids: string[]) {
    const params = new URLSearchParams({ ids: ids.join(',') })
    return this.request(`/artists?${params}`)
  }

  async obtenerTopCancionesArtista(id: string, market: string = 'ES') {
    return this.request(`/artists/${id}/top-tracks?market=${market}`)
  }

  async obtenerAlbumesArtista(id: string, params?: {
    include_groups?: string
    market?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams({
      ...(params?.include_groups && { include_groups: params.include_groups }),
      ...(params?.market && { market: params.market }),
      ...(params?.limit && { limit: params.limit.toString() }),
      ...(params?.offset && { offset: params.offset.toString() })
    })
    return this.request(`/artists/${id}/albums?${searchParams}`)
  }

  async obtenerArtistasRelacionados(id: string) {
    return this.request(`/artists/${id}/related-artists`)
  }

  // Browse
  async obtenerNuevosLanzamientos(params?: {
    country?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams({
      ...(params?.country && { country: params.country }),
      ...(params?.limit && { limit: params.limit.toString() }),
      ...(params?.offset && { offset: params.offset.toString() })
    })
    return this.request(`/browse/new-releases?${searchParams}`)
  }

  async obtenerPlaylistsDestacadas(params?: {
    country?: string
    locale?: string
    timestamp?: string
    limit?: number
    offset?: number
  }) {
    try {
      // El endpoint featured-playlists ya no está disponible
      // Usar playlists de categorías populares como alternativa
      const categoriasPopulares = ['0JQ5DAqbMKFQ00XGBls6ym', '0JQ5DAqbMKFDXXwE9BDJAr', '0JQ5DAqbMKFEC4WFtoNRpw', '0JQ5DAqbMKFHOzuVTgTizF']
      const categoriaAleatoria = categoriasPopulares[Math.floor(Math.random() * categoriasPopulares.length)]
      
      const searchParams = new URLSearchParams({
        ...(params?.country && { country: params.country }),
        ...(params?.limit && { limit: params.limit.toString() })
      })
      
      const result = await this.request(`/browse/categories/${categoriaAleatoria}/playlists?${searchParams}`)
      return { 
        message: 'Playlists destacadas',
        playlists: result.playlists || result 
      }
    } catch (error) {
      // Si falla, buscar playlists populares
      console.log('Usando búsqueda alternativa para playlists destacadas')
      const searchResult = await this.buscar({
        q: 'top 50 viral hits',
        type: ['playlist'],
        limit: params?.limit || 20,
        market: params?.country || 'ES'
      })
      return { 
        message: 'Playlists destacadas',
        playlists: searchResult.playlists 
      }
    }
  }

  async obtenerCategorias(params?: {
    country?: string
    locale?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams({
      ...(params?.country && { country: params.country }),
      ...(params?.locale && { locale: params.locale }),
      ...(params?.limit && { limit: params.limit.toString() }),
      ...(params?.offset && { offset: params.offset.toString() })
    })
    return this.request(`/browse/categories?${searchParams}`)
  }

  async obtenerCategoria(id: string, params?: {
    country?: string
    locale?: string
  }) {
    const searchParams = new URLSearchParams({
      ...(params?.country && { country: params.country }),
      ...(params?.locale && { locale: params.locale })
    })
    return this.request(`/browse/categories/${id}?${searchParams}`)
  }

  async obtenerPlaylistsCategoria(id: string, params?: {
    country?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams({
      ...(params?.country && { country: params.country }),
      ...(params?.limit && { limit: params.limit.toString() }),
      ...(params?.offset && { offset: params.offset.toString() })
    })
    return this.request(`/browse/categories/${id}/playlists?${searchParams}`)
  }

  async obtenerRecomendaciones(params: {
    seed_artists?: string[]
    seed_genres?: string[]
    seed_tracks?: string[]
    market?: string
    limit?: number
    // Atributos musicales
    min_acousticness?: number
    max_acousticness?: number
    target_acousticness?: number
    min_danceability?: number
    max_danceability?: number
    target_danceability?: number
    min_energy?: number
    max_energy?: number
    target_energy?: number
    min_valence?: number
    max_valence?: number
    target_valence?: number
    min_tempo?: number
    max_tempo?: number
    target_tempo?: number
  }) {
    const searchParams = new URLSearchParams()
    
    if (params.seed_artists) searchParams.append('seed_artists', params.seed_artists.join(','))
    if (params.seed_genres) searchParams.append('seed_genres', params.seed_genres.join(','))
    if (params.seed_tracks) searchParams.append('seed_tracks', params.seed_tracks.join(','))
    
    // Agregar el resto de parámetros opcionales
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && !key.startsWith('seed_')) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request(`/recommendations?${searchParams}`)
  }

  // Playlists
  async obtenerPlaylist(id: string, params?: {
    market?: string
    fields?: string
  }) {
    const searchParams = new URLSearchParams({
      ...(params?.market && { market: params.market }),
      ...(params?.fields && { fields: params.fields })
    })
    return this.request(`/playlists/${id}?${searchParams}`)
  }

  async obtenerCancionesPlaylist(id: string, params?: {
    market?: string
    fields?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams({
      ...(params?.market && { market: params.market }),
      ...(params?.fields && { fields: params.fields }),
      ...(params?.limit && { limit: params.limit.toString() }),
      ...(params?.offset && { offset: params.offset.toString() })
    })
    return this.request(`/playlists/${id}/tracks?${searchParams}`)
  }

  // Tracks
  async obtenerCancion(id: string, market?: string) {
    const params = market ? `?market=${market}` : ''
    return this.request(`/tracks/${id}${params}`)
  }

  async obtenerCanciones(ids: string[], market?: string) {
    const params = new URLSearchParams({
      ids: ids.join(','),
      ...(market && { market })
    })
    return this.request(`/tracks?${params}`)
  }

  async obtenerCaracteristicasAudio(id: string) {
    return this.request(`/audio-features/${id}`)
  }

  async obtenerCaracteristicasAudioMultiples(ids: string[]) {
    const params = new URLSearchParams({ ids: ids.join(',') })
    return this.request(`/audio-features?${params}`)
  }

  async obtenerAnalisisAudio(id: string) {
    return this.request(`/audio-analysis/${id}`)
  }

  // Mercados disponibles
  async obtenerMercadosDisponibles() {
    return this.request('/markets')
  }

  // Géneros disponibles
  async obtenerGenerosDisponibles() {
    return this.request('/recommendations/available-genre-seeds')
  }
}