import { NextResponse } from 'next/server'
import { obtenerTokenAnonimo } from '@/lib/spotify/spotify-auth'

// Cache del token para evitar múltiples peticiones
let tokenCache: {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
} | null = null

export async function GET() {
  try {
    // Primero verificar si hay un token en las variables de entorno
    const envToken = process.env.SPOTIFY_ACCESS_TOKEN
    if (envToken) {
      return NextResponse.json({
        access_token: envToken,
        token_type: 'Bearer',
        expires_in: 3600
      })
    }

    // Verificar si tenemos un token válido en caché
    if (tokenCache && tokenCache.expires_at > Date.now()) {
      return NextResponse.json(tokenCache)
    }

    // Si hay credenciales, intentar obtener un nuevo token
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (clientId && clientSecret) {
      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authString}`
        },
        body: 'grant_type=client_credentials'
      })

      if (response.ok) {
        const data = await response.json()
        tokenCache = {
          ...data,
          expires_at: Date.now() + (data.expires_in - 60) * 1000
        }
        return NextResponse.json(data)
      }
    }

    // Si todo falla, intentar obtener token anónimo
    const anonToken = await obtenerTokenAnonimo()
    if (anonToken) {
      return NextResponse.json(anonToken)
    }

    // Token de último recurso
    return NextResponse.json({
      access_token: 'BQBbpeXG8Li_3BaqwjlSZgfQS-o96CTBYN4KoL6TS8jMQHGRcejQVFuH9U43L3Nnt_vNnNcb3Ussby53m3RcoGbX9yhWv86S5ztvPnfvKJcOm396OsE7DcrVAMLWYGW2Hw9CI4ZYY4tc9415G3SMn7fyinhDGZ6cYMZPMzXx9YufHKyb90LJYcK-nG4UDX__oUZM9MuOBhR2gzxsJwfKw2jbugbuxS0Jj7IJhhXpppix9UYGUPZUXpx7ogqiIeYHYd4DVBPaH3uBiLesJ_hBXJ8b4eAx4Rbq1Vujkl8UlItLWNx5VKsEX8r2n6cKL5ck',
      token_type: 'Bearer',
      expires_in: 3600
    })
  } catch (error) {
    console.error('Error en route handler:', error)
    return NextResponse.json({
      access_token: process.env.SPOTIFY_ACCESS_TOKEN || 'BQBbpeXG8Li_3BaqwjlSZgfQS-o96CTBYN4KoL6TS8jMQHGRcejQVFuH9U43L3Nnt_vNnNcb3Ussby53m3RcoGbX9yhWv86S5ztvPnfvKJcOm396OsE7DcrVAMLWYGW2Hw9CI4ZYY4tc9415G3SMn7fyinhDGZ6cYMZPMzXx9YufHKyb90LJYcK-nG4UDX__oUZM9MuOBhR2gzxsJwfKw2jbugbuxS0Jj7IJhhXpppix9UYGUPZUXpx7ogqiIeYHYd4DVBPaH3uBiLesJ_hBXJ8b4eAx4Rbq1Vujkl8UlItLWNx5VKsEX8r2n6cKL5ck',
      token_type: 'Bearer',
      expires_in: 3600
    })
  }
}