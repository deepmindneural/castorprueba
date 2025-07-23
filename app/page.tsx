'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaMusic, FaHeadphones, FaBrain, FaChartLine, FaRocket, FaShieldAlt, FaCode } from 'react-icons/fa'
import { BiStats } from 'react-icons/bi'
import { SiTensorflow, SiPython } from 'react-icons/si'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BusquedaInteractiva } from '@/components/spotify/busqueda-interactiva'
import { ReproductorSpotify } from '@/components/spotify/reproductor-spotify'
import { SeccionNuevosLanzamientos } from '@/components/spotify/seccion-nuevos-lanzamientos'
import { SeccionPlaylistsDestacadas } from '@/components/spotify/seccion-playlists-destacadas'
import { SeccionCategorias } from '@/components/spotify/seccion-categorias'
import { Footer } from '@/components/layout/footer'
import { LogoCastor } from '@/components/ui/logo-castor'

gsap.registerPlugin(ScrollTrigger)

export default function PaginaInicio() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del hero
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2,
      })

      // Animación de las características
      gsap.from('.feature-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
      })

      // Animación de estadísticas
      gsap.from('.stat-item', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 75%',
        },
      })

      // Efecto parallax en el fondo
      gsap.to('.bg-gradient', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  const caracteristicas = [
    {
      icono: FaBrain,
      titulo: 'IA Avanzada',
      descripcion: 'Algoritmos de Machine Learning que analizan tus preferencias musicales',
      detalles: ['Redes neuronales', 'Filtrado colaborativo', 'Análisis predictivo'],
    },
    {
      icono: FaMusic,
      titulo: 'Análisis Musical',
      descripcion: 'Descompone canciones en características acústicas y emocionales',
      detalles: ['Tempo y ritmo', 'Energía y valencia', 'Tonalidad y modo'],
    },
    {
      icono: FaChartLine,
      titulo: 'Estadísticas Detalladas',
      descripcion: 'Visualiza tu historial musical con gráficos interactivos',
      detalles: ['Tendencias temporales', 'Géneros favoritos', 'Artistas top'],
    },
    {
      icono: FaRocket,
      titulo: 'Rendimiento Óptimo',
      descripcion: 'Arquitectura escalable con respuestas en tiempo real',
      detalles: ['Next.js 15', 'PostgreSQL', 'Edge Functions'],
    },
    {
      icono: FaShieldAlt,
      titulo: 'Seguridad Total',
      descripcion: 'Protección de datos con encriptación de nivel empresarial',
      detalles: ['OAuth 2.0', 'JWT Tokens', 'Bcrypt hashing'],
    },
    {
      icono: FaCode,
      titulo: 'Código Limpio',
      descripcion: 'Desarrollo con mejores prácticas y documentación completa',
      detalles: ['TypeScript', 'Clean Architecture', 'Tests automatizados'],
    },
  ]

  const estadisticas = [
    { numero: '99.9%', descripcion: 'Precisión en recomendaciones' },
    { numero: '<50ms', descripcion: 'Tiempo de respuesta' },
    { numero: '100K+', descripcion: 'Canciones analizadas' },
    { numero: '24/7', descripcion: 'Disponibilidad' },
  ]

  return (
    <div className="min-h-screen bg-negro-suave overflow-x-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 bg-gradient pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-verde-spotify/10 via-transparent to-verde-oscuro/5" />
      </div>

      {/* Hero Section Mejorado */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Elementos flotantes animados */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-verde-spotify/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -100, 0],
              y: [0, 100, 0],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-verde-oscuro/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto text-center z-10">
          <motion.div className="flex flex-col sm:flex-row justify-center items-center mb-8 hero-title gap-4">
            <LogoCastor size={120} animate={true} />
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-blanco-puro">
              Castor <span className="text-gradient">Spotify</span>
            </h1>
          </motion.div>
          
          <motion.p className="text-xl md:text-2xl text-blanco-suave mb-4 hero-title">
            Descubre música con inteligencia artificial avanzada
          </motion.p>
          
          <motion.p className="text-lg text-blanco-suave/80 mb-12 hero-title max-w-2xl mx-auto">
            Plataforma musical de última generación que combina el poder de Spotify API
            con algoritmos de IA propios para ofrecerte una experiencia única y personalizada
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center hero-title">
            <Link
              href="/registro"
              className="px-10 py-5 gradient-spotify text-blanco-puro font-semibold rounded-full hover-scale text-center text-lg shadow-xl"
            >
              Comenzar Gratis
            </Link>
            <Link
              href="/login"
              className="px-10 py-5 glass-effect text-blanco-puro font-semibold rounded-full hover-scale text-center border-2 border-verde-spotify text-lg"
            >
              Iniciar Sesión
            </Link>
          </motion.div>
        </div>

        {/* Indicador de scroll */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-blanco-suave/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blanco-suave rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Características detalladas */}
      <section ref={featuresRef} className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blanco-puro mb-4">
              Características <span className="text-gradient">Avanzadas</span>
            </h2>
            <p className="text-xl text-blanco-suave max-w-3xl mx-auto">
              Tecnología de punta para una experiencia musical sin precedentes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caracteristicas.map((caracteristica, index) => {
              const Icono = caracteristica.icono
              return (
                <div key={index} className="feature-card">
                  <div className="glass-effect p-8 rounded-2xl h-full hover:bg-blanco-suave/5 transition-all duration-300">
                    <Icono className="text-verde-spotify text-5xl mb-4" />
                    <h3 className="text-2xl font-bold text-blanco-puro mb-3">
                      {caracteristica.titulo}
                    </h3>
                    <p className="text-blanco-suave mb-4">
                      {caracteristica.descripcion}
                    </p>
                    <ul className="space-y-2">
                      {caracteristica.detalles.map((detalle, i) => (
                        <li key={i} className="text-sm text-blanco-suave/70 flex items-center">
                          <span className="w-1.5 h-1.5 bg-verde-spotify rounded-full mr-2" />
                          {detalle}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <SeccionCategorias />

      {/* Nuevos Lanzamientos */}
      <SeccionNuevosLanzamientos />

      {/* Búsqueda interactiva */}
      <BusquedaInteractiva />

      {/* Playlists Destacadas */}
      <SeccionPlaylistsDestacadas />

      {/* Reproductor Spotify */}
      <ReproductorSpotify />

      {/* Estadísticas */}
      <section ref={statsRef} className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blanco-puro mb-4">
              Números que <span className="text-gradient">Hablan</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estadisticas.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="glass-effect p-6 rounded-xl">
                  <p className="text-4xl md:text-5xl font-bold text-verde-spotify mb-2">
                    {stat.numero}
                  </p>
                  <p className="text-sm text-blanco-suave">
                    {stat.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologías utilizadas */}
      <section className="py-20 bg-negro-medio/30 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blanco-puro mb-4">
              Stack <span className="text-gradient">Tecnológico</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { nombre: 'Next.js 15', color: 'text-blanco-puro' },
              { nombre: 'TypeScript', color: 'text-blue-500' },
              { nombre: 'PostgreSQL', color: 'text-blue-400' },
              { nombre: 'Prisma ORM', color: 'text-indigo-400' },
              { nombre: 'Tailwind CSS', color: 'text-cyan-400' },
              { nombre: 'GSAP', color: 'text-green-400' },
              { nombre: 'Spotify API', color: 'text-verde-spotify' },
              { nombre: 'NextAuth.js', color: 'text-purple-400' },
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`glass-effect px-6 py-3 rounded-full ${tech.color} font-semibold`}
              >
                {tech.nombre}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-effect p-12 rounded-3xl max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-blanco-puro mb-4">
              ¿Listo para revolucionar tu experiencia musical?
            </h2>
            <p className="text-xl text-blanco-suave mb-8">
              Únete ahora y descubre el poder de la música con inteligencia artificial
            </p>
            <Link
              href="/registro"
              className="inline-block px-12 py-5 gradient-spotify text-blanco-puro font-semibold rounded-full hover-scale text-lg shadow-xl"
            >
              Crear Cuenta Gratis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}