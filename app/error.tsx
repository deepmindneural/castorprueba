'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-negro-suave flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block mb-6"
        >
          <FaExclamationTriangle className="text-6xl text-amarillo-500" />
        </motion.div>

        <h2 className="text-2xl font-bold text-blanco-puro mb-4">
          ¡Ups! Algo salió mal
        </h2>

        <p className="text-blanco-suave mb-6">
          Encontramos un error al cargar el contenido. Por favor, intenta de nuevo.
        </p>

        <p className="text-sm text-blanco-suave/60 mb-8 font-mono bg-negro-claro/50 p-3 rounded-lg">
          {error.message || 'Error desconocido'}
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 gradient-spotify rounded-full hover-scale text-blanco-puro font-semibold"
        >
          <FaRedo />
          Intentar de nuevo
        </button>
      </motion.div>
    </div>
  )
}