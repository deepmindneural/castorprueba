'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { IconType } from 'react-icons'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icono?: IconType
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icono: Icono, ...props }, ref) => {
    return (
      <div className="relative">
        {Icono && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blanco-suave/50">
            <Icono className="text-xl" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-xl bg-negro-claro/50 backdrop-blur-sm px-4 py-3 text-base text-blanco-puro placeholder:text-blanco-suave/50',
            'border-2 border-blanco-suave/10 focus:border-verde-spotify transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-verde-spotify/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            Icono && 'pl-12',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }