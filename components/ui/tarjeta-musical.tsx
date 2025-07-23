'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaPlay, FaPause } from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface TarjetaMusicalProps {
  titulo: string
  subtitulo: string
  imagenUrl: string
  duracion?: string
  estaReproduciendo?: boolean
  onReproducir?: () => void
  className?: string
}

export function TarjetaMusical({
  titulo,
  subtitulo,
  imagenUrl,
  duracion,
  estaReproduciendo = false,
  onReproducir,
  className
}: TarjetaMusicalProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'glass-effect rounded-xl overflow-hidden hover:bg-blanco-suave/10 transition-all duration-300 cursor-pointer group',
        className
      )}
    >
      <div className="relative aspect-square">
        <Image
          src={imagenUrl}
          alt={titulo}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay con botón de reproducción */}
        <div className="absolute inset-0 bg-negro-puro/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {onReproducir && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onReproducir()
              }}
              className="p-4 bg-verde-spotify rounded-full hover:bg-verde-claro hover:scale-110 transition-all duration-200 shadow-xl"
            >
              {estaReproduciendo ? (
                <FaPause className="text-negro-puro text-xl" />
              ) : (
                <FaPlay className="text-negro-puro text-xl ml-1" />
              )}
            </button>
          )}
        </div>

        {/* Badge de duración */}
        {duracion && (
          <div className="absolute bottom-2 right-2 bg-negro-puro/80 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-xs text-blanco-puro font-medium">{duracion}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-blanco-puro truncate mb-1">
          {titulo}
        </h3>
        <p className="text-sm text-blanco-suave truncate">
          {subtitulo}
        </p>
      </div>
    </motion.div>
  )
}