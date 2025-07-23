'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaExternalLinkAlt } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { SpotifyService } from '@/lib/spotify/spotify-service'
import { obtenerTokenPublico } from '@/lib/spotify/spotify-public'

interface Album {
  id: string
  name: string
  artists: { name: string }[]
  images: { url: string }[]
  release_date: string
  total_tracks: number
  external_urls: { spotify: string }
  album_type: string
}

export function SeccionNuevosLanzamientos() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [cargando, setCargando] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    cargarNuevosLanzamientos()
  }, [])

  const cargarNuevosLanzamientos = async () => {
    try {
      const token = await obtenerTokenPublico()
      const spotify = new SpotifyService(token)
      const data = await spotify.obtenerNuevosLanzamientos({
        country: 'ES',
        limit: 12
      })
      
      if (data.albums?.items) {
        setAlbums(data.albums.items.filter(album => album && album.id))
      }
    } catch (error) {
      console.error('Error cargando nuevos lanzamientos:', error)
      // Datos de respaldo con artistas populares
      setAlbums([
        {
          id: '1',
          name: 'Un Verano Sin Ti',
          artists: [{ name: 'Bad Bunny' }],
          images: [{ url: 'https://picsum.photos/300/300?random=1' }],
          release_date: '2024-01-15',
          total_tracks: 23,
          external_urls: { spotify: 'https://open.spotify.com' },
          album_type: 'album'
        },
        {
          id: '2', 
          name: 'Midnights',
          artists: [{ name: 'Taylor Swift' }],
          images: [{ url: 'https://picsum.photos/300/300?random=2' }],
          release_date: '2024-01-12',
          total_tracks: 13,
          external_urls: { spotify: 'https://open.spotify.com' },
          album_type: 'album'
        },
        {
          id: '3',
          name: 'SOS',
          artists: [{ name: 'SZA' }],
          images: [{ url: 'https://picsum.photos/300/300?random=3' }],
          release_date: '2024-01-10',
          total_tracks: 23,
          external_urls: { spotify: 'https://open.spotify.com' },
          album_type: 'album'
        }
      ])
    } finally {
      setCargando(false)
    }
  }

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`
  }

  if (cargando) {
    return (
      <section className="py-20 bg-gradient-to-b from-negro-puro to-negro-medio/50">
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
    <section className="py-20 bg-gradient-to-b from-negro-puro to-negro-medio/50 relative overflow-hidden">
      {/* Efecto de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-verde-spotify/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-verde-oscuro/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blanco-puro mb-4">
            Nuevos <span className="text-gradient">Lanzamientos</span>
          </h2>
          <p className="text-lg sm:text-xl text-blanco-suave max-w-2xl mx-auto">
            Descubre los álbumes más recientes de tus artistas favoritos
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onMouseEnter={() => setHoveredId(album.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative"
            >
              <div className="glass-effect rounded-xl overflow-hidden hover:bg-blanco-suave/10 transition-all duration-300">
                <div className="relative aspect-square">
                  <Image
                    src={album.images?.[0]?.url || 'https://picsum.photos/300/300'}
                    alt={album.name || 'Album'}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Overlay con información */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === album.id ? 1 : 0 }}
                    className="absolute inset-0 bg-negro-puro/80 flex flex-col items-center justify-center p-4"
                  >
                    <FaPlay className="text-verde-spotify text-3xl mb-3" />
                    <p className="text-xs text-blanco-suave text-center">
                      {album.total_tracks} canciones
                    </p>
                    <p className="text-xs text-blanco-suave/60 mt-1">
                      {album.album_type === 'single' ? 'Single' : 'Álbum'}
                    </p>
                  </motion.div>

                  {/* Badge de nuevo */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-verde-spotify text-negro-puro text-xs font-bold px-2 py-1 rounded-full">
                      NUEVO
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-blanco-puro text-sm sm:text-base truncate mb-1">
                    {album.name || 'Album sin nombre'}
                  </h3>
                  <p className="text-xs sm:text-sm text-blanco-suave truncate">
                    {album.artists?.map(a => a.name).join(', ') || 'Artista desconocido'}
                  </p>
                  <p className="text-xs text-blanco-suave/60 mt-1">
                    {album.release_date ? formatearFecha(album.release_date) : 'Fecha desconocida'}
                  </p>

                  {/* Botón para ver detalles */}
                  <button
                    className="mt-3 flex items-center justify-center gap-2 py-2 bg-verde-spotify hover:bg-verde-claro rounded-full transition-colors text-negro-puro font-semibold text-xs w-full"
                  >
                    <FaPlay />
                    <span>Ver álbum</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ver más */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/nuevos-lanzamientos"
            className="inline-flex items-center gap-2 px-8 py-4 glass-effect rounded-full hover:bg-blanco-suave/10 transition-colors text-blanco-puro font-semibold"
          >
            <span>Ver todos los lanzamientos</span>
            <FaExternalLinkAlt className="text-sm" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}