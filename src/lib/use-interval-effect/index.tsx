'use client'
import React, { useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 *  A React hook that executes a callback function at regular intervals, similar to `setInterval` but with additional control methods for clearing and restarting the timer.
 * 
 * @example
   import { useState } from 'react'
   import { useIntervalEffect } from 'classic-react-hooks'

   export default function Counter() {
      const [count, setCount] = useState(0)

      const { clearTimer, restartTimer } = useIntervalEffect({
         handler: () => setCount((prev) => prev + 1),
         interval: 1000, // 1 second
      })

      return (
         <div>
            <h2>Count: {count}</h2>
            <button onClick={clearTimer}>Pause</button>
            <button onClick={() => restartTimer()}>Resume</button>
            <button onClick={() => restartTimer(500)}>Speed Up (500ms)</button>
            <button onClick={() => restartTimer(2000)}>Slow Down (2s)</button>
         </div>
      )
   }
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
      intervalId.current = setInterval(() => paramsRef.current.handler(), interval)
      return handlers.current.clearTimer
   }, [interval])

   return {
      clearTimer: handlers.current.clearTimer,
      restartTimer: handlers.current.restartTimer,
   }
}
