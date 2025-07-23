'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaMusic } from 'react-icons/fa'
import Link from 'next/link'

export default function PaginaRegistro() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    nombreUsuario: '',
    contrasena: '',
    confirmarContrasena: ''
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)

    try {
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          nombreUsuario: formData.nombreUsuario,
          contrasena: formData.contrasena
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar usuario')
        return
      }

      // Guardar token en localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))

      // Redirigir al dashboard
      router.push('/')
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-negro-suave flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-effect rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-verde-spotify rounded-full mb-4">
              <FaMusic className="text-2xl text-negro-puro" />
            </div>
            <h1 className="text-2xl font-bold text-blanco-puro mb-2">
              Crear cuenta
            </h1>
            <p className="text-blanco-suave">
              Únete a la mejor experiencia musical
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blanco-suave mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full bg-negro-claro border border-blanco-suave/20 rounded-lg px-4 py-3 text-blanco-puro focus:border-verde-spotify focus:outline-none"
                    placeholder="Juan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blanco-suave mb-2">
                  Apellido
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full bg-negro-claro border border-blanco-suave/20 rounded-lg px-4 py-3 text-blanco-puro focus:border-verde-spotify focus:outline-none"
                    placeholder="Pérez"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blanco-suave mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blanco-suave/60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-negro-claro border border-blanco-suave/20 rounded-lg pl-10 pr-4 py-3 text-blanco-puro focus:border-verde-spotify focus:outline-none"
                  placeholder="juan@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blanco-suave mb-2">
                Nombre de usuario
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blanco-suave/60" />
                <input
                  type="text"
                  name="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={handleChange}
                  required
                  className="w-full bg-negro-claro border border-blanco-suave/20 rounded-lg pl-10 pr-4 py-3 text-blanco-puro focus:border-verde-spotify focus:outline-none"
                  placeholder="juanperez"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blanco-suave mb-2">
                Contraseña
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blanco-suave/60" />
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                  className="w-full bg-negro-claro border border-blanco-suave/20 rounded-lg pl-10 pr-4 py-3 text-blanco-puro focus:border-verde-spotify focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blanco-suave mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blanco-suave/60" />
                <input
                  type="password"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  required
                  className="w-full bg-negro-claro border border-blanco-suave/20 rounded-lg pl-10 pr-4 py-3 text-blanco-puro focus:border-verde-spotify focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-verde-spotify hover:bg-verde-claro text-negro-puro font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-blanco-suave">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-verde-spotify hover:text-verde-claro transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}