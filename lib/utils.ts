import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatear duración de milisegundos a minutos:segundos
export function formatearDuracion(ms: number): string {
  const minutos = Math.floor(ms / 60000)
  const segundos = Math.floor((ms % 60000) / 1000)
  return `${minutos}:${segundos.toString().padStart(2, '0')}`
}

// Formatear número con separadores de miles
export function formatearNumero(num: number): string {
  return num.toLocaleString('es-ES')
}

// Formatear fecha relativa
export function formatearFechaRelativa(fecha: Date | string): string {
  const ahora = new Date()
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  const diferencia = ahora.getTime() - fechaObj.getTime()
  
  const segundos = Math.floor(diferencia / 1000)
  const minutos = Math.floor(segundos / 60)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)
  const meses = Math.floor(dias / 30)
  const años = Math.floor(dias / 365)
  
  if (años > 0) return `hace ${años} año${años > 1 ? 's' : ''}`
  if (meses > 0) return `hace ${meses} mes${meses > 1 ? 'es' : ''}`
  if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`
  if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`
  if (minutos > 0) return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`
  return 'hace un momento'
}

// Truncar texto con puntos suspensivos
export function truncarTexto(texto: string, longitud: number): string {
  if (texto.length <= longitud) return texto
  return texto.substring(0, longitud) + '...'
}

// Obtener iniciales de un nombre
export function obtenerIniciales(nombre: string): string {
  return nombre
    .split(' ')
    .map(palabra => palabra[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Validar email
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Generar color aleatorio
export function generarColorAleatorio(): string {
  const colores = [
    '#1DB954', // Verde Spotify
    '#FF6B6B', // Rojo
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul
    '#F7DC6F', // Amarillo
    '#BB8FCE', // Púrpura
    '#85C1E2', // Azul claro
    '#F8B739', // Naranja
  ]
  return colores[Math.floor(Math.random() * colores.length)]
}

// Calcular tiempo de lectura
export function calcularTiempoLectura(texto: string): number {
  const palabrasPorMinuto = 200
  const palabras = texto.trim().split(/\s+/).length
  return Math.ceil(palabras / palabrasPorMinuto)
}