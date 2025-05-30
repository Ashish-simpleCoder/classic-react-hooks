'use client'
import React, { useEffect, useRef } from 'react'

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
   delay,
}: {
   callbackToBounce: T
   delay?: number
}) {
   const paramsRef = useRef({
      callbackToBounce,
      delay,
   })

   // tracking props with immutable object
   paramsRef.current.delay = delay
   paramsRef.current.callbackToBounce = callbackToBounce

   // so can access the updated props inside debouncedFnWrapper function
   const debouncedCb = useRef(debouncedFnWrapper(paramsRef.current))

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
export function debouncedFnWrapper<T extends (...args: any[]) => any>(props: { callbackToBounce: T; delay?: number }) {
   let timerId: NodeJS.Timeout

   return {
      fn: (...args: Parameters<typeof props.callbackToBounce>) => {
         if (timerId) {
            clearTimeout(timerId)
         }
         timerId = setTimeout(() => {
            try {
               props.callbackToBounce.call(null, ...args)
            } catch (err) {
               throw err
            }
         }, props.delay ?? DEFAULT_DELAY)
      },
      cleanup: () => clearTimeout(timerId),
   }
}
