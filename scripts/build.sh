#!/bin/bash

# Script de build para producción con Prisma

echo "🔄 Generando cliente de Prisma..."
npx prisma generate

echo "🏗️  Construyendo aplicación Next.js..."
npm run build

echo "✅ Build completado!"