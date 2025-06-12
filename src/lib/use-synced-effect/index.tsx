'use client'
import type { DependencyList, EffectCallback } from 'react'
import React, { useEffect, useRef } from 'react'

const DEP: DependencyList = []

/**
 * @description
 * A React hook that executes a callback when dependencies change, similar to `useEffect`, but skips execution on the initial mount.
 * @example
   import { useState } from 'react'
   import { useSyncedEffect } from 'classic-react-hooks'

   export default function YourComponent() {
      const [counter, setCounter] = useState(0)

      useSyncedEffect(() => {
         console.log('counter changed to ', counter)
      }, [counter])

      return (
         <div>
            <button onClick={() => setCounter((c) => c + 1)}>increment</button>
         </div>
      )
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-synced-effect.html
 */
export default function useSyncedEffect(cb: EffectCallback, deps?: DependencyList) {
   const isInitialLoad = useRef(true)
   const cleanup = useRef<void | (() => void)>()

   useEffect(() => {
      let timeoutId: NodeJS.Timeout
      if (isInitialLoad.current) {
         // handling React.StrictMode double time firing
         timeoutId = setTimeout(() => {
            isInitialLoad.current = false
         })
      } else {
         cleanup.current = cb()
      }
      return () => {
         if (timeoutId) {
            clearTimeout(timeoutId)
         }
         cleanup.current?.()
      }
   }, deps ?? DEP)
}
