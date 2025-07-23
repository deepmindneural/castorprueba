'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const botonVariantes = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-spotify focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variante: {
        default: 'gradient-spotify text-blanco-puro hover:opacity-90',
        destructivo: 'bg-red-500 text-blanco-puro hover:bg-red-600',
        outline: 'border border-verde-spotify bg-transparent hover:bg-verde-spotify/10',
        secundario: 'bg-negro-claro text-blanco-puro hover:bg-negro-medio',
        ghost: 'hover:bg-negro-claro hover:text-blanco-puro',
        link: 'text-verde-spotify underline-offset-4 hover:underline',
      },
      tamano: {
        default: 'h-10 px-6 py-2',
        sm: 'h-9 px-4',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variante: 'default',
      tamano: 'default',
    },
  }
)

export interface PropiedadesBoton
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof botonVariantes> {
  asChild?: boolean
}

const Boton = forwardRef<HTMLButtonElement, PropiedadesBoton>(
  ({ className, variante, tamano, ...props }, ref) => {
    return (
      <button
        className={cn(botonVariantes({ variante, tamano, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Boton.displayName = 'Boton'

export { Boton, botonVariantes }