'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AdminPage() {
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [migrating, setMigrating] = useState(false)
  const [autoFixing, setAutoFixing] = useState(false)

  useEffect(() => {
    checkDatabaseStatus()
    checkAuthStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/health/db')
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      setDbStatus({ connected: false, error: 'Error de conexión' })
    }
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/test/auth')
      const data = await response.json()
      setAuthStatus(data)
    } catch (error) {
      setAuthStatus({ database: 'Error', error: 'No se pudo verificar' })
    }
    setLoading(false)
  }

  const runMigration = async () => {
    setMigrating(true)
    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'x-migration-key': 'migrate-castor-2024'
        }
      })
      const result = await response.json()
      
      if (result.success) {
        alert('Migración completada exitosamente')
        checkDatabaseStatus()
        checkAuthStatus()
      } else {
        alert(`Error en migración: ${result.error}`)
      }
    } catch (error) {
      alert(`Error: ${error}`)
    }
    setMigrating(false)
  }

  const runAutoFix = async () => {
    setAutoFixing(true)
    try {
      const response = await fetch('/api/auto-fix', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        alert('Auto-fix completado exitosamente')
        checkDatabaseStatus()
        checkAuthStatus()
      } else {
        alert(`Problemas encontrados: ${result.errors?.join(', ')}`)
      }
      
      console.log('Auto-fix resultado:', result)
    } catch (error) {
      alert(`Error: ${error}`)
    }
    setAutoFixing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-negro-suave flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-verde-spotify"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-negro-suave p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-blanco-puro mb-8"
        >
          Panel de Administración
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estado de Base de Datos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-blanco-puro mb-4">
              Estado de Base de Datos
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blanco-suave">Conexión:</span>
                <span className={`font-semibold ${
                  dbStatus?.connected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {dbStatus?.connected ? '✅ Conectada' : '❌ Desconectada'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blanco-suave">DATABASE_URL:</span>
                <span className="text-verde-spotify">
                  {dbStatus?.database_url || 'No configurada'}
                </span>
              </div>
              
              {dbStatus?.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                  <p className="text-red-400 text-sm">{dbStatus.error}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Estado de Autenticación */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-blanco-puro mb-4">
              Sistema de Autenticación
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blanco-suave">Esquema:</span>
                <span className={`font-semibold ${
                  authStatus?.schema_status === 'Migrado' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {authStatus?.schema_status || 'Verificando...'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blanco-suave">Usuarios registrados:</span>
                <span className="text-verde-spotify">
                  {authStatus?.users_count || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-blanco-suave">Entorno:</span>
                <span className="text-blanco-puro">
                  {authStatus?.environment || 'unknown'}
                </span>
              </div>
              
              {authStatus?.tables && (
                <div className="bg-verde-spotify/10 border border-verde-spotify/20 rounded p-3">
                  <p className="text-verde-spotify text-sm">
                    Tablas: {authStatus.tables.length} encontradas
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-effect rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-blanco-puro mb-4">
            Enlaces de Prueba
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <button
              onClick={runAutoFix}
              disabled={autoFixing}
              className="bg-blue-600 hover:bg-blue-700 text-blanco-puro font-semibold py-2 px-4 rounded-lg transition-colors text-center disabled:opacity-50"
            >
              {autoFixing ? 'Reparando...' : '🔧 Auto-Fix'}
            </button>
            
            <a
              href="/api/health/db"
              target="_blank"
              className="bg-verde-spotify hover:bg-verde-claro text-negro-puro font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Test BD Raw
            </a>
            <a
              href="/api/test/auth"
              target="_blank"
              className="bg-verde-spotify hover:bg-verde-claro text-negro-puro font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Test Auth
            </a>
            <button
              onClick={runMigration}
              disabled={migrating}
              className="bg-red-600 hover:bg-red-700 text-blanco-puro font-semibold py-2 px-4 rounded-lg transition-colors text-center disabled:opacity-50"
            >
              {migrating ? 'Migrando...' : 'Migrar BD'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}