import React from 'react'
import { cnMerge } from '../utils/cn-merge'

type Size = 'sm' | 'md' | 'lg'
type Color = 'primary' | 'secondary' | 'success' | 'error'

export default function AppButton(props: React.JSX.IntrinsicElements['button'] & { size?: Size; color?: Color }) {
   const { children, size = 'md', color = 'primary', className, ...rest } = props

   return (
      <button
         type='button'
         className={cnMerge(
            'text-slate-50 dark:text-slate-100',
            size === 'sm' && 'px-2 py-1 rounded-sm text-sm',
            size === 'md' && 'px-4 py-2 rounded-md text-base',
            size === 'lg' && 'px-6 py-2 rounded-lg text-lg',

            color === 'primary' && 'bg-blue-600 dark:bg-blue-800 hover:bg-blue-500  dark:hover:bg-blue-500',
            color === 'secondary' && 'bg-purple-600 dark:bg-purple-800 hover:bg-purple-500  dark:hover:bg-purple-500',
            color === 'success' && 'bg-green-600 dark:bg-green-800 hover:bg-green-500  dark:hover:bg-green-500',
            color === 'error' && 'bg-red-600 dark:bg-red-800 hover:bg-red-500  dark:hover:bg-red-500',
            className
         )}
         {...rest}>
         {children}
      </button>
   )
}
