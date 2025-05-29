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
export default function useDebouncedFn<T extends (...args: any[]) => any>({
   callbackToBounce,
   delay = DEFAULT_DELAY,
}: {
   callbackToBounce: T
   delay?: number
}) {
   const paramsRef = useSyncedRef({
      callbackToBounce,
      delay,
   })
   const timerId = useRef<NodeJS.Timeout>()

   const debouncedCb = useRef({
      fn: (...args: Parameters<typeof callbackToBounce>) => {
         if (timerId.current) {
            clearTimeout(timerId.current)
         }
         timerId.current = setTimeout(
            () => paramsRef.current.callbackToBounce.call(null, ...args),
            paramsRef.current.delay
         )
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
export function debouncedFnWrapper<T extends (...args: any[]) => any>({
   callbackToBounce,
   delay = DEFAULT_DELAY,
}: {
   callbackToBounce: T
   delay?: number
}) {
   let timerId: NodeJS.Timeout

   return {
      fn: (...args: Parameters<typeof callbackToBounce>) => {
         if (timerId) {
            clearTimeout(timerId)
         }
         timerId = setTimeout(() => callbackToBounce.call(null, ...args), delay)
      },
      cleanup: () => clearTimeout(timerId),
   }
}
