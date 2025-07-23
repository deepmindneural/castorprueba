'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaMusic } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { SpotifyService } from '@/lib/spotify/spotify-service'
import { obtenerTokenPublico } from '@/lib/spotify/spotify-public'

export default function PaginaCategoria() {
  const params = useParams()
  const categoriaId = params.id as string
  const [categoria, setCategoria] = useState<any>(null)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (categoriaId) {
      cargarCategoria()
    }
  }, [categoriaId])

  const cargarCategoria = async () => {
    try {
      const token = await obtenerTokenPublico()
      const spotify = new SpotifyService(token)
      
      // Usar valores por defecto para la categoría ya que el endpoint no funciona
      const nombreCategoria = obtenerNombreCategoria(categoriaId)
      setCategoria({
        id: categoriaId,
        name: nombreCategoria
      })
      
      // Buscar playlists relacionadas usando búsqueda que sí funciona
      const searchData = await spotify.buscar({
        q: `${nombreCategoria} playlist 2024`,
        type: ['playlist'],
        limit: 20,
        market: 'ES'
      })
      
      if (searchData.playlists?.items && searchData.playlists.items.length > 0) {
        setPlaylists(searchData.playlists.items)
      } else {
        // Si no hay resultados, buscar con término más general
        const generalSearch = await spotify.buscar({
          q: `${nombreCategoria} music`,
          type: ['playlist'],
          limit: 20,
          market: 'ES'
        })
        
        if (generalSearch.playlists?.items && generalSearch.playlists.items.length > 0) {
          setPlaylists(generalSearch.playlists.items)
        } else {
          // Buscar playlists populares como último recurso
          const popularSearch = await spotify.buscar({
            q: 'top 50',
            type: ['playlist'],
            limit: 20,
            market: 'ES'
          })
          
          if (popularSearch.playlists?.items) {
            setPlaylists(popularSearch.playlists.items)
          }
        }
      }
    } catch (error) {
      console.error('Error cargando categoría:', error)
      // Usar datos de respaldo
      setCategoria({
        id: categoriaId,
        name: obtenerNombreCategoria(categoriaId)
      })
      setPlaylists([])
    } finally {
      setCargando(false)
    }
  }
  
  const obtenerNombreCategoria = (id: string): string => {
    const nombres: { [key: string]: string } = {
      'pop': 'Pop',
      'rock': 'Rock',
      'latin': 'Latino',
      'latino': 'Latino',
      'hiphop': 'Hip Hop',
      'electronic': 'Electrónica',
      'electronica': 'Electrónica',
      'electrnica': 'Electrónica',
      'indie': 'Indie',
      'jazz': 'Jazz',
      'classical': 'Clásica',
      'clasica': 'Clásica',
      'clsica': 'Clásica',
      'metal': 'Metal',
      'soul': 'Soul',
      'country': 'Country',
      'dance': 'Dance',
      'alternative': 'Alternativa',
      'alternativa': 'Alternativa',
      'rnb': 'R&B',
      'rb': 'R&B',
      'folk': 'Folk',
      'romance': 'Romance',
      // IDs de Spotify comunes
      '0jq5daqbmkfxaxkp7zcdp': 'Latino',
      'toplists': 'Top Listas',
      'pop': 'Pop',
      'mood': 'Estado de ánimo',
      'decades': 'Décadas',
      'country': 'Country',
      'focus': 'Concentración',
      'chill': 'Relajación'
    }
    // Buscar coincidencia parcial
    const idLower = id.toLowerCase()
    for (const [key, value] of Object.entries(nombres)) {
      if (idLower.includes(key) || key.includes(idLower)) {
        return value
      }
    }
    return 'Música'
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-negro-suave flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-verde-spotify/20 rounded-full" />
          <div className="absolute top-0 w-16 h-16 border-4 border-verde-spotify border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-negro-suave">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-negro-puro/80 backdrop-blur-md border-b border-blanco-suave/10">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blanco-suave hover:text-verde-spotify transition-colors"
          >
            <FaArrowLeft />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>

      {/* Hero de categoría */}
      <section className="relative py-20 bg-gradient-to-b from-verde-spotify/20 to-negro-medio/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FaMusic className="text-6xl text-verde-spotify mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-blanco-puro mb-4">
              {categoria?.name || 'Categoría'}
            </h1>
            <p className="text-xl text-blanco-suave">
              Explora las mejores playlists de {categoria?.name?.toLowerCase()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Playlists */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {playlists.filter(p => p && p.id).map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-effect rounded-xl overflow-hidden hover:bg-blanco-suave/10 transition-all"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={playlist.images?.[0]?.url || 'https://picsum.photos/300/300'}
                      alt={playlist.name || 'Playlist'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-blanco-puro truncate">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-blanco-suave truncate">
                      {playlist.owner?.display_name || 'Spotify'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaMusic className="text-5xl text-blanco-suave/30 mx-auto mb-4" />
              <p className="text-xl text-blanco-suave">
                No se encontraron playlists en esta categoría
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}