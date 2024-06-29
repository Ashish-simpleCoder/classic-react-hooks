'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 *  A hook which fires the provided callback every time when the given interval is passed, just like the setInterval.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-interval-effect.html
 */
export default function useIntervalEffect(cb: () => void, interval = 100) {
   let paramsRef = useSyncedRef({
      cb,
      interval,
   })
   const intervalId = useRef<NodeJS.Timeout>()

   const clearTimer = useCallback(() => {
      clearInterval(intervalId.current)
   }, [])

   const restartTimer = useCallback((new_interval?: number) => {
      clearTimer()
      intervalId.current = setInterval(paramsRef.current.cb, new_interval ?? paramsRef.current.interval)
   }, [])

   useEffect(() => {
      intervalId.current = setInterval(paramsRef.current.cb, paramsRef.current.interval)
      return clearTimer
   }, [])

   return {
      clearTimer,
      restartTimer,
   }
}
