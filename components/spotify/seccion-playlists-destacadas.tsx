'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSpotify, FaHeart, FaUsers, FaMusic } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { SpotifyService } from '@/lib/spotify/spotify-service'
import { obtenerTokenPublico } from '@/lib/spotify/spotify-public'

interface Playlist {
  id: string
  name: string
  description: string
  images: { url: string }[]
  owner: { display_name: string }
  tracks: { total: number }
  external_urls: { spotify: string }
  public: boolean
  followers?: { total: number }
}

export function SeccionPlaylistsDestacadas() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [cargando, setCargando] = useState(true)
  const [categoria, setCategoria] = useState('destacadas')

  useEffect(() => {
    cargarPlaylistsDestacadas()
  }, [categoria])

  const cargarPlaylistsDestacadas = async () => {
    setCargando(true)
    try {
      const token = await obtenerTokenPublico()
      const spotify = new SpotifyService(token)
      
      let data
      switch(categoria) {
        case 'viral':
          data = await spotify.buscar({
            q: 'viral hits 2024',
            type: ['playlist'],
            limit: 8
          })
          if (data.playlists?.items) {
            setPlaylists(data.playlists.items)
          }
          break
        case 'top':
          data = await spotify.buscar({
            q: 'top 50',
            type: ['playlist'],
            limit: 8
          })
          if (data.playlists?.items) {
            setPlaylists(data.playlists.items)
          }
          break
        default:
          data = await spotify.obtenerPlaylistsDestacadas({
            country: 'ES',
            limit: 8
          })
          if (data.playlists?.items) {
            setPlaylists(data.playlists.items)
          }
      }
    } catch (error) {
      console.error('Error cargando playlists:', error)
      // Datos de respaldo
      setPlaylists([
        {
          id: '1',
          name: 'Top 50 - España',
          description: 'Las canciones más escuchadas en España ahora mismo',
          images: [{ url: 'https://picsum.photos/300/300?random=10' }],
          owner: { display_name: 'Spotify' },
          tracks: { total: 50 },
          external_urls: { spotify: 'https://open.spotify.com' },
          public: true,
          followers: { total: 2500000 }
        },
        {
          id: '2',
          name: 'Éxitos España',
          description: 'Los grandes éxitos del momento en España',
          images: [{ url: 'https://picsum.photos/300/300?random=11' }],
          owner: { display_name: 'Spotify' },
          tracks: { total: 75 },
          external_urls: { spotify: 'https://open.spotify.com' },
          public: true,
          followers: { total: 1800000 }
        },
        {
          id: '3',
          name: 'Viral Hits',
          description: 'Las canciones más virales del momento',
          images: [{ url: 'https://picsum.photos/300/300?random=12' }],
          owner: { display_name: 'Spotify' },
          tracks: { total: 100 },
          external_urls: { spotify: 'https://open.spotify.com' },
          public: true,
          followers: { total: 3200000 }
        },
        {
          id: '4',
          name: 'Latin Hits',
          description: 'Lo mejor de la música latina',
          images: [{ url: 'https://picsum.photos/300/300?random=13' }],
          owner: { display_name: 'Spotify' },
          tracks: { total: 60 },
          external_urls: { spotify: 'https://open.spotify.com' },
          public: true,
          followers: { total: 1500000 }
        }
      ])
    } finally {
      setCargando(false)
    }
  }

  const formatearSeguidores = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  const categorias = [
    { id: 'destacadas', nombre: 'Destacadas', icono: FaMusic },
    { id: 'viral', nombre: 'Virales', icono: FaHeart },
    { id: 'top', nombre: 'Top Charts', icono: FaUsers }
  ]

  if (cargando) {
    return (
      <section className="py-20 bg-negro-medio/30">
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
    <section className="py-20 bg-negro-medio/30 relative">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #1DB954 0, #1DB954 1px, transparent 1px, transparent 15px)`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blanco-puro mb-4">
            Playlists <span className="text-gradient">Destacadas</span>
          </h2>
          <p className="text-lg sm:text-xl text-blanco-suave max-w-2xl mx-auto">
            Las mejores listas de reproducción seleccionadas para ti
          </p>
        </motion.div>

        {/* Selector de categorías */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categorias.map((cat) => {
            const Icono = cat.icono
            return (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  categoria === cat.id
                    ? 'gradient-spotify text-blanco-puro shadow-lg'
                    : 'glass-effect text-blanco-suave hover:text-blanco-puro'
                }`}
              >
                <Icono className="text-lg" />
                <span>{cat.nombre}</span>
              </button>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {playlists.filter(playlist => playlist && playlist.id).map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-effect rounded-2xl overflow-hidden hover:bg-blanco-suave/10 transition-all duration-300 h-full">
                <div className="relative aspect-square">
                  <Image
                    src={playlist.images?.[0]?.url || 'https://picsum.photos/400/400'}
                    alt={playlist.name || 'Playlist'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-negro-puro via-transparent to-transparent opacity-60" />
                  
                  {/* Info superpuesta */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-blanco-puro text-lg mb-1 line-clamp-1">
                      {playlist.name || 'Playlist sin nombre'}
                    </h3>
                    <p className="text-sm text-blanco-suave/80">
                      {playlist.tracks?.total || 0} canciones
                    </p>
                  </div>

                  {/* Botón de play */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-12 h-12 bg-verde-spotify rounded-full flex items-center justify-center shadow-xl">
                      <FaSpotify className="text-negro-puro text-xl" />
                    </div>
                  </motion.div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-blanco-suave line-clamp-2 mb-3">
                    {playlist.description || 'Las mejores canciones seleccionadas para ti'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-blanco-suave/60 mb-4">
                    <span>Por {playlist.owner?.display_name || 'Spotify'}</span>
                    {playlist.followers && (
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-verde-spotify" />
                        {formatearSeguidores(playlist.followers.total)}
                      </span>
                    )}
                  </div>

                  <button
                    className="block w-full py-3 bg-verde-spotify hover:bg-verde-claro rounded-xl transition-colors text-center text-negro-puro font-bold"
                  >
                    Ver Playlist
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA para explorar más */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-blanco-suave mb-4">
            Descubre miles de playlists más creadas por la comunidad
          </p>
          <Link
            href="/playlists"
            className="inline-flex items-center gap-2 px-8 py-4 gradient-spotify rounded-full hover-scale text-blanco-puro font-semibold shadow-xl"
          >
            <FaMusic />
            <span>Explorar todas las playlists</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}