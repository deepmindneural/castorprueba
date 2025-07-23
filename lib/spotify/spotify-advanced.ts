// Funciones avanzadas de Spotify usando el token proporcionado

const SPOTIFY_API_BASE = 'https://api.spotify.com'

export async function fetchWebApi(endpoint: string, method: string, body?: any) {
  // Obtener token del servidor
  let token = 'BQBbpeXG8Li_3BaqwjlSZgfQS-o96CTBYN4KoL6TS8jMQHGRcejQVFuH9U43L3Nnt_vNnNcb3Ussby53m3RcoGbX9yhWv86S5ztvPnfvKJcOm396OsE7DcrVAMLWYGW2Hw9CI4ZYY4tc9415G3SMn7fyinhDGZ6cYMZPMzXx9YufHKyb90LJYcK-nG4UDX__oUZM9MuOBhR2gzxsJwfKw2jbugbuxS0Jj7IJhhXpppix9UYGUPZUXpx7ogqiIeYHYd4DVBPaH3uBiLesJ_hBXJ8b4eAx4Rbq1Vujkl8UlItLWNx5VKsEX8r2n6cKL5ck'
  
  // Si estamos en el cliente, obtener token del servidor
  if (typeof window !== 'undefined') {
    try {
      const tokenResponse = await fetch('/api/spotify/token')
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json()
        token = tokenData.access_token
      }
    } catch (error) {
      console.log('Usando token por defecto')
    }
  }
  
  const res = await fetch(`${SPOTIFY_API_BASE}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method,
    body: body ? JSON.stringify(body) : undefined
  })
  
  if (!res.ok) {
    console.error(`Spotify API error: ${res.status} ${res.statusText}`)
    throw new Error(`Spotify API error: ${res.status}`)
  }
  
  return await res.json()
}

// Obtener información del usuario actual
export async function obtenerPerfilUsuario() {
  try {
    return await fetchWebApi('v1/me', 'GET')
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    return null
  }
}

// Obtener top tracks del usuario
export async function obtenerTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 20) {
  try {
    const data = await fetchWebApi(
      `v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, 
      'GET'
    )
    return data.items || []
  } catch (error) {
    console.error('Error obteniendo top tracks:', error)
    return []
  }
}

// Obtener top artistas del usuario
export async function obtenerTopArtistas(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 20) {
  try {
    const data = await fetchWebApi(
      `v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, 
      'GET'
    )
    return data.items || []
  } catch (error) {
    console.error('Error obteniendo top artistas:', error)
    return []
  }
}

// Crear una playlist
export async function crearPlaylist(nombre: string, descripcion: string, publica: boolean = false, tracksUri?: string[]) {
  try {
    const { id: userId } = await obtenerPerfilUsuario()
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario')
    }

    // Crear la playlist
    const playlist = await fetchWebApi(
      `v1/users/${userId}/playlists`, 
      'POST', 
      {
        name: nombre,
        description: descripcion,
        public: publica
      }
    )

    // Si hay tracks, agregarlos
    if (tracksUri && tracksUri.length > 0 && playlist.id) {
      await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks`,
        'POST',
        {
          uris: tracksUri
        }
      )
    }

    return playlist
  } catch (error) {
    console.error('Error creando playlist:', error)
    return null
  }
}

// Buscar canciones, artistas, álbumes o playlists
export async function buscarEnSpotify(query: string, tipos: string[] = ['track'], limit = 20) {
  try {
    const tiposString = tipos.join(',')
    const data = await fetchWebApi(
      `v1/search?q=${encodeURIComponent(query)}&type=${tiposString}&limit=${limit}&market=ES`,
      'GET'
    )
    return data
  } catch (error) {
    console.error('Error buscando:', error)
    return null
  }
}

// Obtener recomendaciones basadas en tracks, artistas o géneros
export async function obtenerRecomendaciones(params: {
  seed_tracks?: string[]
  seed_artists?: string[]
  seed_genres?: string[]
  limit?: number
}) {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.seed_tracks?.length) {
      queryParams.append('seed_tracks', params.seed_tracks.join(','))
    }
    if (params.seed_artists?.length) {
      queryParams.append('seed_artists', params.seed_artists.join(','))
    }
    if (params.seed_genres?.length) {
      queryParams.append('seed_genres', params.seed_genres.join(','))
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString())
    }
    
    queryParams.append('market', 'ES')
    
    const data = await fetchWebApi(
      `v1/recommendations?${queryParams.toString()}`,
      'GET'
    )
    return data.tracks || []
  } catch (error) {
    console.error('Error obteniendo recomendaciones:', error)
    return []
  }
}

// Obtener información de una playlist
export async function obtenerPlaylist(playlistId: string) {
  try {
    return await fetchWebApi(`v1/playlists/${playlistId}`, 'GET')
  } catch (error) {
    console.error('Error obteniendo playlist:', error)
    return null
  }
}

// Obtener las playlists del usuario
export async function obtenerMisPlaylists(limit = 50) {
  try {
    const data = await fetchWebApi(`v1/me/playlists?limit=${limit}`, 'GET')
    return data.items || []
  } catch (error) {
    console.error('Error obteniendo playlists:', error)
    return []
  }
}

// Seguir/dejar de seguir una playlist
export async function seguirPlaylist(playlistId: string, seguir = true) {
  try {
    await fetchWebApi(
      `v1/playlists/${playlistId}/followers`,
      seguir ? 'PUT' : 'DELETE'
    )
    return true
  } catch (error) {
    console.error('Error siguiendo playlist:', error)
    return false
  }
}

// Reproducir una canción o lista de canciones
export async function reproducir(uris?: string[], contextUri?: string) {
  try {
    const body: any = {}
    if (uris) body.uris = uris
    if (contextUri) body.context_uri = contextUri
    
    await fetchWebApi('v1/me/player/play', 'PUT', body)
    return true
  } catch (error) {
    console.error('Error reproduciendo:', error)
    return false
  }
}

// Pausar reproducción
export async function pausar() {
  try {
    await fetchWebApi('v1/me/player/pause', 'PUT')
    return true
  } catch (error) {
    console.error('Error pausando:', error)
    return false
  }
}

// Saltar a la siguiente canción
export async function siguiente() {
  try {
    await fetchWebApi('v1/me/player/next', 'POST')
    return true
  } catch (error) {
    console.error('Error saltando:', error)
    return false
  }
}

// Volver a la canción anterior
export async function anterior() {
  try {
    await fetchWebApi('v1/me/player/previous', 'POST')
    return true
  } catch (error) {
    console.error('Error volviendo:', error)
    return false
  }
}