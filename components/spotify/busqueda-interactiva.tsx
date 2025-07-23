'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaPlay, FaPause } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { TarjetaMusical } from '@/components/ui/tarjeta-musical'
import { buscarPublico } from '@/lib/spotify/spotify-public'
import { buscarEnSpotify } from '@/lib/spotify/spotify-advanced'
import { formatearDuracion } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

export function BusquedaInteractiva() {
  const [busqueda, setBusqueda] = useState('')
  const [reproduciendo, setReproduciendo] = useState<string | null>(null)
  const [resultados, setResultados] = useState<any[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [cargando, setCargando] = useState(false)
  
  const busquedaDebounced = useDebounce(busqueda, 500)

  useEffect(() => {
    obtenerCancionesPopulares()
  }, [])

  const obtenerCancionesPopulares = async () => {
    setCargando(true)
    try {
      const data = await buscarPublico('top 50 españa', 'track', 6)
      if (data.tracks?.items.length > 0) {
        const formateadas = data.tracks.items.map((track: any) => ({
          id: track.id,
          titulo: track.name,
          artista: track.artists.map((a: any) => a.name).join(', '),
          album: track.album.name,
          duracion: formatearDuracion(track.duration_ms),
          imagen: track.album.images[0]?.url || 'https://picsum.photos/300/300',
          preview_url: track.preview_url,
          popularity: track.popularity
        }))
        setResultados(formateadas)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCargando(false)
    }
  }

  const buscarCanciones = useCallback(async (query: string) => {
    if (!query.trim()) {
      obtenerCancionesPopulares()
      return
    }

    setCargando(true)
    try {
      // Primero intentar con la función avanzada
      const data = await buscarEnSpotify(query, ['track'], 6)
      
      if (data && data.tracks?.items.length > 0) {
        const formateadas = data.tracks.items.map((track: any) => ({
          id: track.id,
          titulo: track.name,
          artista: track.artists.map((a: any) => a.name).join(', '),
          album: track.album.name,
          duracion: formatearDuracion(track.duration_ms),
          imagen: track.album.images[0]?.url || 'https://picsum.photos/300/300',
          preview_url: track.preview_url,
          popularity: track.popularity,
          uri: track.uri
        }))
        setResultados(formateadas)
      } else {
        // Si falla, intentar con el método público
        const publicData = await buscarPublico(query, 'track', 6)
        if (publicData.tracks?.items.length > 0) {
          const formateadas = publicData.tracks.items.map((track: any) => ({
            id: track.id,
            titulo: track.name,
            artista: track.artists.map((a: any) => a.name).join(', '),
            album: track.album.name,
            duracion: formatearDuracion(track.duration_ms),
            imagen: track.album.images[0]?.url || 'https://picsum.photos/300/300',
            preview_url: track.preview_url,
            popularity: track.popularity,
            uri: track.uri
          }))
          setResultados(formateadas)
        } else {
          setResultados([])
        }
      }
    } catch (error) {
      console.error('Error buscando:', error)
      setResultados([])
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    buscarCanciones(busquedaDebounced)
  }, [busquedaDebounced, buscarCanciones])

  const alternarReproduccion = async (cancion: any) => {
    if (!cancion.preview_url) {
      console.log('Esta canción no tiene preview disponible')
      return
    }
    
    // Si ya está reproduciendo esta canción, pausarla
    if (reproduciendo === cancion.id && audioRef.current) {
      audioRef.current.pause()
      setReproduciendo(null)
      return
    }
    
    // Pausar cualquier reproducción anterior
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    // Crear nuevo elemento de audio si no existe
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.7
      
      audioRef.current.addEventListener('ended', () => {
        setReproduciendo(null)
      })
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Error reproduciendo preview:', e)
        setReproduciendo(null)
      })
    }
    
    try {
      audioRef.current.src = cancion.preview_url
      await audioRef.current.play()
      setReproduciendo(cancion.id)
    } catch (error) {
      console.error('Error al reproducir:', error)
      setReproduciendo(null)
    }
  }
  
  // Limpiar audio al desmontar componente
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <section className="py-20 bg-negro-medio/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-blanco-puro mb-4">
            Búsqueda <span className="text-gradient">Inteligente</span> con IA
          </h2>
          <p className="text-lg sm:text-xl text-blanco-suave max-w-2xl mx-auto">
            Busca entre millones de canciones con resultados en tiempo real
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <Input
            placeholder="Busca canciones, artistas o álbumes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            icono={FaSearch}
            className="text-lg py-6"
          />
        </motion.div>

        {cargando ? (
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-verde-spotify/20 rounded-full" />
              <div className="absolute top-0 w-16 h-16 border-4 border-verde-spotify border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        ) : resultados.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {resultados.map((cancion, index) => (
              <motion.div
                key={cancion.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TarjetaMusical
                  titulo={cancion.titulo}
                  subtitulo={cancion.artista}
                  imagenUrl={cancion.imagen}
                  duracion={cancion.duracion}
                  estaReproduciendo={reproduciendo === cancion.id}
                  onReproducir={() => alternarReproduccion(cancion)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : busqueda && !cargando ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FaSearch className="text-5xl text-blanco-suave/30 mx-auto mb-4" />
            <p className="text-xl text-blanco-suave">
              No se encontraron resultados para &quot;{busqueda}&quot;
            </p>
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}