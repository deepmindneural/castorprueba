# Configuración para Coolify

## Variables de Entorno

En el panel de Coolify, ve a tu aplicación y agrega estas variables de entorno:

### En la sección "Environment Variables":

```
SPOTIFY_CLIENT_ID=4a0842d5eaf240469ee4c20a022ce406
SPOTIFY_CLIENT_SECRET=584bb857fa6f491792047d4660d37349
NEXT_PUBLIC_APP_URL=https://neuralforze.com
DATABASE_URL=postgres://postgres:fISwib48pzeW4EmCucWSQ6epbTBGDTCQAoUW7J3MxbfoegBQYoFYKtKsnpIVUhdD@zg8ks4o0ggg8wow44s4oc04o:5432/postgres
JWT_SECRET=cambia_este_valor_por_uno_muy_seguro_en_produccion_123456789
```

## Opciones de configuración en Coolify:

### 1. Build Command:
```
npm run build
```

### 2. Start Command:
```
npm start
```

### 3. Install Command:
```
npm install
```

### 4. Port:
```
3000
```

### 5. Health Check Path (opcional):
```
/api/health
```

## Si usas Docker con Coolify:

El proyecto ya incluye un Dockerfile optimizado que Coolify detectará automáticamente.

## Notas importantes:

1. **NO** subas el archivo `.env.local` o `.env.production` a GitHub
2. Siempre configura las variables directamente en Coolify
3. Si cambias el dominio, actualiza `NEXT_PUBLIC_APP_URL`
4. El token de Spotify se renovará automáticamente con estas credenciales