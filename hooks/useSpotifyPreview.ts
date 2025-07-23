'use client'

import { useState, useRef, useEffect } from 'react'

interface UseSpotifyPreviewProps {
  previewUrl: string | null
  useProxy?: boolean
}

export function useSpotifyPreview({ previewUrl, useProxy = true }: UseSpotifyPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Crear elemento de audio si no existe
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.7
    }

    // Limpiar al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  useEffect(() => {
    if (!previewUrl || !audioRef.current) return

    const audio = audioRef.current
    
    // Resetear estado
    setError(null)
    setIsLoading(true)

    // Usar proxy si está habilitado
    const audioUrl = useProxy 
      ? `/api/spotify/preview?url=${encodeURIComponent(previewUrl)}`
      : previewUrl

    audio.src = audioUrl

    // Event listeners
    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleError = (e: Event) => {
      console.error('Error cargando preview:', e)
      setError('No se pudo cargar el preview')
      setIsLoading(false)
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [previewUrl, useProxy])

  const play = async () => {
    if (!audioRef.current || !previewUrl) {
      setError('Preview no disponible')
      return
    }

    try {
      setError(null)
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        await playPromise
        setIsPlaying(true)
      }
    } catch (err: any) {
      console.error('Error al reproducir:', err)
      
      if (err.name === 'NotAllowedError') {
        setError('Haz clic para permitir la reproducción')
      } else if (err.name === 'NotSupportedError') {
        setError('Formato no soportado')
      } else {
        setError('Error al reproducir')
      }
      
      setIsPlaying(false)
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggle = async () => {
    if (isPlaying) {
      pause()
    } else {
      await play()
    }
  }

  return {
    isPlaying,
    isLoading,
    error,
    progress,
    play,
    pause,
    toggle,
    audioRef
  }
}