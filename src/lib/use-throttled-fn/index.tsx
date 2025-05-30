'use client'
import React, { useRef } from 'react'

const DEFAULT_DELAY = 300

/**
 * @description
 *  A hook which returns a throttled function.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-throttled-fn.html
 *
 */
export default function useThrottledFn<T extends (...args: any[]) => any>({
   callbackToThrottle,
   delay,
}: {
   callbackToThrottle: T
   delay?: number
}) {
   const paramsRef = useRef({
      callbackToThrottle,
      delay,
   })

   // tracking props with immutable object
   paramsRef.current.delay = delay
   paramsRef.current.callbackToThrottle = callbackToThrottle

   // so can access the updated props inside debouncedFnWrapper function
   const throttledCb = useRef(throttledFnWrapper(paramsRef.current))

   return throttledCb.current
}

/**
 * @description
 *  A wrapper function which is used internally in `useThrottledFn` hook.
 */
export function throttledFnWrapper<T extends (...args: any[]) => any>(props: {
   callbackToThrottle: T
   delay?: number
}) {
   let lastExecutionTime = 0

   return function (...args: Parameters<typeof props.callbackToThrottle>) {
      const currentTime = Date.now()

      if (currentTime - lastExecutionTime >= (props.delay ?? DEFAULT_DELAY)) {
         try {
            // @ts-expect-error -> making "this" as "any" type working
            props.callbackToThrottle.call(this, ...args)
         } catch (err) {
            throw err
         } finally {
            lastExecutionTime = currentTime
         }
      }
   }
}
