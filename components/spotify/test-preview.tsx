'use client'

import { useSpotifyPreview } from '@/hooks/useSpotifyPreview'
import { FaPlay, FaPause } from 'react-icons/fa'

export function TestPreview() {
  // URL de preview conocida que funciona
  const testPreviewUrl = 'https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba'
  
  const { isPlaying, isLoading, error, progress, toggle } = useSpotifyPreview({
    previewUrl: testPreviewUrl,
    useProxy: true
  })
  
  return (
    <div className="p-6 bg-negro-medio rounded-lg max-w-md mx-auto">
      <h3 className="text-lg font-bold text-blanco-puro mb-4">Test de Preview</h3>
      
      <div className="space-y-4">
        <button
          onClick={toggle}
          disabled={isLoading}
          className={`p-3 rounded-full ${
            isLoading 
              ? 'bg-gris-oscuro animate-pulse' 
              : 'bg-verde-spotify hover:bg-verde-claro'
          } text-negro-puro transition-colors`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-negro-puro/30 border-t-negro-puro rounded-full animate-spin" />
          ) : isPlaying ? (
            <FaPause />
          ) : (
            <FaPlay className="ml-0.5" />
          )}
        </button>
        
        <div className="h-2 bg-negro-claro rounded-full overflow-hidden">
          <div 
            className="h-full bg-verde-spotify transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        
        <div className="text-xs text-blanco-suave space-y-1">
          <p>Estado: {isPlaying ? 'Reproduciendo' : 'Pausado'}</p>
          <p>Progreso: {Math.round(progress)}%</p>
          <p>Usando proxy: Sí</p>
        </div>
      </div>
    </div>
  )
}