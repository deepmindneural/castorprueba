'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGuitar, FaMicrophone, FaHeadphones, FaCompactDisc, FaGlobeAmericas, FaBolt, FaHeart, FaStar, FaMusic } from 'react-icons/fa'
import Link from 'next/link'
import { SpotifyService } from '@/lib/spotify/spotify-service'
import { obtenerTokenPublico } from '@/lib/spotify/spotify-public'

interface Categoria {
  id: string
  name: string
  icons?: { url: string }[]
  href: string
}

const iconosPorCategoria: { [key: string]: any } = {
  'rock': FaGuitar,
  'pop': FaMicrophone,
  'electronic': FaHeadphones,
  'dance': FaHeadphones,
  'classical': FaCompactDisc,
  'latin': FaGlobeAmericas,
  'hiphop': FaMicrophone,
  'metal': FaBolt,
  'romance': FaHeart,
  'jazz': FaStar,
  'indie': FaGuitar,
  'alternative': FaBolt,
  'soul': FaHeart,
  'rnb': FaMicrophone,
  'country': FaGuitar,
  'folk': FaGuitar
}

const coloresPorCategoria: { [key: string]: string } = {
  'rock': 'from-red-600 to-orange-600',
  'pop': 'from-pink-500 to-purple-500',
  'electronic': 'from-blue-500 to-cyan-500',
  'dance': 'from-purple-500 to-pink-500',
  'classical': 'from-amber-600 to-yellow-600',
  'latin': 'from-green-500 to-emerald-500',
  'hiphop': 'from-gray-700 to-gray-900',
  'metal': 'from-gray-800 to-black',
  'romance': 'from-pink-400 to-red-400',
  'jazz': 'from-indigo-600 to-blue-600',
  'indie': 'from-teal-500 to-green-500',
  'alternative': 'from-violet-600 to-purple-600',
  'soul': 'from-orange-500 to-red-500',
  'rnb': 'from-purple-600 to-indigo-600',
  'country': 'from-yellow-600 to-orange-600',
  'folk': 'from-green-600 to-teal-600'
}

export function SeccionCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      const token = await obtenerTokenPublico()
      const spotify = new SpotifyService(token)
      const data = await spotify.obtenerCategorias({
        country: 'ES',
        limit: 16
      })
      
      if (data.categories?.items) {
        setCategorias(data.categories.items)
      }
    } catch (error) {
      console.error('Error cargando categorías:', error)
      // Categorías de respaldo
      setCategorias([
        { id: 'pop', name: 'Pop', href: '/categoria/pop' },
        { id: 'rock', name: 'Rock', href: '/categoria/rock' },
        { id: 'latin', name: 'Latino', href: '/categoria/latin' },
        { id: 'hiphop', name: 'Hip Hop', href: '/categoria/hiphop' },
        { id: 'electronic', name: 'Electrónica', href: '/categoria/electronic' },
        { id: 'indie', name: 'Indie', href: '/categoria/indie' },
        { id: 'jazz', name: 'Jazz', href: '/categoria/jazz' },
        { id: 'classical', name: 'Clásica', href: '/categoria/classical' },
        { id: 'metal', name: 'Metal', href: '/categoria/metal' },
        { id: 'soul', name: 'Soul', href: '/categoria/soul' },
        { id: 'country', name: 'Country', href: '/categoria/country' },
        { id: 'dance', name: 'Dance', href: '/categoria/dance' },
        { id: 'alternative', name: 'Alternativa', href: '/categoria/alternative' },
        { id: 'rnb', name: 'R&B', href: '/categoria/rnb' },
        { id: 'folk', name: 'Folk', href: '/categoria/folk' },
        { id: 'romance', name: 'Romance', href: '/categoria/romance' }
      ])
    } finally {
      setCargando(false)
    }
  }

  const obtenerIcono = (nombreCategoria: string) => {
    const nombreNormalizado = nombreCategoria.toLowerCase()
    for (const [key, Icono] of Object.entries(iconosPorCategoria)) {
      if (nombreNormalizado.includes(key)) {
        return Icono
      }
    }
    return FaMusic
  }

  const obtenerColor = (nombreCategoria: string) => {
    const nombreNormalizado = nombreCategoria.toLowerCase()
    for (const [key, color] of Object.entries(coloresPorCategoria)) {
      if (nombreNormalizado.includes(key)) {
        return color
      }
    }
    return 'from-verde-spotify to-verde-claro'
  }

  if (cargando) {
    return (
      <section className="py-20 bg-gradient-to-b from-negro-medio/30 to-negro-puro">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-verde-spotify/20 rounded-full" />
              <div className="absolute top-0 w-16 h-16 border-4 border-verde-spotify border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-negro-medio/30 to-negro-puro relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-verde-spotify/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 35, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-verde-oscuro/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blanco-puro mb-4">
            Explora por <span className="text-gradient">Categorías</span>
          </h2>
          <p className="text-lg sm:text-xl text-blanco-suave max-w-2xl mx-auto">
            Encuentra tu género favorito entre nuestra amplia selección musical
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {categorias.map((categoria, index) => {
            const Icono = obtenerIcono(categoria.name)
            const gradiente = obtenerColor(categoria.name)
            
            return (
              <motion.div
                key={categoria.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onMouseEnter={() => setHoveredId(categoria.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link
                  href={`/categoria/${categoria.id.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                  className="block relative h-32 sm:h-40 rounded-2xl overflow-hidden group"
                >
                  {/* Fondo con gradiente */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradiente} opacity-90`} />
                  
                  {/* Patrón decorativo */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12" />
                  </div>

                  {/* Contenido */}
                  <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                    <motion.div
                      animate={{ 
                        rotate: hoveredId === categoria.id ? [0, -10, 10, -10, 0] : 0,
                        scale: hoveredId === categoria.id ? 1.2 : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icono className="text-3xl sm:text-4xl text-blanco-puro mb-2" />
                    </motion.div>
                    <h3 className="font-bold text-blanco-puro text-base sm:text-lg">
                      {categoria.name}
                    </h3>
                  </div>

                  {/* Efecto hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === categoria.id ? 1 : 0 }}
                    className="absolute inset-0 bg-negro-puro/20 flex items-center justify-center"
                  >
                    <span className="text-blanco-puro font-semibold text-sm">
                      Explorar →
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { numero: '100+', texto: 'Géneros musicales' },
            { numero: '50M+', texto: 'Canciones disponibles' },
            { numero: '10M+', texto: 'Artistas activos' },
            { numero: '180+', texto: 'Países alcanzados' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-verde-spotify mb-1">
                {stat.numero}
              </p>
              <p className="text-sm text-blanco-suave">{stat.texto}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}