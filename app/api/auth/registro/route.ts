import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

const registroSchema = z.object({
  email: z.string().email('Email inválido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  apellido: z.string().optional(),
  nombreUsuario: z.string().min(3, 'Nombre de usuario debe tener al menos 3 caracteres'),
  contrasena: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validationResult = registroSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { email, nombre, apellido, nombreUsuario, contrasena } = validationResult.data
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
          { nombreUsuario }
        ]
      }
    })
    
    if (usuarioExistente) {
      const campo = usuarioExistente.email === email ? 'email' : 'nombre de usuario'
      return NextResponse.json(
        { error: `Este ${campo} ya está registrado` },
        { status: 400 }
      )
    }
    
    // Hash de la contraseña
    const contrasenaHash = await hashPassword(contrasena)
    
    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        email,
        nombre,
        apellido,
        nombreUsuario,
        contrasenaHash,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        nombreUsuario: true,
      }
    })
    
    // Generar token
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      nombreUsuario: usuario.nombreUsuario
    })
    
    // Crear sesión
    await prisma.sesion.create({
      data: {
        tokenSesion: token,
        usuarioId: usuario.id,
        expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    })
    
    return NextResponse.json({
      usuario,
      token
    })
    
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    )
  }
}