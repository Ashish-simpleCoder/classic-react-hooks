'use client'
import type { DependencyList, EffectCallback } from 'react'
import React, { useEffect, useRef } from 'react'

const DEP: DependencyList = []

/**
 * @description
 * A hooks that fires the given callback for given dependencies.
 *
 * It works exacatly like `useEffect`. But callback doesn't get fired on initial mount.
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
