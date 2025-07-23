// Cliente de Spotify para acceso público (sin autenticación de usuario)
// Usa Client Credentials Flow para obtener un token de acceso

let tokenCache: { token: string; expiry: number } | null = null

// Token hardcodeado mientras esté activo
const HARDCODED_TOKEN = 'BQBbpeXG8Li_3BaqwjlSZgfQS-o96CTBYN4KoL6TS8jMQHGRcejQVFuH9U43L3Nnt_vNnNcb3Ussby53m3RcoGbX9yhWv86S5ztvPnfvKJcOm396OsE7DcrVAMLWYGW2Hw9CI4ZYY4tc9415G3SMn7fyinhDGZ6cYMZPMzXx9YufHKyb90LJYcK-nG4UDX__oUZM9MuOBhR2gzxsJwfKw2jbugbuxS0Jj7IJhhXpppix9UYGUPZUXpx7ogqiIeYHYd4DVBPaH3uBiLesJ_hBXJ8b4eAx4Rbq1Vujkl8UlItLWNx5VKsEX8r2n6cKL5ck'

export async function obtenerTokenPublico(): Promise<string> {
  // Por ahora usar token hardcodeado
  return HARDCODED_TOKEN
  
  /* Código original para cuando tengamos autenticación configurada
  // Verificar si tenemos un token válido en caché
  if (tokenCache && tokenCache.expiry > Date.now()) {
    return tokenCache.token
  }

  try {
    // Obtener token desde nuestra API route
    const response = await fetch('/api/spotify/token', {
      method: 'GET',
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Error obteniendo token de Spotify')
    }

    const data = await response.json()
    
    // Guardar en caché (expirar 5 minutos antes para seguridad)
    tokenCache = {
      token: data.access_token,
      expiry: Date.now() + (data.expires_in - 300) * 1000
    }

    return data.access_token
  } catch (error) {
    console.error('Error obteniendo token público:', error)
    throw error
  }
  */
}

export async function buscarPublico(
  query: string,
  type: 'track' | 'artist' | 'album' | 'playlist',
  limit: number = 20
) {
  try {
    const token = await obtenerTokenPublico()
    
    const params = new URLSearchParams({
      q: query,
      type: type,
      limit: limit.toString(),
      market: 'ES'
    })

    const response = await fetch(
      `https://api.spotify.com/v1/search?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error en búsqueda de Spotify')
    }

    return await response.json()
  } catch (error) {
    console.error('Error buscando en Spotify:', error)
    throw error
  }
}

export async function obtenerCancionesPopulares(pais: string = 'ES') {
  try {
    const token = await obtenerTokenPublico()
    
    // Usar una playlist popular como Top 50
    const playlistId = '37i9dQZEVXbNFJfN1Vw8d9' // Top 50 España
    
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error obteniendo canciones populares')
    }

    return await response.json()
  } catch (error) {
    console.error('Error obteniendo canciones populares:', error)
    throw error
  }
}

export async function obtenerNuevosLanzamientos(pais: string = 'ES', limit: number = 20) {
  try {
    const token = await obtenerTokenPublico()
    
    const response = await fetch(
      `https://api.spotify.com/v1/browse/new-releases?country=${pais}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error obteniendo nuevos lanzamientos')
    }

    return await response.json()
  } catch (error) {
    console.error('Error obteniendo nuevos lanzamientos:', error)
    throw error
  }
}