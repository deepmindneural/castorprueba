import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    
    if (!url || !url.startsWith('https://p.scdn.co/mp3-preview/')) {
      return NextResponse.json(
        { error: 'URL de preview inválida' },
        { status: 400 }
      )
    }
    
    // Hacer la petición al servidor de Spotify
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al obtener el preview' },
        { status: response.status }
      )
    }
    
    const audioBuffer = await response.arrayBuffer()
    
    // Devolver el audio con los headers correctos
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Error en preview proxy:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}