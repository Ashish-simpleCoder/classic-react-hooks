'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 * A hook which fires the provided callback only once when the given timeout is passed, just like the setTimeout.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-timeout-effect.html
 */
export default function useTimeoutEffect(cb: () => void, timeout = 100) {
   let paramsRef = useSyncedRef({
      cb,
      timeout,
   })
   const timeoutId = useRef<NodeJS.Timeout>()

   const clearTimer = useCallback(() => {
      clearTimeout(timeoutId.current)
   }, [])

   const restartTimer = useCallback((new_timeout?: number) => {
      clearTimer()
      timeoutId.current = setTimeout(paramsRef.current.cb, new_timeout ?? paramsRef.current.timeout)
   }, [])

   useEffect(() => {
      timeoutId.current = setTimeout(paramsRef.current.cb, paramsRef.current.timeout)
      return clearTimer
   }, [])

   return {
      clearTimer,
      restartTimer,
   }
}
