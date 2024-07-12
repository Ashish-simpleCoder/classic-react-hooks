'use client'
import React, { useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

const DEFAULT_DELAY = 300

/**
 * @description
 *  A hook which returns a throttled function.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-throttled-fn.html
 *
 */
export default function useThrottledFn<T extends (...args: any[]) => any>(cb: T, delay = DEFAULT_DELAY) {
   const paramsRef = useSyncedRef({
      cb,
      delay,
   })

   const throttledCb = useRef(throttledFnWrapper(paramsRef.current.cb, paramsRef.current.delay))
   return throttledCb.current
}

/**
 * @description
 *  A wrapper function which is used internally in `useThrttledFn` hook.
 */
export function throttledFnWrapper<T extends (...args: any[]) => any>(cb: T, delay = DEFAULT_DELAY) {
   let lastExecutionTime = 0

   return function (...args: Parameters<typeof cb>) {
      const currentTime = Date.now()

      if (currentTime - lastExecutionTime >= delay) {
         // @ts-ignore
         cb.call(this, ...args)
         lastExecutionTime = currentTime
      }
   }
}
