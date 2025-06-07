'use client'
import React, { useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 *  A hook which fires the provided callback every time when the given interval is passed, just like the setInterval.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-interval-effect.html
 */
export default function useIntervalEffect({ handler, interval = 100 }: { handler: () => void; interval?: number }) {
   let paramsRef = useSyncedRef({
      handler,
      interval,
   })
   const intervalId = useRef<NodeJS.Timeout>()

   const handlers = useRef({
      clearTimer: () => clearInterval(intervalId.current),
      restartTimer: (new_interval?: number) => {
         handlers.current.clearTimer()
         intervalId.current = setInterval(() => paramsRef.current.handler(), new_interval ?? paramsRef.current.interval)
      },
   })

   useEffect(() => {
      intervalId.current = setInterval(() => paramsRef.current.handler(), paramsRef.current.interval)
      return handlers.current.clearTimer
   }, [])

   return {
      clearTimer: handlers.current.clearTimer,
      restartTimer: handlers.current.restartTimer,
   }
}
