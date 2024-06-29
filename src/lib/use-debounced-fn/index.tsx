'use client'
import React, { useRef } from 'react'
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

   const debouncedCb = useRef(debouncedFnWrapper(paramsRef.current.cb, paramsRef.current.delay))
   return debouncedCb.current
}

/**
 * @description
 *  A wrapper function which is used internally in `useDebouncedFn` hook.
 */
export function debouncedFnWrapper<T extends (...args: any[]) => any>(cb: T, delay = DEFAULT_DELAY) {
   let timerId: NodeJS.Timeout
   return (...args: Parameters<typeof cb>) => {
      if (timerId) {
         clearTimeout(timerId)
      }
      timerId = setTimeout(() => cb.call(null, ...args), delay)
   }
}
