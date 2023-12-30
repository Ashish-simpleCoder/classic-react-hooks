import React from 'react'
import { cnMerge } from '../utils/cn-merge'

export default function ExampleContainer(props: JSX.IntrinsicElements['div']) {
   const { children, className, ...rest } = props

   return (
      <div
         className={cnMerge('flex flex-col gap-4 px-4 py-6 rounded-md bg-gray-100 dark:bg-custom-gray-dark', className)}
         {...rest}>
         {children}
      </div>
   )
}
