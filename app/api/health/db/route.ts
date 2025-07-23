import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Intentar conectar a la base de datos
    await prisma.$connect()
    
    // Hacer una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Obtener información de la conexión
    const dbInfo = {
      connected: true,
      database_url: process.env.DATABASE_URL ? 'Configurada' : 'No configurada',
      test_query: result,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(dbInfo)
    
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message,
      database_url: process.env.DATABASE_URL ? 'Configurada pero con error' : 'No configurada',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}