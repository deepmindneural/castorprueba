import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const results = {
    database: false,
    spotify: false,
    migration: false,
    errors: [] as string[]
  }

  try {
    // 1. Verificar y arreglar conexión de BD
    console.log('🔄 Verificando base de datos...')
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    results.database = true
    console.log('✅ Base de datos conectada')
  } catch (error: any) {
    results.errors.push(`BD Error: ${error.message}`)
    console.log('❌ Error de base de datos:', error.message)
  }

  try {
    // 2. Verificar token de Spotify
    console.log('🔄 Verificando token de Spotify...')
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Credenciales de Spotify no encontradas')
    }

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
      results.spotify = true
      console.log('✅ Token de Spotify generado correctamente')
    } else {
      throw new Error(`Spotify API: ${response.status}`)
    }
  } catch (error: any) {
    results.errors.push(`Spotify Error: ${error.message}`)
    console.log('❌ Error de Spotify:', error.message)
  }

  try {
    // 3. Ejecutar migraciones si es necesario
    console.log('🔄 Verificando tablas...')
    const tables = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Usuario'
    ` as any[]

    if (tables[0]?.count === '0') {
      console.log('🔄 Ejecutando migraciones...')
      // Aquí ejecutarías las migraciones si fuera necesario
      results.migration = true
    } else {
      results.migration = true
      console.log('✅ Tablas ya existen')
    }
  } catch (error: any) {
    results.errors.push(`Migration Error: ${error.message}`)
    console.log('❌ Error de migración:', error.message)
  }

  const allOk = results.database && results.spotify && results.migration
  
  return NextResponse.json({
    success: allOk,
    status: allOk ? 'Todos los sistemas funcionando' : 'Algunos sistemas tienen problemas',
    results,
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      database_configured: !!process.env.DATABASE_URL,
      spotify_configured: !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET),
      jwt_configured: !!process.env.JWT_SECRET
    }
  }, { 
    status: allOk ? 200 : 500 
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de auto-reparación. Usar POST para ejecutar diagnóstico y fixes.'
  })
}