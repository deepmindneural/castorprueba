#!/usr/bin/env node

/**
 * Hook de post-deploy automático
 * Se ejecuta después de cada deploy en Coolify
 */

const https = require('https')

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://neuralforze.com'

console.log('🚀 Ejecutando hook de post-deploy...')

// Función para hacer peticiones HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data)
          })
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data
          })
        }
      })
    })
    
    req.on('error', reject)
    if (options.body) req.write(options.body)
    req.end()
  })
}

async function runPostDeploy() {
  try {
    console.log('1. ✅ Deploy completado, iniciando verificaciones...')
    
    // Esperar 10 segundos para que la app esté lista
    await new Promise(resolve => setTimeout(resolve, 10000))
    
    // Ejecutar auto-fix
    console.log('2. 🔄 Ejecutando auto-fix...')
    const autoFixResult = await makeRequest(`${SITE_URL}/api/auto-fix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    console.log('3. 📊 Resultado auto-fix:', autoFixResult.statusCode)
    
    if (autoFixResult.body.success) {
      console.log('✅ Todos los sistemas funcionando correctamente')
    } else {
      console.log('⚠️  Algunos problemas encontrados:', autoFixResult.body.errors)
    }
    
    // Ejecutar migración si es necesario
    console.log('4. 🔄 Verificando migraciones...')
    const migrateResult = await makeRequest(`${SITE_URL}/api/migrate`, {
      method: 'POST',
      headers: { 'x-migration-key': 'migrate-castor-2024' }
    })
    
    console.log('5. 📊 Resultado migración:', migrateResult.statusCode)
    
    console.log('🎉 Hook de post-deploy completado')
    
  } catch (error) {
    console.error('❌ Error en hook de post-deploy:', error.message)
    process.exit(1)
  }
}

runPostDeploy()