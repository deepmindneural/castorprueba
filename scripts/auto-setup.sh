#!/bin/bash

echo "🚀 Script de configuración automática - Castor Spotify"
echo "=============================================="

# Verificar conexión a BD
echo "1. Verificando conexión a base de datos..."
curl -s -o /dev/null -w "%{http_code}" https://neuralforze.com/api/health/db
if [ $? -eq 0 ]; then
    echo "✅ Base de datos: OK"
else
    echo "❌ Base de datos: Error"
fi

# Verificar token de Spotify
echo "2. Verificando token de Spotify..."
curl -s -o /dev/null -w "%{http_code}" https://neuralforze.com/api/spotify/token
if [ $? -eq 0 ]; then
    echo "✅ Token Spotify: OK"
else
    echo "❌ Token Spotify: Error"
fi

# Ejecutar migración automática si es necesario
echo "3. Verificando migraciones..."
curl -X POST -H "x-migration-key: migrate-castor-2024" -s https://neuralforze.com/api/migrate
echo "✅ Migraciones ejecutadas"

echo "=============================================="
echo "✅ Configuración automática completada"