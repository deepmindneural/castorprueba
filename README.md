# Castor Spotify 🎵

Plataforma musical inteligente con integración de Spotify API y algoritmos de IA propios.

## 🚀 Configuración Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar credenciales de Spotify

Para que la aplicación funcione con datos reales de Spotify, necesitas obtener credenciales de la API:

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Crea una nueva aplicación
4. Copia el **Client ID** y **Client Secret**
5. Edita el archivo `.env.local` y reemplaza los valores:

```env
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

### 3. Ejecutar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## ✨ Características

- 🔍 **Búsqueda Inteligente**: Busca canciones, artistas y álbumes con resultados en tiempo real
- 🎵 **Reproductor Premium**: Control total de reproducción con preview de canciones
- 📊 **Nuevos Lanzamientos**: Descubre los álbumes más recientes
- 🎯 **Playlists Destacadas**: Listas curadas por categorías
- 🏷️ **Categorías Musicales**: Explora por géneros y estilos
- 🤖 **Algoritmos de IA**: Recomendaciones personalizadas basadas en tus gustos

## 🛠️ Tecnologías

- **Next.js 15**: Framework de React con App Router
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Estilos modernos y responsivos
- **Spotify Web API**: Integración completa con Spotify
- **Framer Motion**: Animaciones fluidas
- **GSAP**: Animaciones avanzadas
- **PostgreSQL + Prisma**: Base de datos (opcional)

## 📝 Notas

- Si no configuras las credenciales de Spotify, la aplicación funcionará en modo demo con datos de respaldo
- La aplicación no requiere que los usuarios inicien sesión para funciones básicas
- El reproductor utiliza previews de 30 segundos proporcionados por Spotify

## 🔧 Solución de Problemas

### Error: "Failed to get token: 400 Bad Request"
Esto significa que las credenciales de Spotify no están configuradas correctamente. Verifica:
1. Que hayas copiado correctamente el Client ID y Client Secret
2. Que el archivo `.env.local` esté en la raíz del proyecto
3. Reinicia el servidor de desarrollo después de cambiar las variables de entorno

### La página muestra "Application error"
1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Limpia la caché de Next.js: `rm -rf .next`
3. Reinicia el servidor de desarrollo

## 👨‍💻 Desarrollado por

**Jeison Leandro Zapata**

---

© 2024 Castor Spotify. Todos los derechos reservados.