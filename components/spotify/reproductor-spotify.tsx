'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedo, FaSpotify } from 'react-icons/fa'
import Image from 'next/image'
import { SpotifyService } from '@/lib/spotify/spotify-service'
import { obtenerTokenPublico } from '@/lib/spotify/spotify-public'

export function ReproductorSpotify() {
  const [reproduciendo, setReproduciendo] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [volumen, setVolumen] = useState(70)
  const [aleatorio, setAleatorio] = useState(false)
  const [repetir, setRepetir] = useState(false)
  const [cancionActual, setCancionActual] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [errorAudio, setErrorAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    cargarCancionPopular()
  }, [])

  const cargarCancionPopular = async () => {
    try {
      const token = await obtenerTokenPublico()
      const spotify = new SpotifyService(token)
      const data = await spotify.buscar({
        q: 'top hits 2024',
        type: ['track'],
        limit: 1
      })
      
      if (data.tracks?.items.length > 0) {
        const track = data.tracks.items[0]
        setCancionActual({
          id: track.id,
          titulo: track.name,
          artista: track.artists.map((a: any) => a.name).join(', '),
          album: track.album.name,
          imagen: track.album.images[0]?.url || 'https://picsum.photos/400/400',
          duracionTotal: Math.floor(track.duration_ms / 1000),
          preview_url: track.preview_url,
          spotify_url: track.external_urls.spotify
        })
        
        if (track.preview_url && audioRef.current) {
          audioRef.current.src = track.preview_url
          audioRef.current.load()
          setErrorAudio(false)
        } else {
          setErrorAudio(true)
        }
      }
    } catch (error) {
      console.error('Error cargando canción:', error)
      // Usar una canción con preview disponible
      setCancionActual({
        id: '3n3Ppam7vgaVa1iaRUc9Lp',
        titulo: 'Mr. Brightside',
        artista: 'The Killers',
        album: 'Hot Fuss',
        imagen: 'https://i.scdn.co/image/ab67616d0000b27342459a1c8b2c7b5d9a3e7e3f',
        duracionTotal: 30,
        preview_url: 'https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba',
        spotify_url: null
      })
      
      if (audioRef.current) {
        audioRef.current.src = 'https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba'
        audioRef.current.load()
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumen / 100
      
      const updateProgress = () => {
        if (audioRef.current && audioRef.current.duration) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
          setProgreso(progress)
        }
      }
      
      audioRef.current.addEventListener('timeupdate', updateProgress)
      audioRef.current.addEventListener('ended', () => {
        setReproduciendo(false)
        setProgreso(0)
        if (repetir && audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play()
          setReproduciendo(true)
        }
      })
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Error de audio:', e)
        setErrorAudio(true)
        setReproduciendo(false)
      })
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress)
        }
      }
    }
  }, [volumen])

  const toggleReproduccion = async () => {
    if (audioRef.current && cancionActual?.preview_url) {
      try {
        if (reproduciendo) {
          audioRef.current.pause()
          setReproduciendo(false)
        } else {
          await audioRef.current.play()
          setReproduciendo(true)
          setErrorAudio(false)
        }
      } catch (error) {
        console.error('Error al reproducir:', error)
        setErrorAudio(true)
        setReproduciendo(false)
      }
    }
  }

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
    const seg = Math.floor(segundos % 60)
    return `${minutos}:${seg.toString().padStart(2, '0')}`
  }

  const manejarProgreso = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoProgreso = Number(e.target.value)
    setProgreso(nuevoProgreso)
    
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (nuevoProgreso / 100) * audioRef.current.duration
    }
  }

  if (cargando) {
    return (
      <section className="py-20 bg-gradient-to-b from-negro-medio/50 to-negro-puro">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-verde-spotify/20 rounded-full" />
            <div className="absolute top-0 w-16 h-16 border-4 border-verde-spotify border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-negro-medio/50 to-negro-puro">
      <audio ref={audioRef} />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-blanco-puro mb-4">
            Reproductor <span className="text-gradient">Premium</span>
          </h2>
          <p className="text-lg sm:text-xl text-blanco-suave">
            Control total de tu música con calidad de estudio
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-effect rounded-3xl p-6 sm:p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Imagen del álbum */}
              <motion.div
                animate={{ rotate: reproduciendo ? 360 : 0 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="relative aspect-square max-w-sm mx-auto w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-verde-spotify/30 to-verde-oscuro/30 rounded-2xl blur-2xl" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={cancionActual?.imagen || 'https://picsum.photos/400/400'}
                    alt={cancionActual?.titulo || 'Álbum'}
                    fill
                    className="object-cover"
                  />
                </div>
                {reproduciendo && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-verde-spotify/20 rounded-full blur-xl" />
                  </motion.div>
                )}
              </motion.div>

              {/* Controles */}
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-blanco-puro mb-1 truncate">
                    {cancionActual?.titulo || 'Selecciona una canción'}
                  </h3>
                  <p className="text-base sm:text-lg text-blanco-suave">{cancionActual?.artista}</p>
                  <p className="text-sm text-blanco-suave/60">{cancionActual?.album}</p>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="relative h-2 bg-negro-claro rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 gradient-spotify"
                      style={{ width: `${progreso}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progreso}
                      onChange={manejarProgreso}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-blanco-suave/60">
                    <span>{formatearTiempo((progreso / 100) * (cancionActual?.duracionTotal || 0))}</span>
                    <span>{formatearTiempo(cancionActual?.duracionTotal || 0)}</span>
                  </div>
                </div>

                {/* Controles principales */}
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setAleatorio(!aleatorio)}
                    className={`p-2 rounded-full transition-colors ${
                      aleatorio ? 'text-verde-spotify' : 'text-blanco-suave hover:text-blanco-puro'
                    }`}
                  >
                    <FaRandom className="text-base sm:text-lg" />
                  </button>

                  <button className="p-2 sm:p-3 rounded-full text-blanco-suave hover:text-blanco-puro transition-colors">
                    <FaStepBackward className="text-lg sm:text-xl" />
                  </button>

                  <button
                    onClick={toggleReproduccion}
                    className={`p-3 sm:p-4 rounded-full hover-scale shadow-lg ${
                      !cancionActual?.preview_url || errorAudio
                        ? 'bg-gris-oscuro cursor-not-allowed opacity-50'
                        : 'gradient-spotify'
                    }`}
                    disabled={!cancionActual?.preview_url || errorAudio}
                  >
                    {reproduciendo ? (
                      <FaPause className="text-xl sm:text-2xl text-blanco-puro" />
                    ) : (
                      <FaPlay className="text-xl sm:text-2xl text-blanco-puro ml-1" />
                    )}
                  </button>

                  <button className="p-2 sm:p-3 rounded-full text-blanco-suave hover:text-blanco-puro transition-colors">
                    <FaStepForward className="text-lg sm:text-xl" />
                  </button>

                  <button
                    onClick={() => setRepetir(!repetir)}
                    className={`p-2 rounded-full transition-colors ${
                      repetir ? 'text-verde-spotify' : 'text-blanco-suave hover:text-blanco-puro'
                    }`}
                  >
                    <FaRedo className="text-base sm:text-lg" />
                  </button>
                </div>

                {/* Control de volumen */}
                <div className="flex items-center gap-3">
                  <FaVolumeUp className="text-blanco-suave" />
                  <div className="flex-1 relative h-2 bg-negro-claro rounded-full">
                    <motion.div
                      className="absolute inset-y-0 left-0 gradient-spotify rounded-full"
                      style={{ width: `${volumen}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volumen}
                      onChange={(e) => setVolumen(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-blanco-suave w-10 text-right">{volumen}%</span>
                </div>

                {/* Información adicional */}
                <div className="pt-4 text-center md:text-left">
                  {errorAudio ? (
                    <p className="text-xs text-red-400">
                      Error al cargar el audio. Intenta con otra canción.
                    </p>
                  ) : cancionActual?.preview_url ? (
                    <p className="text-xs text-blanco-suave/60">
                      Preview de 30 segundos disponible
                    </p>
                  ) : (
                    <p className="text-xs text-amarillo-500">
                      Preview no disponible para esta canción
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}