import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    // Solo permitir en producción con variable especial
    const migrationKey = request.headers.get('x-migration-key')
    if (migrationKey !== 'migrate-castor-2024') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log('Iniciando migración de base de datos...')
    
    // Ejecutar migración de Prisma
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy')
    
    console.log('Migración completada:', stdout)
    
    return NextResponse.json({
      success: true,
      message: 'Migración completada exitosamente',
      output: stdout
    })
    
  } catch (error: any) {
    console.error('Error en migración:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stderr: error.stderr
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de migración. Usar POST con x-migration-key header.'
  })
}