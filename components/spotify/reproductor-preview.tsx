'use client'

import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaExclamationTriangle } from 'react-icons/fa'

interface ReproductorPreviewProps {
  previewUrl: string | null
  nombreCancion: string
  nombreArtista: string
  onPlay?: () => void
  onPause?: () => void
}

export function ReproductorPreview({ 
  previewUrl, 
  nombreCancion, 
  nombreArtista,
  onPlay,
  onPause 
}: ReproductorPreviewProps) {
  const [reproduciendo, setReproduciendo] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progreso, setProgreso] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioListo, setAudioListo] = useState(false)

  useEffect(() => {
    // Limpiar audio cuando el componente se desmonta
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (previewUrl && audioRef.current) {
      // Resetear estado
      setError(null)
      setAudioListo(false)
      
      // Configurar nuevo audio
      audioRef.current.src = previewUrl
      audioRef.current.load()
      
      // Event listeners
      const handleCanPlay = () => {
        setAudioListo(true)
        setCargando(false)
      }
      
      const handleError = (e: Event) => {
        console.error('Error cargando preview:', e)
        setError('No se pudo cargar el preview')
        setCargando(false)
        setReproduciendo(false)
      }
      
      const handleEnded = () => {
        setReproduciendo(false)
        setProgreso(0)
        onPause?.()
      }
      
      const handleTimeUpdate = () => {
        if (audioRef.current && audioRef.current.duration) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
          setProgreso(progress)
        }
      }
      
      audioRef.current.addEventListener('canplay', handleCanPlay)
      audioRef.current.addEventListener('error', handleError)
      audioRef.current.addEventListener('ended', handleEnded)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay)
          audioRef.current.removeEventListener('error', handleError)
          audioRef.current.removeEventListener('ended', handleEnded)
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        }
      }
    }
  }, [previewUrl, onPause])

  const toggleReproduccion = async () => {
    if (!audioRef.current || !previewUrl) {
      setError('Preview no disponible')
      return
    }

    setCargando(true)
    setError(null)

    try {
      if (reproduciendo) {
        audioRef.current.pause()
        setReproduciendo(false)
        onPause?.()
      } else {
        // Intentar reproducir con manejo de errores mejorado
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          await playPromise
          setReproduciendo(true)
          onPlay?.()
        }
      }
    } catch (err) {
      console.error('Error al reproducir:', err)
      
      // Errores específicos del navegador
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Haz clic para permitir la reproducción')
        } else if (err.name === 'NotSupportedError') {
          setError('Formato de audio no soportado')
        } else {
          setError('Error al reproducir el preview')
        }
      }
      
      setReproduciendo(false)
    } finally {
      setCargando(false)
    }
  }

  // Si no hay URL de preview
  if (!previewUrl) {
    return (
      <div className="flex items-center gap-2 text-amarillo-500 text-sm">
        <FaExclamationTriangle />
        <span>Preview no disponible</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <audio 
        ref={audioRef} 
        preload="metadata"
        crossOrigin="anonymous"
      />
      
      <div className="flex items-center gap-3">
        <button
          onClick={toggleReproduccion}
          disabled={cargando || !!error}
          className={`p-3 rounded-full transition-all ${
            error 
              ? 'bg-red-500/20 text-red-400 cursor-not-allowed' 
              : cargando
              ? 'bg-gris-oscuro animate-pulse cursor-wait'
              : 'bg-verde-spotify hover:bg-verde-claro text-negro-puro'
          }`}
          title={error || (reproduciendo ? 'Pausar' : 'Reproducir preview')}
        >
          {cargando ? (
            <div className="w-5 h-5 border-2 border-negro-puro/30 border-t-negro-puro rounded-full animate-spin" />
          ) : reproduciendo ? (
            <FaPause className="text-lg" />
          ) : (
            <FaPlay className="text-lg ml-0.5" />
          )}
        </button>
        
        <div className="flex-1">
          <div className="text-sm font-medium text-blanco-puro truncate">
            {nombreCancion}
          </div>
          <div className="text-xs text-blanco-suave truncate">
            {nombreArtista}
          </div>
        </div>
      </div>
      
      {/* Barra de progreso */}
      {audioListo && !error && (
        <div className="h-1 bg-negro-claro rounded-full overflow-hidden">
          <div 
            className="h-full bg-verde-spotify transition-all duration-100"
            style={{ width: `${progreso}%` }}
          />
        </div>
      )}
      
      {/* Mensaje de error */}
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
      
      {/* Información de preview */}
      {audioListo && !error && (
        <p className="text-xs text-blanco-suave/60">
          Preview de 30 segundos
        </p>
      )}
    </div>
  )
}