'use client'
import React, { useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

const DEFAULT_DELAY = 300

/**
 * @description
 *  A hook which returns a debounced function.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-debounced-fn.html
 *
 */
export default function useDebouncedFn<T extends (...args: any[]) => any>(cb: T, delay = DEFAULT_DELAY) {
   const paramsRef = useSyncedRef({
      cb,
      delay,
   })
   const timerId = useRef<NodeJS.Timeout>()

   const debouncedCb = useRef({
      fn: (...args: Parameters<typeof cb>) => {
         if (timerId.current) {
            clearTimeout(timerId.current)
         }
         timerId.current = setTimeout(() => paramsRef.current.cb.call(null, ...args), paramsRef.current.delay)
      },
      cleanup: () => clearTimeout(timerId.current),
   })

   useEffect(() => {
      return () => {
         debouncedCb.current.cleanup()
      }
   }, [delay])

   return debouncedCb.current.fn
}

/**
 * @description
 *  A wrapper function which returns debounced version of passed callback.
 *  If needed to work outside of react, then use this wrapper function.
 */
export function debouncedFnWrapper<T extends (...args: any[]) => any>(cb: T, delay = DEFAULT_DELAY) {
   let timerId: NodeJS.Timeout

   return {
      fn: (...args: Parameters<typeof cb>) => {
         if (timerId) {
            clearTimeout(timerId)
         }
         timerId = setTimeout(() => cb.call(null, ...args), delay)
      },
      cleanup: () => clearTimeout(timerId),
   }
}
