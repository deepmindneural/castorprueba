# Guía para Configurar Spotify API

## Pasos para crear tu aplicación en Spotify:

### 1. Crear cuenta de desarrollador
1. Ve a [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify (o crea una nueva)

### 2. Crear una nueva aplicación
1. Click en "Create app" en el dashboard
2. Completa el formulario:
   - **App name**: Castor Spotify (o el nombre que prefieras)
   - **App description**: Aplicación de búsqueda y reproducción de música
   - **Website**: http://localhost:3000 (para desarrollo)
   - **Redirect URIs**: http://localhost:3000/callback
   - Marca la casilla de términos de servicio
3. Click en "Create"

### 3. Obtener las credenciales
1. En la página de tu app, encontrarás:
   - **Client ID**: Un código largo (ejemplo: abc123def456...)
   - **Client Secret**: Click en "View client secret" para verlo

### 4. Configurar las variables de entorno
1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` con tus credenciales:
   ```
   SPOTIFY_CLIENT_ID=tu_client_id_aqui
   SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
   ```

### 5. Para producción (Railway, Vercel, etc.)
En el panel de tu servicio de hosting, agrega estas variables de entorno:
- `SPOTIFY_CLIENT_ID`: Tu Client ID
- `SPOTIFY_CLIENT_SECRET`: Tu Client Secret

## Token temporal (mientras configuras)
El proyecto actualmente usa un token temporal hardcodeado que eventualmente expirará. 
Una vez que configures tus credenciales, la aplicación generará tokens automáticamente.

## Límites de la API
- Con Client Credentials Flow (sin login de usuario):
  - Puedes buscar canciones, artistas, álbumes
  - Puedes obtener información pública
  - NO puedes controlar la reproducción del usuario
  - NO puedes acceder a datos privados del usuario

## Solución de problemas
- Si ves errores 401: El token expiró o las credenciales son incorrectas
- Si ves errores 404: El endpoint no existe o requiere autenticación de usuario
- Si ves errores 429: Límite de rate excedido, espera un momento

## Enlaces útiles
- [Documentación de Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Dashboard de aplicaciones](https://developer.spotify.com/dashboard)
- [Guía de autenticación](https://developer.spotify.com/documentation/web-api/tutorials/getting-started)