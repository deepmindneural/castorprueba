import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email o nombre de usuario requerido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { emailOrUsername, contrasena } = validationResult.data
    
    // Buscar usuario por email o nombre de usuario
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { nombreUsuario: emailOrUsername }
        ]
      }
    })
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }
    
    // Verificar contraseña
    const contrasenaValida = await verifyPassword(contrasena, usuario.contrasenaHash)
    
    if (!contrasenaValida) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }
    
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
    
    // Actualizar último acceso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() }
    })
    
    return NextResponse.json({
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        nombreUsuario: usuario.nombreUsuario,
        imagenPerfil: usuario.imagenPerfil
      },
      token
    })
    
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}