import React, { useCallback, useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 *  A hook which fires the provided callback every time when the given interval is passed, just like the setInterval.
 *  
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-interval-effect
 *
 * @example
   import { useState } from 'react'
   import { useIntervalEffect } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const [counter, setCounter] = useState(0)
      const {clearTimer, restartTimer} = useIntervalEffect(() =>{
         setCounter(c => c+1)
      },1000)

      return (
         <div>
            <p>{counter}</p>
            <button onClick={clearTimer}>Pause timer</button>
            <button onClick={restartTimer}>Restart timer</button>
         </div>
      )
   }
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
