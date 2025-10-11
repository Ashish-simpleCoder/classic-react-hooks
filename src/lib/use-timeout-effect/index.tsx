'use client'
import React, { useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 * A React hook that fires a provided callback after a specified timeout, similar to `setTimeout`, but with additional control methods for clearing and restarting the timer.
 *
 * @example
 * import { useState } from 'react'
   import useTimeoutEffect from './useTimeoutEffect'

   export default function BasicExample() {
      const [message, setMessage] = useState('')

      useTimeoutEffect({
         handler: () => {
            setMessage('Timer executed!')
         },
         timeout: 2000,
      })

      return <div>{message}</div>
   }
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
      timeoutId.current = setTimeout(() => paramsRef.current.handler(), timeout)
      return handlers.current.clearTimer
   }, [timeout])

   return {
      clearTimer: handlers.current.clearTimer,
      restartTimer: handlers.current.restartTimer,
   }
}
