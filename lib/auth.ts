import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

export interface TokenPayload {
  userId: string
  email: string
  nombreUsuario: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken({ 
    userId, 
    email: '', // Se llenará después
    nombreUsuario: '' // Se llenará después
  })
  
  await prisma.sesion.create({
    data: {
      tokenSesion: token,
      usuarioId: userId,
      expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    }
  })
  
  return token
}

export async function validateSession(token: string) {
  const session = await prisma.sesion.findUnique({
    where: { tokenSesion: token },
    include: { usuario: true }
  })
  
  if (!session || session.expiraEn < new Date()) {
    return null
  }
  
  return session.usuario
}