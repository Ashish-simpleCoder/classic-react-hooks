import React, { useCallback, useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 * A hook which fires the provided callback only once when the given timeout is passed, just like the setTimeout.
 *  
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-timeout-effect
 *
 * @example
   import { useState } from 'react'
   import { useTimeoutEffect } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const [show, setShow] = useState(false)

      useTimeoutEffect(() => {
         console.log("use-timeout-callback")
         setShow(true)
      }, 2000)

      return (
         <div>
            {show && <div>show</div>}
         </div>
      )
   }
*/
export default function useTimeoutEffect(cb: () => void, timeout = 0) {
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
