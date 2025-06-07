'use client'
import React, { useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 * A hook which fires the provided callback only once when the given timeout is passed, just like the setTimeout.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-timeout-effect.html
 */
export default function useTimeoutEffect({ handler, timeout = 100 }: { handler: () => void; timeout?: number }) {
   let paramsRef = useSyncedRef({
      handler,
      timeout,
   })
   const timeoutId = useRef<NodeJS.Timeout>()

   const handlers = useRef({
      clearTimer: () => clearTimeout(timeoutId.current),
      restartTimer: (new_interval?: number) => {
         handlers.current.clearTimer()
         timeoutId.current = setTimeout(() => paramsRef.current.handler(), new_interval ?? paramsRef.current.timeout)
      },
   })

   useEffect(() => {
      timeoutId.current = setTimeout(() => paramsRef.current.handler(), paramsRef.current.timeout)
      return handlers.current.clearTimer
   }, [])

   return {
      clearTimer: handlers.current.clearTimer,
      restartTimer: handlers.current.restartTimer,
   }
}
