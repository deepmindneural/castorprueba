'use client'

import Link from 'next/link'
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaCode } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { LogoCastor } from '@/components/ui/logo-castor'

export function Footer() {
  const enlacesRapidos = [
    { nombre: 'Inicio', href: '/' },
    { nombre: 'Búsqueda', href: '/busqueda' },
    { nombre: 'Biblioteca', href: '/biblioteca' },
    { nombre: 'Playlists', href: '/playlists' },
  ]

  const enlacesLegales = [
    { nombre: 'Términos de Uso', href: '/terminos' },
    { nombre: 'Privacidad', href: '/privacidad' },
    { nombre: 'Cookies', href: '/cookies' },
    { nombre: 'Licencias', href: '/licencias' },
  ]

  const tecnologias = [
    { nombre: 'Next.js', href: 'https://nextjs.org' },
    { nombre: 'TypeScript', href: 'https://www.typescriptlang.org' },
    { nombre: 'Spotify API', href: 'https://developer.spotify.com' },
    { nombre: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  ]

  const redesSociales = [
    { icono: FaGithub, href: 'https://github.com', nombre: 'GitHub' },
    { icono: FaLinkedin, href: 'https://linkedin.com', nombre: 'LinkedIn' },
    { icono: FaTwitter, href: 'https://twitter.com', nombre: 'Twitter' },
  ]

  return (
    <footer className="bg-negro-puro border-t border-blanco-suave/10">
      <div className="container mx-auto px-4 py-12">
        {/* Sección principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <LogoCastor size={40} animate={false} />
              <h3 className="text-2xl font-bold text-blanco-puro">
                Castor <span className="text-gradient">Music</span>
              </h3>
            </div>
            <p className="text-blanco-suave mb-6 max-w-sm">
              Plataforma musical inteligente que combina el poder de Spotify con algoritmos de IA avanzados para una experiencia única.
            </p>
            <div className="flex gap-4">
              {redesSociales.map((red, index) => {
                const Icono = red.icono
                return (
                  <motion.a
                    key={index}
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 glass-effect rounded-full text-blanco-suave hover:text-verde-spotify transition-colors"
                    aria-label={red.nombre}
                  >
                    <Icono className="text-xl" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold text-blanco-puro mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {enlacesRapidos.map((enlace, index) => (
                <li key={index}>
                  <Link
                    href={enlace.href}
                    className="text-blanco-suave hover:text-verde-spotify transition-colors"
                  >
                    {enlace.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-blanco-puro mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {enlacesLegales.map((enlace, index) => (
                <li key={index}>
                  <Link
                    href={enlace.href}
                    className="text-blanco-suave hover:text-verde-spotify transition-colors"
                  >
                    {enlace.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tecnologías */}
          <div>
            <h4 className="text-lg font-semibold text-blanco-puro mb-4">
              Tecnologías
            </h4>
            <ul className="space-y-2">
              {tecnologias.map((tech, index) => (
                <li key={index}>
                  <a
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blanco-suave hover:text-verde-spotify transition-colors"
                  >
                    {tech.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-blanco-suave/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-verde-spotify">50M+</p>
            <p className="text-sm text-blanco-suave">Canciones</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-verde-spotify">10M+</p>
            <p className="text-sm text-blanco-suave">Artistas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-verde-spotify">180+</p>
            <p className="text-sm text-blanco-suave">Países</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-verde-spotify">99.9%</p>
            <p className="text-sm text-blanco-suave">Uptime</p>
          </div>
        </div>

        {/* Copyright y créditos */}
        <div className="pt-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-blanco-suave mb-2"
          >
            © {new Date().getFullYear()} Castor Spotify. Todos los derechos reservados.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm text-blanco-suave/60 flex items-center justify-center gap-2"
          >
            <FaCode className="text-verde-spotify" />
            Desarrollado con <FaHeart className="text-red-500 mx-1" /> por
            <span className="font-semibold text-verde-spotify">Jeison Leandro Zapata</span>
          </motion.p>
        </div>
      </div>

      {/* Barra de progreso decorativa */}
      <div className="h-1 bg-gradient-to-r from-verde-spotify via-verde-claro to-verde-spotify" />
    </footer>
  )
}