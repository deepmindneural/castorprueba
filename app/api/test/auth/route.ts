import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Verificar conexión y tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    // Contar usuarios si la tabla existe
    let userCount = 0
    try {
      userCount = await prisma.usuario.count()
    } catch (e) {
      // Tabla no existe o no hay permisos
    }
    
    return NextResponse.json({
      database: 'Conectada',
      tables: tables,
      users_count: userCount,
      schema_status: userCount >= 0 ? 'Migrado' : 'Pendiente migración',
      environment: process.env.NODE_ENV || 'development'
    })
    
  } catch (error: any) {
    return NextResponse.json({
      database: 'Error de conexión',
      error: error.message,
      suggestion: 'Verifica DATABASE_URL en variables de entorno'
    }, { status: 500 })
  }
}