'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaMusic, FaUser, FaSignOutAlt, FaHeart, FaHistory } from 'react-icons/fa'

export function Header() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
  }, [])

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    
    // Limpiar cookie si existe
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    
    // Redirigir a login
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-negro-puro/90 backdrop-blur-md border-b border-blanco-suave/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-verde-spotify rounded-full flex items-center justify-center">
              <FaMusic className="text-negro-puro text-lg" />
            </div>
            <span className="text-xl font-bold text-blanco-puro">
              Castor Music
            </span>
          </Link>

          {/* Navegación y usuario */}
          <div className="flex items-center gap-6">
            {usuario ? (
              <>
                <nav className="hidden md:flex items-center gap-4">
                  <Link 
                    href="/favoritos" 
                    className="flex items-center gap-2 text-blanco-suave hover:text-verde-spotify transition-colors"
                  >
                    <FaHeart className="text-sm" />
                    <span>Favoritos</span>
                  </Link>
                  <Link 
                    href="/historial" 
                    className="flex items-center gap-2 text-blanco-suave hover:text-verde-spotify transition-colors"
                  >
                    <FaHistory className="text-sm" />
                    <span>Historial</span>
                  </Link>
                </nav>

                {/* Menú de usuario */}
                <div className="relative">
                  <button
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    className="flex items-center gap-2 text-blanco-puro hover:text-verde-spotify transition-colors"
                  >
                    <div className="w-8 h-8 bg-verde-spotify rounded-full flex items-center justify-center">
                      <FaUser className="text-negro-puro text-sm" />
                    </div>
                    <span className="hidden md:inline">{usuario.nombre}</span>
                  </button>

                  {menuAbierto && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-negro-medio rounded-lg shadow-lg overflow-hidden"
                    >
                      <Link
                        href="/perfil"
                        onClick={() => setMenuAbierto(false)}
                        className="block px-4 py-3 text-blanco-puro hover:bg-blanco-suave/10 transition-colors"
                      >
                        <FaUser className="inline mr-2" />
                        Mi perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-blanco-puro hover:bg-blanco-suave/10 transition-colors border-t border-blanco-suave/10"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-blanco-suave hover:text-verde-spotify transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="px-4 py-2 bg-verde-spotify hover:bg-verde-claro text-negro-puro font-semibold rounded-full transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}