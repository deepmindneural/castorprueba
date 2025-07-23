'use client'

import { motion } from 'framer-motion'

interface LogoCastorProps {
  className?: string
  size?: number
  animate?: boolean
}

export function LogoCastor({ className = '', size = 60, animate = true }: LogoCastorProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Círculo exterior con gradiente */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1DB954" />
          <stop offset="100%" stopColor="#1ED760" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Círculo principal */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#logoGradient)"
        filter="url(#glow)"
        animate={animate ? { 
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Forma de C estilizada (Castor) */}
      <motion.path
        d="M 30 50 Q 30 25, 50 25 Q 70 25, 70 50 Q 70 75, 50 75 Q 40 75, 35 65"
        stroke="#000000"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        animate={animate ? {
          pathLength: [0, 1, 1, 0],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.6, 1]
        }}
      />

      {/* Ondas de sonido */}
      <motion.path
        d="M 60 40 Q 65 50, 60 60"
        stroke="#000000"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
        animate={animate ? {
          scale: [1, 1.2, 1],
          opacity: [0.8, 0.4, 0.8]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.path
        d="M 65 35 Q 72 50, 65 65"
        stroke="#000000"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
        animate={animate ? {
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.3, 0.6]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />

      <motion.path
        d="M 70 30 Q 79 50, 70 70"
        stroke="#000000"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
        animate={animate ? {
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.2, 0.4]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4
        }}
      />
    </motion.svg>
  )
}